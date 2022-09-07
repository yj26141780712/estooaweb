import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';


interface FormItemError {
  required?: string;
  pattern?: string;
}

interface FormItem {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  required?: boolean;
  config?: any;
  options?: any;
  validators: ValidatorFn | ValidatorFn[] | null;
  errors?: FormItemError;
  [key: string]: any;
}

@Component({
  selector: 'app-userform',
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.scss']
})
export class UserformComponent implements OnInit {

  formGroup!: UntypedFormGroup;
  loading = false;
  isEdit = false;
  item: any;
  formItems: FormItem[] = [
    { name: 'test1', label: 'test1', placeholder: "", type: 'input', required: true, errors: { required: '请输入test1' }, validators: [Validators.required] },
    { name: 'test2', label: 'test2', placeholder: "", type: 'input-number', config: { min: -Infinity, max: Infinity, step: 1 }, errors: { required: '请输入test2' }, validators: [Validators.required] },
    { name: 'test3', label: 'test3', placeholder: "", type: 'select', options: [{ label: '123', value: '123' }], validators: null },
    { name: 'test4', label: 'test4', placeholder: "", type: 'date', config: { showTime: false }, validators: null },
    { name: 'test5', label: 'test5', placeholder: "", type: 'cascader', validators: null },
    { name: 'test6', label: 'test6', placeholder: "", type: 'input', validators: null },
    { name: 'test7', label: 'test7', placeholder: "", type: 'input', validators: null },
    { name: 'test8', label: 'test8', placeholder: "", type: 'input', validators: null },
    { name: 'test9', label: 'test9', placeholder: "", type: 'input', validators: null },
    { name: 'test10', label: 'test10', placeholder: "", type: 'input', validators: null },
    { name: 'test11', label: 'test11', placeholder: "", type: 'input', validators: null },
  ];
  constructor(private fb: FormBuilder, @Inject(DOCUMENT) doc: NzSafeAny) {
    this.formGroup = fb.group({});
    this.formItems.forEach(i => {
      const control = new FormControl(null, { validators: i.validators });
      this.formGroup.addControl(i.name, control);
    });
    doc.title = '填写基本信息';
  }

  ngOnInit(): void {

  }

  submit() {
    for (const key in this.formGroup.controls) {
      this.formGroup.controls[key].markAsDirty();
      this.formGroup.controls[key].updateValueAndValidity();
    }
    console.log(123);
  }
}
