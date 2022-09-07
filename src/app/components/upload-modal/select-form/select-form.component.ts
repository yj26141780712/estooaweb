import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { format } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzBytesPipe } from 'ng-zorro-antd/pipes';
import { NzTableSize, NzTableSortOrder, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { delay, Subject, takeUntil, throwIfEmpty } from 'rxjs';
import { AttachmentService } from 'src/app/api/attachment.service';
import { Global } from 'src/app/services/global';
import { TableColumn } from 'src/app/types/table-column';
import { changeSortArray, dateRangeToString } from 'src/app/utils/convert';
import { SelectFile } from '../upload-modal.service';

@Component({
  selector: 'app-select-form',
  templateUrl: './select-form.component.html',
  styleUrls: ['./select-form.component.scss']
})
export class SelectFormComponent implements OnInit {

  uploadAction = Global.domain + 'attachment/upload';
  multiple = false;
  callback = (ids: SelectFile[]) => { };
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
  columns: TableColumn[] = [
    { key: 'id', title: 'ID', checked: true },
    { key: 'preview', title: '预览', checked: true },
    { key: 'filename', title: '文件名', checked: true },
    { key: 'filedesc', title: '文件描述', checked: false },
    {
      key: 'filesize', title: '文件大小', checked: true, change: (value) => {
        return new NzBytesPipe().transform(value);
      }
    },
    { key: 'suffix', title: '类型', checked: true },
    { key: 'mimetype', title: 'MIME类型', checked: true },
    { key: 'createTime', title: '创建日期', checked: true, showSort: true, change: (value: any) => value ? format(new Date(value), 'yyyy-MM-dd') : '' },
    { key: 'filepath', title: '物理路径', checked: false }
  ];
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
  checkedFiles: any[] = [];
  alertMessage = '';
  destroy$ = new Subject();
  @ViewChild('tableBody') tableBodyEl!: ElementRef;
  uploading = false;

  getUrl(item: any) {
    if (item.mimetype.startsWith('image')) {
      return item.url;
    } else {
      const suffix = item.suffix;
      return Global.domain + 'attachment/suffixImage?suffix=' + suffix;
    }
  }

  constructor(private fb: UntypedFormBuilder,
    private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private attachmentService: AttachmentService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: [null],
      createTime: [null]
    });
    this.initList();
    this.attachmentService.getAttachmentTypeList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(json => {
        if (json.code === 200) {
          this.tabs = json.data;
        }
      });
  }

  initList() {
    this.loading = true;
    this.attachmentService.getAttachmentList({
      ...this.formGroup.value,
      mimetype: this.selectedIndex > 0 ? this.tabs[this.selectedIndex - 1] && this.tabs[this.selectedIndex - 1].value : '',
      createTime: this.formGroup.value.createTime && dateRangeToString(this.formGroup.value.createTime),
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
    const noCheckedIds = this.checkedFiles.filter(f => !this.setOfCheckedId.has(f.id)).map(f => f.id);
    if (noCheckedIds && noCheckedIds.length > 0) {
      noCheckedIds.forEach(id => {
        const index = this.checkedFiles.findIndex(x => x.id === id);
        if (index > -1) {
          this.checkedFiles.splice(index, 1);
        }

      });
    }
    //当页选中文件
    const checkedData = listOfEnabledData.filter(f => this.setOfCheckedId.has(f.id));
    checkedData.forEach(f => {
      const index = this.checkedFiles.findIndex(x => x.id === f.id);
      if (index === -1) {
        this.checkedFiles.push(f);
      }
    })
    this.alertMessage = `跨页选择模式,已选择${this.checkedFiles.length}项`
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
    this.callback([{
      id: item.id,
      url: item.url,
      name: item.name,
    }]);
    this.modalRef.destroy();
  }

  selectItems() {
    this.callback(this.checkedFiles.map(f => {
      return {
        id: f.id,
        name: f.filename,
        url: f.url
      };
    }));
    this.modalRef.destroy();
  }
}
