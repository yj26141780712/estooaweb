import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DocterService } from 'src/app/api/docter.service';
import { HospitalService } from 'src/app/api/hospital.service';

@Component({
  selector: 'app-docter-form',
  templateUrl: './docter-form.component.html',
  styleUrls: ['./docter-form.component.scss']
})
export class DocterFormComponent implements OnInit {

  formGroup!: FormGroup;
  isEdit = false;
  item: any;
  hospitalOptions: Array<{ label: string, value: string }> = [];
  fileList: NzUploadFile[] = [];
  image: any;
  loading = false;
  constructor(private fb: FormBuilder,
    private modalRef: NzModalRef,
    private nzImageService: NzImageService,
    private nzMessageService: NzMessageService,
    private hospitalSeveice: HospitalService,
    private docterService: DocterService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      'phone': [
        { value: this.item && this.item.account && this.item.account.phone || '', disabled: this.isEdit },
        [
          Validators.required,
          Validators.pattern(`^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])[0-9]{8}$`)
        ]
      ],
      'name': ['', Validators.required],
      'photoId': [0],
      'hospitalId': [0],
      'category': [''],
      'jobLevel': [''],
      'introduction': [''],
      'majorField': ['']
    });
    if (this.item) {
      for (const key in this.formGroup.value) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
      if (this.item.photo) {
        this.fileList = [
          {
            uid: this.item.photo.id,
            name: this.item.photo.name,
            status: 'done',
            url: this.item.photo.url
          }
        ];
        this.image = {
          src: this.item.photo.url
        };
      }
    }
    this.hospitalSeveice
      .getHospitalSelectList()
      .subscribe(json => {
        if (json.code === 200) {
          this.hospitalOptions = json.data.map((x: any) => {
            return { label: x.name, value: x.id };
          });
        }
      });
  }

  beforeUpload = (file: NzUploadFile) => {
    this.fileList = [file];
    const image: any = new Image();
    const reader: FileReader = new FileReader();
    reader.onloadend = () => {
      image.src = reader.result;
      this.image = image;
    };
    reader.readAsDataURL(file as any);
    return false;
  }

  preview(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.nzImageService.preview([this.image], {});
  }

  delete(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.fileList = [];
    this.image = null;
  }

  cancle() {
    this.modalRef.destroy();
  }

  submit() {
    for (const key in this.formGroup.controls) {
      this.formGroup.controls[key].markAsDirty();
      this.formGroup.controls[key].updateValueAndValidity();
    }
    if (this.formGroup.invalid) {
      return;
    }
    this.loading = true;
    const formData = new FormData();
    for (const key in this.formGroup.value) {
      formData.append(key, this.formGroup.value[key]);
    }
    const photo = this.fileList[0];
    const photoId = this.item?.photo?.id;
    if (photo && (!this.item || (this.item && photo.uid !== photoId))) {
      formData.append('photo', this.fileList[0] as any);
    }
    if (this.isEdit) {
      this.docterService.updateDocterById(formData, this.item.id)
        .subscribe(json => {
          if (json.code === 200) {
            this.nzMessageService.success('操作成功！')
            this.modalRef.destroy();
            this.docterService.refreshDocterList();
          }
          this.loading = false;
        });
    } else {

      this.docterService.createDocter(formData)
        .subscribe(json => {
          if (json.code === 200) {
            this.nzMessageService.success('操作成功！')
            this.modalRef.destroy();
            this.docterService.refreshDocterList();
          }
          this.loading = false;
        });
    }
  }
}
