import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  checkFormValid(validateForm: FormGroup) {
    for (const i in validateForm.controls) {
      validateForm.controls[i].markAsDirty();
      validateForm.controls[i].updateValueAndValidity();
    }
    return validateForm.valid;
  }
}
