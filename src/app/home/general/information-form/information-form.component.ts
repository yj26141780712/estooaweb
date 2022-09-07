import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { InformationService } from 'src/app/api/information.service';

@Component({
  selector: 'app-information-form',
  templateUrl: './information-form.component.html',
  styleUrls: ['./information-form.component.scss']
})
export class InformationFormComponent implements OnInit {

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
    private informationService: InformationService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      'title': ['', Validators.required],
      'content': ['', Validators.required],
      'imgId': [0]
    });
    if (this.item) {
      for (const key in this.formGroup.value) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
      if (this.item.img) {
        this.fileList = [
          {
            uid: this.item.img.id,
            name: this.item.img.name,
            status: 'done',
            url: this.item.img.url
          }
        ];
        this.image = {
          src: this.item.img.url
        };
      }
    }
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
    const img = this.fileList[0];
    const imgId = this.item?.img?.id;
    if (img && (!this.item || (this.item && img.uid !== imgId))) {
      formData.append('img', this.fileList[0] as any);
    }
    if (this.isEdit) {
      this.informationService.updateInformationById(formData, this.item.id)
        .subscribe(json => {
          if (json.code === 200) {
            this.nzMessageService.success('操作成功！')
            this.modalRef.destroy();
            this.informationService.refreshInformationList();
          }
          this.loading = false;
        });
    } else {
      this.informationService.createInformation(formData)
        .subscribe(json => {
          if (json.code === 200) {
            this.nzMessageService.success('操作成功！')
            this.modalRef.destroy();
            this.informationService.refreshInformationList();
          }
          this.loading = false;
        });
    }
  }

}
