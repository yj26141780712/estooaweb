import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { format } from 'date-fns';
import { NzImage, NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams, NzTableSize, NzTableSortOrder } from 'ng-zorro-antd/table';
import { Subject, takeUntil, delay } from 'rxjs';
import { DeviceService } from 'src/app/api/device.service';
import { SearchCondition } from 'src/app/types/search-conditon';
import { TableColumn } from 'src/app/types/table-column';
import { changeSortArray } from 'src/app/utils/convert';
import { isFullscreenForNoScroll, exitFullScreen, openFullscreen } from 'src/app/utils/fullscreen';
import { DescriptionFormComponent } from '../description-form/description-form.component';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {

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
    { key: 'sn', title: '编号', checked: true },
    { key: 'name', title: '名称', checked: true, },
    { key: 'coverImage', title: '图片', checked: true, },
    { key: 'desc', title: '设备介绍', checked: true, },
    { key: 'useRange', title: '适用范围', checked: true, },
    { key: 'updateTime', title: '最近修改时间', checked: true, change: (value) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : '' },
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
    private deviceService: DeviceService) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.initList();
    this.deviceService.refreshModelList$
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
      sn: [''],
      name: ['']
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
    this.deviceService.getModelList(condition)
      .pipe(delay(300), takeUntil(this.destroy$))
      .subscribe(json => {
        if (json.code === 200) {
          this.tableData = json.data;
          this.total = json.total
        }
        this.loading = false;
      })
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

  // add() {
  //   this.modalService.create({
  //     nzTitle: '新增',
  //     nzContent: ModelFormComponent,
  //     nzComponentParams: {
  //       // allMenus: this.allMenus
  //     },
  //     nzKeyboard: false
  //   })
  // }

  edit(e: MouseEvent, item: any) {
    this.modalService.create({
      nzTitle: '编辑',
      nzContent: DescriptionFormComponent,
      nzWidth: 800,
      nzComponentParams: {
        isEdit: true,
        item
      }
    })
  }

  // delete(e: MouseEvent, item: any) {
  //   this.modalService.confirm({
  //     nzTitle: '确定要删除？',
  //     nzOnOk: () => {
  //       console.log(item);
  //       this.deviceService.deleteModelById(item.id)
  //         .pipe(takeUntil(this.destroy$))
  //         .subscribe(json => {
  //           if (json.code === 200) {
  //             this.messageService.success('操作成功！');
  //             this.deviceService.refreshModelList();
  //           }
  //         });
  //     }
  //   })
  // }

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
}
