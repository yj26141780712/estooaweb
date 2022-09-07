import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Subject, takeUntil } from 'rxjs';
import { BaseinfoService } from 'src/app/api/baseinfo.service';
import { HospitalService } from 'src/app/api/hospital.service';
import { areasTocascaderOptions } from 'src/app/utils/convert';

@Component({
  selector: 'app-hospital-form',
  templateUrl: './hospital-form.component.html',
  styleUrls: ['./hospital-form.component.scss']
})
export class HospitalFormComponent implements OnInit, OnDestroy {

  formGroup!: FormGroup;
  formLoading = false;
  loading = false;
  isEdit = false;
  item: any;
  fileList: NzUploadFile[] = [];
  images: any[] = [];
  coverIndex = 0;
  destroy$ = new Subject();
  areaOptions: any;
  constructor(private modalRef: NzModalRef,
    private fb: FormBuilder,
    private nzImageService: NzImageService,
    private messageService: NzMessageService,
    private hospitalService: HospitalService,
    private baseinfoService: BaseinfoService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      image: ['', [Validators.required]],
      area: [null, [Validators.required]],
      address: ['', [Validators.required]]
    })
    if (this.item) {
      this.formLoading = true;
      for (const key in this.formGroup.controls) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
      this.formGroup.controls['area'].setValue([
        this.item.provinceId,
        this.item.cityId,
        this.item.areaId,
      ])
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
        this.formGroup.controls['image'].setValue('true');
      }

    }
    this.baseinfoService.getCitySelect()
      .pipe(takeUntil(this.destroy$))
      .subscribe(json => {
        if (json.code === 200) {
          this.areaOptions = areasTocascaderOptions(json.data);
        }
        console.log(this.areaOptions);
        this.formLoading = false;
      });
  }




  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }




  beforeUpload = (file: NzUploadFile): boolean => {
    const index = this.fileList.length;
    this.fileList = this.fileList.concat(file);
    const image: any = new Image();
    const reader: FileReader = new FileReader();
    reader.onloadend = () => {
      image.src = reader.result;
      this.images[index] = image;
      this.formGroup.controls['image'].setValue('ture');
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
    if (this.fileList.length === 0) {
      this.formGroup.controls['image'].setValue(null);
    }
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
    formData.append('name', this.formGroup.value.name);
    formData.append('desc', this.formGroup.value.desc);
    formData.append('areaId', this.formGroup.value.area[2]);
    formData.append('cityId', this.formGroup.value.area[1]);
    formData.append('provinceId', this.formGroup.value.area[0]);
    formData.append('address', this.formGroup.value.address);
    formData.append('coverIndex', this.coverIndex.toString());
    const oldImageIds: number[] = [];
    this.fileList.forEach((f: any) => {
      const find = (this.item?.images || []).find((x: any) => x.id === f.uid);
      if (find) {
        oldImageIds.push(f.uid);
      } else {
        formData.append('file[]', f);
      }
    });
    if (this.isEdit) {
      formData.append('oldIds', oldImageIds.join(','));
      this.hospitalService.updateHospitalById(formData, this.item.id)
        .subscribe(json => {
          if (json.code === 200) {
            this.messageService.success('操作成功！');
            this.modalRef.destroy();
            this.hospitalService.refreshHospitalList();
          }
          this.loading = false;
        })
    } else {

      this.hospitalService.createHospital(formData)
        .subscribe(json => {
          if (json.code === 200) {
            this.messageService.success('操作成功！');
            this.modalRef.destroy();
            this.hospitalService.refreshHospitalList();
          }
          this.loading = false;
        });
    }
  }
}
