import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BaseinfoService } from 'src/app/api/baseinfo.service';

@Component({
  selector: 'app-dict-type-form',
  templateUrl: './dict-type-form.component.html',
  styleUrls: ['./dict-type-form.component.scss']
})
export class DictTypeFormComponent implements OnInit {

  isEdit = false;
  item: any;
  formGroup!: FormGroup;
  loading = false;
  constructor(private fb: FormBuilder,
    private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private baseinfoService: BaseinfoService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      remark: [''],
      seq: ['0', [Validators.required]]
    });
    if (this.item) {
      for (const key in this.formGroup.value) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
    }
  }


  cancel() {
    console.log(123);
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
      this.baseinfoService.updateDictTypeById({
        ...this.formGroup.value,
        seq: Number(this.formGroup.value.seq || '0')
      }, this.item.id)
        .subscribe(json => {
          if (json.code === 200) {
            this.messageService.success('操作成功！');
            this.modalRef.destroy();
            this.baseinfoService.refreshDictTypeList();
          }
          this.loading = false;
        })
    } else {
      this.baseinfoService.createDictType({
        ...this.formGroup.value,
        seq: Number(this.formGroup.value.seq || '0')
      }).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.modalRef.destroy();
          this.baseinfoService.refreshDictTypeList();
        }
        this.loading = false;
      });
    }
  }
}
