import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { format } from 'date-fns';
import { NzImageService, NzImage } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableSize, NzTableSortOrder, NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject, takeUntil, delay } from 'rxjs';
import { BaseinfoService } from 'src/app/api/baseinfo.service';
import { Dispatch, ShopService } from 'src/app/api/shop.service';
import { SearchCondition } from 'src/app/types/search-conditon';
import { TableColumn } from 'src/app/types/table-column';
import { changeSortArray } from 'src/app/utils/convert';
import { isFullscreenForNoScroll, exitFullScreen, openFullscreen } from 'src/app/utils/fullscreen';
import { DispatchFormComponent } from '../dispatch-form/dispatch-form.component';
import { DispatchSelfetchFormComponent } from '../dispatch-selfetch-form/dispatch-selfetch-form.component';
import { DispatchStoreFormComponent } from '../dispatch-store-form/dispatch-store-form.component';
import { ProductRentPriceFormComponent } from '../product-rent-price-form/product-rent-price-form.component';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {

  tabs: Array<{ name: string, value: string }> = [];
  selectIndex = 0;
  type = Dispatch.express.toString();
  // serarh-from
  formGroup!: FormGroup;
  searchValue: any = {};
  // table
  total = 0;
  pageNum = 1;
  pageSize = 10;
  sortBy!: string;
  orderBy!: string;
  tableData: any[] = [];
  columns: TableColumn[] = [
    { key: 'model', title: '模板名称', checked: true },
    { key: 'updateTime', title: '最近修改时间', checked: true, change: (value) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : '' },
  ];
  expressColumns: TableColumn[] = [
    { key: 'areaText', title: '可配送区域', checked: true },
    { key: 'price', title: '运费(元)', checked: true, width: '200px' },
  ];
  loading = false;
  tableSize: NzTableSize = 'default';
  tablSorts: Array<{ key: string, value: NzTableSortOrder }> = [];
  allChecked = true;
  indeterminate = false;
  @ViewChild('tableBody') tableBodyEl!: ElementRef;
  destroy$ = new Subject();
  getFullscreen() {
    return isFullscreenForNoScroll();
  }

  constructor(private modalService: NzModalService,
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private nzImageService: NzImageService,
    private baseinfoService: BaseinfoService,
    private shopService: ShopService) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.initList();
    this.shopService.refreshDispatchList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.initList();
      });
    this.baseinfoService.getDictDataListByTypeId(60)
      .subscribe(json => {
        this.tabs = json.code === 200 ? json.data : []
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  setColumns() {
    this.type = this.tabs[this.selectIndex].value;
    if (this.type === Dispatch.express) {
      this.columns = [
        { key: 'name', title: '模板名称', checked: true },
        { key: 'updateTime', title: '最近修改时间', checked: true, change: (value) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : '' },
      ];
    } else {
      this.columns = [
        { key: 'name', title: '模板名称', checked: true },
        { key: 'store', title: '可配送门店', checked: true },
        { key: 'updateTime', title: '最近修改时间', checked: true, change: (value) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : '' },
      ];
    }
  }

  initSearchForm() {
    this.formGroup = this.fb.group({
      modelName: [''],
      title: ['']
    });
  }

  initList() {
    this.loading = true;
    const condition: SearchCondition = {
      ...this.searchValue,
      pageSize: this.pageSize,
      pageNum: this.pageNum,
      sortBy: this.sortBy,
      orderBy: this.orderBy
    };
    const type = this.tabs[this.selectIndex]?.value || Dispatch.express;
    this.shopService.getDispatchList(type, condition)
      .pipe(delay(300), takeUntil(this.destroy$))
      .subscribe(json => {
        if (json.code === 200) {
          this.tableData = json.data;
          this.total = json.total
        }
        this.loading = false;
      })
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
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
    const obj: any = {
      nzTitle: '新增',
      nzContent: this.getForm(),
      nzComponentParams: {},
      nzKeyboard: false
    }
    this.modalService.create(obj)
  }

  edit(e: MouseEvent, item: any) {
    const obj: any = {
      nzTitle: '编辑',
      nzContent: this.getForm(),
      nzComponentParams: {
        isEdit: true,
        item
      }
    };
    this.modalService.create(obj)
  }

  getForm() {
    if (this.type === Dispatch.express) {
      return DispatchFormComponent;
    } else if (this.type === Dispatch.store) {
      return DispatchStoreFormComponent
    } else if (this.type === Dispatch.selfetch) {
      return DispatchSelfetchFormComponent
    }
    return DispatchFormComponent;
  }

  delete(e: MouseEvent, item: any) {
    this.modalService.confirm({
      nzTitle: '确定要删除？',
      nzOnOk: () => {
        this.shopService.deleteDispatchById(this.type, item.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(json => {
            if (json.code === 200) {
              this.messageService.success('操作成功！');
              this.shopService.refreshDispatchList(this.type);
            }
          });
      }
    })
  }

  updateRentPrice(e: MouseEvent, item: any) {
    e.stopPropagation();
    e.preventDefault();
    console.log(item);
    this.modalService.create({
      nzTitle: '修改租金',
      nzContent: ProductRentPriceFormComponent,
      nzComponentParams: {
        item
      }
    })
  }

  refresh() {
    this.initList();
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

  selectedIndexChange(index: number) {
    this.selectIndex = index;
    this.setColumns();
    this.pageNum = 1;
    this.tableData = [];
    this.initList();
  }
}
