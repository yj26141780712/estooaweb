import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { AttachmentService } from 'src/app/api/attachment.service';
import { BaseForm } from '../../BaseForm';

@Component({
  selector: 'app-attachment-form',
  templateUrl: './attachment-form.component.html',
  styleUrls: ['./attachment-form.component.scss']
})
export class AttachmentFormComponent extends BaseForm implements OnInit {


  fileList: NzUploadFile[] = [];
  constructor(private fb: FormBuilder,
    modalRef: NzModalRef,
    private messageService: NzMessageService,
    private attachService: AttachmentService) {
    super(modalRef);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      'filevalue': [],
      'filename': [],
      'filedesc': []
    });
    if (this.item) {
      for (const key in this.formGroup.controls) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
      this.formGroup.controls['filename'].setValidators(Validators.required);
    } else {
      this.formGroup.controls['filevalue'].setValidators(Validators.required);
    }
  }

  beforeUpload = (file: NzUploadFile) => {
    this.fileList = [file];
    this.formGroup.controls['filevalue'].setValue('true');
    return false;
  }

  submit() {
    this.checkForm();
    if (this.formGroup.invalid) {
      return;
    }
    this.loading = true;
    if (this.item) {
      this.attachService.updateAttachment(this.formGroup.value, this.item.id)
        .subscribe(json => {
          if (json.code === 200) {
            this.messageService.success('操作成功！');
            this.close();
            this.attachService.refreshAttachmentList();
          }
          this.loading = false;
        })
    } else {
      const formData = new FormData();
      formData.append('file', this.fileList[0] as any);
      formData.append('filename', this.formGroup.value.filename || '');
      formData.append('filedesc', this.formGroup.value.filedesc || '');
      this.attachService.uploadAttachment(formData).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.close();
          this.attachService.refreshAttachmentList();
        }
        this.loading = false;
      });
    }
  }
}
