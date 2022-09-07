import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableSize, NzTableSortOrder, NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject, takeUntil, delay } from 'rxjs';
import { AccountService } from 'src/app/api/account.service';
import { BaseinfoService } from 'src/app/api/baseinfo.service';
import { TableColumn } from 'src/app/types/table-column';
import { changeSortArray } from 'src/app/utils/convert';
import { isFullscreenForNoScroll, exitFullScreen, openFullscreen } from 'src/app/utils/fullscreen';
import { DictDataFormComponent } from '../../baseinfo/dict-data-form/dict-data-form.component';

@Component({
  selector: 'app-profile-log',
  templateUrl: './profile-log.component.html',
  styleUrls: ['./profile-log.component.scss']
})
export class ProfileLogComponent implements OnInit {

  formGroup!: FormGroup;
  searchValue: any = {};
  total = 0;
  pageNum = 1;
  pageSize = 10;
  sortBy!: string;
  orderBy!: string;
  tableData: any[] = [];
  columns: TableColumn[] = [
    { key: 'url', title: '操作Api', checked: true },
    { key: 'ip', title: 'ip', checked: true },
    { key: 'createTime', title: '操作时间', checked: true }
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
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.initList();
  }

  ngOnDestroy() {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  initList() {
    this.loading = true;
    this.accountService.getLogList({
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
