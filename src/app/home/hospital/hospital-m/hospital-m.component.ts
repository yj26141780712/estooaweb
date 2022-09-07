import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { format } from 'date-fns';
import { NzImageService, NzImage } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableSize, NzTableSortOrder, NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject, takeUntil, delay } from 'rxjs';
import { HospitalService } from 'src/app/api/hospital.service';
import { TableColumn } from 'src/app/types/table-column';
import { changeSortArray } from 'src/app/utils/convert';
import { isFullscreenForNoScroll, exitFullScreen, openFullscreen } from 'src/app/utils/fullscreen';
import { HospitalFormComponent } from '../hospital-form/hospital-form.component';

@Component({
  selector: 'app-hospital-m',
  templateUrl: './hospital-m.component.html',
  styleUrls: ['./hospital-m.component.scss']
})
export class HospitalMComponent implements OnInit {

  formGroup!: FormGroup;
  searchValue: any = {};
  total = 0;
  pageNum = 1;
  pageSize = 10;
  sortBy!: string;
  orderBy!: string;
  tableData: any[] = [];
  columns: TableColumn[] = [
    {
      key: 'name', title: '医院名称', checked: true
    },
    {
      key: 'coverImage', title: '医院图片', checked: true
    },
    {
      key: 'desc', title: '医院简介', checked: true
    },
    {
      key: 'address', title: '医院地址', checked: true
    },
    {
      key: 'createTime', title: '创建时间', checked: true, showSort: true,
      change: (value: any) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : ''
    }
  ];
  loading = false;
  tableSize: NzTableSize = 'default';
  tablSorts: Array<{ key: string, value: NzTableSortOrder }> = [];
  allChecked = true;
  indeterminate = false;
  dictTypeOptions: Array<{ label: string, value: string }> = [];
  @ViewChild('tableBody') tableBodyEl!: ElementRef;
  destroy$ = new Subject();

  getFullscreen() {
    return isFullscreenForNoScroll();
  }

  getAddress(item: any) {
    return `${item.areaName}${item.cityName}${item.provinceName}${item.address}`;
  }

  constructor(private modalService: NzModalService,
    private messageService: NzMessageService,
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private nzImageService: NzImageService) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.initList();
    this.hospitalService.refreshHospital$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initList();
      });
  }

  ngOnDestroy() {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  initSearchForm() {
    this.formGroup = this.fb.group({
      name: [null]
    });
  }

  initList() {
    this.loading = true;
    this.hospitalService.getHospitalList({
      ...this.formGroup.value,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      orderBy: this.orderBy
    }).pipe(delay(300), takeUntil(this.destroy$))
      .subscribe(json => {
        if (json.code === 200) {
          this.tableData = [...json.data];
          this.total = json.total;
        }
        this.loading = false;
      });
  }

  search() {
    this.searchValue = { ...this.formGroup.value };
    this.initList();
  }

  reset() {
    this.formGroup.reset();
    this.searchValue = {};
    this.initList();
  }

  add() {
    this.modalService.create({
      nzTitle: '新增',
      nzContent: HospitalFormComponent,
      nzComponentParams: {},
      nzWidth: 800,
      nzKeyboard: false
    })
  }

  edit(e: MouseEvent, item: any) {
    this.modalService.create({
      nzTitle: '编辑',
      nzContent: HospitalFormComponent,
      nzWidth: 800,
      nzComponentParams: {
        isEdit: true,
        item
      }
    })
  }

  delete(e: MouseEvent, item: any) {
    e.stopPropagation();
    e.preventDefault();
    this.modalService.confirm({
      nzTitle: '确定要删除？',
      nzOnOk: () => {
        this.hospitalService.deleteHospitalById(item.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(json => {
            if (json.code === 200) {
              this.messageService.success('操作成功！');
              this.hospitalService.refreshHospitalList();
            }
          });
      }
    })
  }

  refresh(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.loading = true;
    this.hospitalService.getHospitalList({
      ...this.formGroup.value,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      orderBy: this.orderBy
    }).pipe(delay(300), takeUntil(this.destroy$))
      .subscribe(json => {
        if (json.code === 200) {
          this.tableData = [...json.data];
          this.total = json.total;
        }
        this.loading = false;
      });
  }

  setSize(size: NzTableSize) {
    this.tableSize = size;
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.columns = this.columns.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.columns = this.columns.map(item => ({
        ...item,
        checked: false
      }));
    }
  }

  updateSingleChecked(): void {
    if (this.columns.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.columns.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  resetColumns(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.allChecked = true;
    this.indeterminate = false;
    this.updateAllChecked();
  }

  fullscreen() {
    if (isFullscreenForNoScroll()) {
      exitFullScreen();
    } else {
      openFullscreen(this.tableBodyEl.nativeElement);
    }
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const { sort, pageIndex, pageSize, filter } = params;
    if (this.pageSize !== pageSize) {
      this.pageSize = pageSize;
      this.initList();
      return;
    }
    if (this.pageNum !== pageIndex) {
      this.pageNum = pageIndex;
      this.initList();
      return
    }
    const sorts = sort.filter(item => item.value !== null);
    const [isUpdate, arr] = changeSortArray<NzTableSortOrder>(sorts, this.tablSorts);
    if (isUpdate && Array.isArray(arr)) {
      this.tablSorts = [...arr];
      arr.reverse();
      this.sortBy = arr.map(x => x.key).join(',');
      this.orderBy = arr.map(x => x.value === 'ascend' ? 'asc' : 'desc').join(',');
      this.initList();
    }
  }

  preview(item: any) {
    if (item.images && Array.isArray(item.images)) {
      const findIndex = item.images.findIndex((x: any) => x.id === item.coverImageId);
      const arr: NzImage[] = item.images.map((x: any) => {
        return {
          src: x.url
        }
      });
      const ref = this.nzImageService.preview(arr);
      if (findIndex > -1) {
        ref.switchTo(findIndex);
      }
    }
  }


}
