import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams, NzTableSize, NzTableSortOrder } from 'ng-zorro-antd/table';
import { delay, Subject, takeUntil } from 'rxjs';
import { InformationService } from 'src/app/api/information.service';
import { SearchCondition } from 'src/app/types/search-conditon';
import { TableColumn } from 'src/app/types/table-column';
import { changeSortArray } from 'src/app/utils/convert';
import { exitFullScreen, isFullscreenForNoScroll, openFullscreen } from 'src/app/utils/fullscreen';
import { InformationFormComponent } from '../information-form/information-form.component';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {


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
    { key: 'title', title: '标题', checked: true },
    { key: 'content', title: '内容', checked: true, },
    { key: 'img', title: '图片', checked: true, },
    { key: 'createTime', title: '创建时间', checked: true, showSort: true },
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
    private informationService: InformationService) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.initList();
    this.informationService.refreshInformationList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initList();
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  initSearchForm() {
    this.formGroup = this.fb.group({
      title: [''],
      content: ['']
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
    this.informationService.getInformationList(condition)
      .pipe(delay(300), takeUntil(this.destroy$))
      .subscribe(json => {
        if (json.code === 200) {
          this.tableData = json.data;
          this.total = json.total
        }
        this.loading = false;
      })
  }

  preview(item: any) {
    if (item.img && item.img.url) {
      this.nzImageService.preview([
        {
          src: item.img.url
        }
      ]);
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
    this.modalService.create({
      nzTitle: '新增',
      nzContent: InformationFormComponent,
      nzWidth: 600,
      nzComponentParams: {
        // allMenus: this.allMenus
      },
      nzKeyboard: false
    })
  }

  edit(e: MouseEvent, item: any) {
    this.modalService.create({
      nzTitle: '编辑',
      nzContent: InformationFormComponent,
      nzWidth: 600,
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
        console.log(item);
        this.informationService.deleteInformationById(item.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(json => {
            if (json.code === 200) {
              this.messageService.success('操作成功！');
              this.informationService.refreshInformationList();
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
