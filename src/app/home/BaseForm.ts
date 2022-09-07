import { FormGroup } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";

export class BaseForm {

    formGroup!: FormGroup;
    loading = false;
    isEdit = false;
    item: any;
    constructor(private modalRef: NzModalRef) {

    }

    close() {
        this.modalRef.close();
    }

    checkForm() {
        for (const key in this.formGroup.controls) {
            this.formGroup.controls[key].markAsDirty();
            this.formGroup.controls[key].updateValueAndValidity();
        }
    }
}