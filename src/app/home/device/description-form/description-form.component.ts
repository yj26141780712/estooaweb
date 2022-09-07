import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DeviceService } from 'src/app/api/device.service';

@Component({
  selector: 'app-description-form',
  templateUrl: './description-form.component.html',
  styleUrls: ['./description-form.component.scss']
})
export class DescriptionFormComponent implements OnInit {

  isEdit = false;
  item: any;
  images: any[] = [];
  coverIndex = 0;
  formGroup!: FormGroup;
  loading = false;
  fileList: NzUploadFile[] = [];
  options: any;
  constructor(private fb: FormBuilder,
    private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private nzImageService: NzImageService,
    private deviceService: DeviceService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      sn: ['', [Validators.required]],
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      desc: ['', []],
      useRange: ['', []]
    });
    if (this.item) {
      for (const key in this.formGroup.value) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
      this.formGroup.controls['sn'].disable();
      if (this.item.images) {
        this.fileList = [...this.item.images.map((x: any) => {
          return {
            uid: x.id,
            name: x.name,
            status: 'done',
            url: x.url
          }
        })]
        this.fileList.forEach((f: NzUploadFile, index: number) => {
          if (f.uid === this.item.coverImageId) {
            this.coverIndex = index;
          }
          this.images[index] = { src: f.url };
        });
      }
    }
  }


  beforeUpload = (file: NzUploadFile): boolean => {
    const index = this.fileList.length;
    this.fileList = this.fileList.concat(file);
    const image: any = new Image();
    const reader: FileReader = new FileReader();
    reader.onloadend = () => {
      image.src = reader.result;
      this.images[index] = image;
    };
    reader.readAsDataURL(file as any);
    return false;
  }

  preview(e: MouseEvent, index: number) {
    e.stopPropagation();
    e.preventDefault();
    const ref = this.nzImageService.preview(this.images, {});
    ref.switchTo(index);
  }

  delete(e: MouseEvent, index: number) {
    e.stopPropagation();
    e.preventDefault();
    this.fileList.splice(index, 1);
    this.images.splice(index, 1);
  }

  cancel() {
    this.modalRef.destroy();
  }

  submitForm() {
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
    formData.append('coverIndex', this.coverIndex.toString());
    const oldImageIds: number[] = [];
    this.fileList.forEach((f: any) => {
      const find = this.item.images.find((x: any) => x.id === f.uid);
      if (find) {
        oldImageIds.push(f.uid);
      } else {
        formData.append('file[]', f);
      }
    });
    if (this.isEdit) {
      this.deviceService.updateModelDescById(formData, this.item.id)
        .subscribe(json => {
          if (json.code === 200) {
            this.messageService.success('操作成功！');
            this.modalRef.destroy();
            this.deviceService.refreshModelList();
          }
          this.loading = false;
        })
    }
  }
}
