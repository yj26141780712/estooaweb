import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { format, getHours, getMinutes } from 'date-fns';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { catchError, debounceTime, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { BaseinfoService } from 'src/app/api/baseinfo.service';
import { ShopService } from 'src/app/api/shop.service';
import { AreaSelectService } from 'src/app/components/area-select/area-select.service';
import { UploadModalService, SelectFile } from 'src/app/components/upload-modal/upload-modal.service';
import { CascaderOption } from 'src/app/types/Cascader-option';
import { areasTocascaderOptions } from 'src/app/utils/convert';


@Component({
  selector: 'app-store-form',
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.scss']
})
export class StoreFormComponent implements OnInit {

  isEdit = false;
  item: any;
  image!: { id: number, url: string } | null;
  coverIndex = 0;
  formGroup!: FormGroup;
  loading = false;
  // showAddress = false;
  areaOptions: Array<CascaderOption> = [];
  weekOptions: Array<{ value: string, label: string, checked: boolean }> = [];
  isSelectLoading = true;
  accountList: any[] = [];
  searchChange$ = new Subject<string>();
  destory$ = new Subject<void>();
  constructor(private fb: FormBuilder,
    private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private nzImageService: NzImageService,
    private uploadModalService: UploadModalService,
    private areaSelectService: AreaSelectService,
    private baseinfoService: BaseinfoService,
    private shopService: ShopService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: [null, [Validators.required]],
      realname: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      areaIds: [null, [Validators.required]],
      address: [''],
      accountIds: [null, [Validators.required]],
      store: [false],
      selfetch: [false],
      serviceProvinceIds: [''],
      serviceCityIds: [''],
      serviceAreaIds: [''],
      serviceAreaText: ['', Validators.required],
      startHour: [null, [Validators.required]],
      endHour: [null, [Validators.required]],
      openWeeks: [null]
    });
    this.weekOptions = this.shopService.weekList.map(x => {
      return {
        label: x[1].toString(),
        value: x[0].toString(),
        checked: true
      }
    });
    if (this.item) {
      this.isSelectLoading = false;
      for (const key in this.formGroup.value) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
      // 设置每天营业时间和一周营业天数
      if (this.item.openHours) {
        const hours = this.item.openHours.split(' - ');
        const start = hours[0] ? new Date(format(new Date(), `yyyy-MM-dd ${hours[0]}:00`)) : null;
        this.formGroup.controls['startHour'].setValue(start);
        const end = hours[1] ? new Date(format(new Date(), `yyyy-MM-dd ${hours[1]}:00`)) : null;
        this.formGroup.controls['endHour'].setValue(end);
      }
      if (this.item.openWeeks) {
        const weeks: string[] = this.item.openWeeks.split(',');
        this.weekOptions.forEach(x => {
          x.checked = weeks.indexOf(x.value) > -1;
        });
      }
      if (this.item.accounts) {
        this.accountList = this.item.accounts.map((x: any) => {
          return { id: x.id, phone: x.phone }
        });
        this.formGroup.controls['accountIds'].setValue(this.accountList.map(x => x.id));
        console.log(this.formGroup.value);
      }
      // 省市区
      const areaIds = [this.item.provinceId, this.item.cityId, this.item.areaId];
      this.formGroup.controls['areaIds'].setValue(areaIds);
      // 支持配送方式
      this.formGroup.controls['store'].setValue(this.item.store === '1');
      this.formGroup.controls['selfetch'].setValue(this.item.selfetch === '1');
    } else {
      const start = new Date(format(new Date(), 'yyyy-MM-dd 09:00:00'));
      const end = new Date(format(new Date(), 'yyyy-MM-dd 21:00:00'))
      this.formGroup.controls['startHour'].setValue(start);
      this.formGroup.controls['endHour'].setValue(end);
    }
    this.formGroup.controls['openWeeks'].setValue(
      this.weekOptions
        .filter(x => x.checked).map(x => x.value).join(',')
    );
    this.baseinfoService.getCitySelect()
      .pipe(takeUntil(this.destory$))
      .subscribe(json => {
        if (json.code === 200) {
          this.areaOptions = areasTocascaderOptions(json.data);
        }
      });
    const accountList = (phone: string) => {
      return this.shopService.getAccountListByPhone(phone).pipe(
        catchError(() => of([])),
        map((json: any) => json.code === 200 ? json.data : [])
      );
    }
    const optionList$: Observable<string[]> = this.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(accountList));
    optionList$.subscribe(data => {
      this.isSelectLoading = false;
      this.accountList = data;
    });
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  onSearch(value: string): void {
    this.isSelectLoading = true;
    this.searchChange$.next(value);
  }

  addImg() {
    this.uploadModalService.openSelect(this.selectImg);
  }

  selectImg = (files: SelectFile[]) => {
    const file = files[0];
    if (file) {
      this.image = {
        id: file.id,
        url: file.url
      }
    }
  }

  preview(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (this.image) {
      this.nzImageService.preview([
        {
          src: this.image.url
        }
      ], {});
    }
  }

  delete(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.image = null;
  }

  select(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.areaSelectService.openSelect(this.selectArea);
  }

  selectArea = (arr: any[]) => {
    console.log(arr);
    const provinces = arr.filter(n => n.level === 0);
    const citys = arr.filter(n => n.level === 1);
    const areas = arr.filter(n => n.level === 2);
    this.formGroup.controls['serviceProvinceIds'].setValue(provinces.map(x => x.key).join(','));
    this.formGroup.controls['serviceCityIds'].setValue(citys.map(x => x.key).join(','));
    this.formGroup.controls['serviceAreaIds'].setValue(areas.map(x => x.key).join(','));
    this.formGroup.controls['serviceAreaText'].setValue(arr.map(x => x.name).join(','));
  }

  startDisabledHours = () => {
    if (this.formGroup.value && this.formGroup.value.endHour) {
      const endHour = getHours(this.formGroup.value.endHour);
      const arr = [];
      for (let i = endHour + 1; i < 24; i++) {
        arr.push(i);
      }
      return arr;
    } else {
      return [];
    }
  }

  startDisabledMinutes = (hour: number) => {
    if (hour && this.formGroup.value.endHour) {
      const hours = getHours(this.formGroup.value.endHour);
      const minutes = getMinutes(this.formGroup.value.endHour);
      let disableMinutes = 0;
      if (hour < hours) {
        disableMinutes = 60;
      } else if (hour === hours) {
        disableMinutes = minutes;
      } else {
        disableMinutes = 0;
      }
      const arr = [];
      for (let i = disableMinutes; i < 60; i++) {
        arr.push(i);
      }
      return arr;
    }
    return [];
  }

  endDisabledHours = () => {
    if (this.formGroup.value && this.formGroup.value.startHour) {
      const endHour = getHours(this.formGroup.value.startHour);
      const arr = [];
      for (let i = 0; i < endHour; i++) {
        arr.push(i);
      }
      return arr;
    } else {
      return [];
    }
  }

  endDisabledMinutes = (hour: number) => {
    if (hour && this.formGroup.value.startHour) {
      const hours = getHours(this.formGroup.value.startHour);
      const minutes = getMinutes(this.formGroup.value.startHour);
      let disableMinutes = 0;
      if (hour < hours) {
        disableMinutes = 60;
      } else if (hour === hours) {
        disableMinutes = minutes + 1;
      } else {
        disableMinutes = 0;
      }
      const arr = [];
      for (let i = 0; i < disableMinutes; i++) {
        arr.push(i);
      }
      return arr;
    }
    return [];
  }

  cancel() {
    this.modalRef.destroy();
  }

  submitForm() {
    console.log(this.formGroup.value);
    for (const key in this.formGroup.controls) {
      this.formGroup.controls[key].markAsDirty();
      this.formGroup.controls[key].updateValueAndValidity();
    }
    if (this.formGroup.invalid) {
      return;
    }
    this.loading = true;
    const obj: any = {
      ...this.formGroup.value,
    }
    if (this.image?.id) {
      obj.imgId = this.image.id;
    }
    //省市区转换
    const areaIds = this.formGroup.value.areaIds;
    const province = this.areaOptions.find(x => x.value === areaIds[0]);
    obj.provinceId = province?.value;
    obj.provinceName = province?.label;
    const city = province?.children?.find(x => x.value === areaIds[1]);
    obj.cityId = city?.value;
    obj.cityName = city?.label;
    const area = city?.children?.find(x => x.value === areaIds[2]);
    obj.areaId = area?.value;
    obj.areaName = area?.label;
    //营业时间转换
    obj.openHours = `${format(obj.startHour, 'HH:mm')} - ${format(obj.endHour, 'HH:mm')}`;
    obj.openWeeks = this.weekOptions.filter(x => x.checked).map(x => x.value).join(',')
    //配送方式转换
    obj.store = obj.store ? '1' : '0';
    obj.selfetch = obj.selfetch ? '1' : '0';
    if (this.isEdit) {
      this.shopService.updateStoreById({ ...obj }, this.item.id).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.modalRef.destroy();
          this.shopService.refreshStoreList();
        }
        this.loading = false;
      })
    } else {
      this.shopService.createStore({ ...obj }).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.modalRef.destroy();
          this.shopService.refreshStoreList();
        }
        this.loading = false;
      })
    }
  }

}
