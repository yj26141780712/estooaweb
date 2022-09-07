import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams, NzTableSize, NzTableSortOrder } from 'ng-zorro-antd/table';
import { delay, Subject, takeUntil } from 'rxjs';
import { BaseinfoService } from 'src/app/api/baseinfo.service';
import { TableColumn } from 'src/app/types/table-column';
import { changeSortArray } from 'src/app/utils/convert';
import { exitFullScreen, isFullscreenForNoScroll, openFullscreen } from 'src/app/utils/fullscreen';
import { DictDataFormComponent } from '../dict-data-form/dict-data-form.component';

@Component({
  selector: 'app-dict-data',
  templateUrl: './dict-data.component.html',
  styleUrls: ['./dict-data.component.scss']
})
export class DictDataComponent implements OnInit, OnDestroy {

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
      key: 'dictTypeId', title: '字典', checked: true, change: (value: any) => {
        return this.dictTypeOptions.find(x => x.value === value)?.label;
      }
    },
    { key: 'name', title: '数据名称', checked: true },
    { key: 'value', title: '数据值', checked: true },
    { key: 'remark', title: '备注', checked: true },
    { key: 'seq', title: '排序', checked: true, showSort: true },
    { key: 'createTime', title: '创建时间', checked: true, showSort: true },
    { key: 'updateTime', title: '最近更新时间', checked: true, showSort: true },
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

  constructor(private modalService: NzModalService,
    private messageService: NzMessageService,
    private fb: FormBuilder,
    private baseinfoService: BaseinfoService) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.initList();
    this.baseinfoService.refreshDictDataList$
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
      dictTypeId: [null],
      name: [null],
      value: [null]
    });
    this.baseinfoService.getDictTypeList({})
      .pipe(takeUntil(this.destroy$))
      .subscribe(json => {
        if (json.code === 200) {
          this.dictTypeOptions = json.data.map((x: any) => {
            return { value: x.id, label: x.name };
          })
        }
      })
  }

  initList() {
    this.loading = true;
    this.baseinfoService.getDictDataList({
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
      nzContent: DictDataFormComponent,
      nzComponentParams: {
        // allMenus: this.allMenus
      },
      nzKeyboard: false
    })
  }

  edit(e: MouseEvent, item: any) {
    this.modalService.create({
      nzTitle: '编辑',
      nzContent: DictDataFormComponent,
      nzComponentParams: {
        isEdit: true,
        item
      }
    })
  }

  delete(e: MouseEvent, item: any) {
    this.modalService.confirm({
      nzTitle: '确定要删除？',
      nzOnOk: () => {
        this.baseinfoService.deleteDictDataById(item.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(json => {
            if (json.code === 200) {
              this.messageService.success('操作成功！');
              this.baseinfoService.refreshDictDataList();
            }
          });
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

}
