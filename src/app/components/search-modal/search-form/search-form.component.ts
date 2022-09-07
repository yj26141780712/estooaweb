import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTableSize, NzTableSortOrder, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Subject, Observable, of } from 'rxjs';
import { TableColumn } from 'src/app/types/table-column';
import { changeSortArray } from 'src/app/utils/convert';
import { SearchItem, SearchModalService } from '../search-modal.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {

  multiple = false;
  callback = (data: any[]) => { };
  searchItems: SearchItem[] = [];
  columns: TableColumn[] = [];
  dataLoading: (data: any) => Observable<any[]> = (data: any) => of([]);
  checkIds: number[] = [];
  formGroup!: UntypedFormGroup;
  searchValue: any = {};
  showSearch = false;
  total = 0;
  pageNum = 1;
  pageSize = 10;
  sortBy!: string;
  orderBy!: string;
  tableData: any[] = [];
  listOfCurrentPageData: readonly any[] = [];
  loading = false;
  tableSize: NzTableSize = 'default';
  tablSorts: Array<{ key: string, value: NzTableSortOrder }> = [];
  allChecked = true;
  indeterminate = false;
  dictTypeOptions: Array<{ label: string, value: string }> = [];
  selectedIndex = 0;
  tabs: any[] = [];
  tableChecked = false;
  tableIndeterminate = false;
  setOfCheckedId = new Set<number>();
  checkedItems: any[] = [];
  alertMessage = '';
  destroy$ = new Subject();
  @ViewChild('tableBody') tableBodyEl!: ElementRef;
  uploading = false;
  constructor(private fb: UntypedFormBuilder,
    private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private searchModalService: SearchModalService) { }

  ngOnInit(): void {
    this.checkIds.forEach((id: number) => {
      this.setOfCheckedId.add(id);
    })
    this.initForm();
    this.initList();
  }

  initForm() {
    this.formGroup = this.fb.group({});
    this.searchItems.forEach(item => {
      this.formGroup.addControl(item.key, new UntypedFormControl(''));
    });
  }

  initList() {
    this.loading = true;
    this.dataLoading({
      ...this.searchValue,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      orderBy: this.orderBy
    }).subscribe((datas: any[]) => {
      this.tableData = datas;
      this.loading = false;
    })
  }

  selectedIndexChange(index: number) {
    this.selectedIndex = index;
    this.pageNum = 1;
    this.initList();
  }

  handleChange(info: NzUploadChangeParam): void {
    this.uploading = true;
    if (info.file.status === 'done') {
      this.uploading = false;
      this.messageService.success('上传成功！');
      this.initList();
    } else if (info.file.status === 'error') {
      this.uploading = false;
      this.messageService.success('上传失败！');
    }
  }

  refresh() {
    this.initList();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  tableOnAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  tableOnCurrentPageDataChange(listOfCurrentPageData: readonly any[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.tableChecked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.tableIndeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.tableChecked;
    //未选中的文件id数组
    const noCheckedIds = this.checkedItems.filter(f => !this.setOfCheckedId.has(f.id)).map(f => f.id);
    if (noCheckedIds && noCheckedIds.length > 0) {
      noCheckedIds.forEach(id => {
        const index = this.checkedItems.findIndex(x => x.id === id);
        if (index > -1) {
          this.checkedItems.splice(index, 1);
        }

      });
    }
    //当页选中文件
    const checkedData = listOfEnabledData.filter(f => this.setOfCheckedId.has(f.id));
    checkedData.forEach(f => {
      const index = this.checkedItems.findIndex(x => x.id === f.id);
      if (index === -1) {
        this.checkedItems.push(f);
      }
    })
    this.alertMessage = `跨页选择模式,已选择${this.checkedItems.length}项`
  }

  tableOnItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }


  search() {
    this.searchValue = { ...this.formGroup.value };
    this.pageNum = 1;
    this.initList();
  }

  reset() {
    this.formGroup.reset();
    this.searchValue = {};
    this.initList();
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
    this.indeterminate = true;
    this.columns = this.columns.map(item => ({
      ...item,
      checked: !(item.key === 'filedesc' || item.key === 'filepath')
    }));
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

  selectItem($event: MouseEvent, item: any) {
    this.callback([item]);
    this.modalRef.destroy();
  }

  selectItems() {
    this.callback(this.checkedItems);
    this.modalRef.destroy();
  }

}
