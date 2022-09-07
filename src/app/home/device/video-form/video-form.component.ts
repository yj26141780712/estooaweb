import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DeviceService } from 'src/app/api/device.service';

@Component({
  selector: 'app-video-form',
  templateUrl: './video-form.component.html',
  styleUrls: ['./video-form.component.scss']
})
export class VideoFormComponent implements OnInit {

  isEdit = false;
  item: any;
  formGroup!: FormGroup;
  loading = false;
  fileList: NzUploadFile[] = [];
  image: any;
  videoFileList: NzUploadFile[] = [];
  video: any;
  constructor(private fb: FormBuilder,
    private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private nzImageService: NzImageService,
    private deviceService: DeviceService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      title: ['', [Validators.required]],
      remark: ['']
    });
    if (this.item) {
      for (const key in this.formGroup.value) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
      const img = this.item.cover;
      if (img) {
        this.fileList = [
          {
            uid: img.id,
            name: img.name,
            status: 'done',
            url: img.url
          }
        ];
        this.image = {
          src: img.url
        };
      }
      const video = this.item.video;
      if (video) {
        this.videoFileList = [
          {
            uid: video.id,
            name: video.name,
            status: 'done',
            url: video.url
          }
        ];
        this.video = {
          url: video.url
        }
      }
    }
  }


  beforeUpload = (file: NzUploadFile): boolean => {
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

  videoBeforeUpload = (file: NzUploadFile): boolean => {
    this.videoFileList = [file];
    this.video = {};
    return false;
  }

  preview(e: MouseEvent, action?: string) {
    e.stopPropagation();
    e.preventDefault();
    if (action === 'video') {

    } else {
      this.nzImageService.preview([this.image], {});
    }
  }

  delete(e: MouseEvent, action?: string) {
    e.stopPropagation();
    e.preventDefault();
    if (action === 'video') {
      this.videoFileList = [];
      this.video = null
    } else {
      this.fileList = [];
      this.image = null;
    }
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
    const cover = this.fileList[0];
    const coverId = this.item?.cover?.id;
    console.log(cover.uid, coverId)
    if (cover && (!this.item || (this.item && cover.uid !== coverId))) {
      formData.append('cover', this.fileList[0] as any);
    }
    const video = this.videoFileList[0];
    const videoId = this.item?.cover?.id;
    if (video && (!this.item || (this.item && video.uid !== videoId))) {
      formData.append('video', this.videoFileList[0] as any);
    }
    if (this.isEdit) {
      this.deviceService.updateVideoById(formData, this.item.id)
        .subscribe(json => {
          if (json.code === 200) {
            this.messageService.success('操作成功！');
            this.modalRef.destroy();
            this.deviceService.refreshVideoList();
          }
          this.loading = false;
        })
    } else {
      this.deviceService.createVideo(formData).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.modalRef.destroy();
          this.deviceService.refreshVideoList();
        }
        this.loading = false;
      })
    }
  }

}
