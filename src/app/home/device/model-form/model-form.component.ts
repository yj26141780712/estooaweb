import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DeviceService } from 'src/app/api/device.service';

@Component({
  selector: 'app-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.scss']
})
export class ModelFormComponent implements OnInit {

  isEdit = false;
  item: any;
  formGroup!: FormGroup;
  loading = false;
  constructor(private fb: FormBuilder,
    private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private deviceService: DeviceService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      sn: ['', [Validators.required]],
      name: ['', [Validators.required]],
      code: ['', [Validators.required]]
    });
    if (this.item) {
      for (const key in this.formGroup.value) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
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
    if (this.isEdit) {
      this.deviceService.updateModelById({
        ...this.formGroup.value
      }, this.item.id)
        .subscribe(json => {
          if (json.code === 200) {
            this.messageService.success('操作成功！');
            this.modalRef.destroy();
            this.deviceService.refreshModelList();
          }
          this.loading = false;
        })
    } else {
      this.deviceService.createModel({
        ...this.formGroup.value
      }).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.modalRef.destroy();
          this.deviceService.refreshModelList();
        }
        this.loading = false;
      });
    }
  }
}
