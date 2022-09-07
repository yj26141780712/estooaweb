import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BaseinfoService } from 'src/app/api/baseinfo.service';

@Component({
  selector: 'app-dict-data-form',
  templateUrl: './dict-data-form.component.html',
  styleUrls: ['./dict-data-form.component.scss']
})
export class DictDataFormComponent implements OnInit {

  isEdit = false;
  item: any;
  formGroup!: FormGroup;
  dictTypeOptions: Array<{ label: string, value: string }> = [];
  loading = false;
  constructor(private fb: FormBuilder,
    private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private baseinfoService: BaseinfoService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      dictTypeId: [null, Validators.required],
      name: ['', [Validators.required]],
      value: ['', [Validators.required]],
      remark: [''],
      seq: ['0']
    });
    if (this.item) {
      for (const key in this.formGroup.value) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
    }
    this.baseinfoService.getDictTypeList({}).subscribe(json => {
      if (json.code === 200) {
        this.dictTypeOptions = json.data.map((x: any) => {
          return { label: x.name, value: x.id };
        });
        console.log(this.dictTypeOptions);
      }
    })
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
      this.baseinfoService.updateDictDataById({
        ...this.formGroup.value,
        seq: Number(this.formGroup.value.seq || '0')
      }, this.item.id)
        .subscribe(json => {
          if (json.code === 200) {
            this.messageService.success('操作成功！');
            this.modalRef.destroy();
            this.baseinfoService.refreshDictDataList();
          }
          this.loading = false;
        })
    } else {
      this.baseinfoService.createDictData({
        ...this.formGroup.value,
        seq: Number(this.formGroup.value.seq || '0')
      }).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.modalRef.destroy();
          this.baseinfoService.refreshDictDataList();
        }
        this.loading = false;
      });
    }
  }
}
