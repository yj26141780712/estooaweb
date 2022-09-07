import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { format } from 'date-fns';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableSize, NzTableSortOrder, NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject, takeUntil, delay } from 'rxjs';
import { PatientService } from 'src/app/api/patient.service';
import { TableColumn } from 'src/app/types/table-column';
import { changeSortArray } from 'src/app/utils/convert';
import { isFullscreenForNoScroll, exitFullScreen, openFullscreen } from 'src/app/utils/fullscreen';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {

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
      key: 'name', title: '姓名', checked: true
    },
    {
      key: 'sex', title: '性别', checked: true, change: (value: any) => ['男', '女'][value - 1]
    },
    {
      key: 'birthday', title: '出生年月', checked: true
    },
    {
      key: 'city', title: '所在城市', checked: true
    },
    {
      key: 'phone', title: '联系方式', checked: true
    },
    {
      key: 'school', title: '学校', checked: true
    },
    {
      key: 'createTime', title: '创建时间', checked: true, showSort: true, change: (value: any) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : ''
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
    return item['area'].replace(/,/g, '') + item['address'];
  }

  constructor(private modalService: NzModalService,
    private messageService: NzMessageService,
    private fb: FormBuilder,
    private nzImageService: NzImageService,
    private patientService: PatientService) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.initList();
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
    this.patientService.getPatientList({
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

  // add() {
  //   this.modalService.create({
  //     nzTitle: '新增',
  //     nzContent: DocterFormComponent,
  //     nzComponentParams: {},
  //     nzWidth: 800,
  //     nzKeyboard: false
  //   })
  // }

  // edit(e: MouseEvent, item: any) {
  //   this.modalService.create({
  //     nzTitle: '编辑',
  //     nzContent: DocterFormComponent,
  //     nzWidth: 800,
  //     nzComponentParams: {
  //       isEdit: true,
  //       item
  //     }
  //   })
  // }

  // delete(e: MouseEvent, item: any) {
  //   this.modalService.confirm({
  //     nzTitle: '确定要删除？',
  //     nzOnOk: () => {
  //       this.docterService.deleteDocterById(item.id)
  //         .pipe(takeUntil(this.destroy$))
  //         .subscribe(json => {
  //           if (json.code === 200) {
  //             this.messageService.success('操作成功！');
  //             this.docterService.refreshDocterList();
  //           }
  //         });
  //     }
  //   })
  // }

  refresh(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
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
    if (item.photo && item.photo.url) {
      this.nzImageService.preview([
        {
          src: item.photo.url
        }
      ]);
    }
  }

}
