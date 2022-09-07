import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { delay, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableColumn } from 'src/app/types/table-column';
import { NzTableQueryParams, NzTableSize, NzTableSortOrder } from 'ng-zorro-antd/table';
import { exitFullScreen, isFullscreenForNoScroll, openFullscreen } from 'src/app/utils/fullscreen';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BaseinfoService } from 'src/app/api/baseinfo.service';
import { changeSortArray } from 'src/app/utils/convert';
import { AccountService } from 'src/app/api/account.service';
import { CACHE_ACCOUNT_LEVEL_ID, CACHE_ACCOUNT_TYPE_ID } from 'src/app/services/global';
import { RoleService } from 'src/app/api/role.service';
import { format } from 'date-fns';
import { AccountFormComponent } from '../account-form/account-form.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

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
      key: 'account', title: '账号', checked: true
    },
    {
      key: 'nickname', title: '昵称', checked: true
    },
    { key: 'phone', title: '手机号码', checked: true },
    {
      key: 'accountType', title: '账号类型', checked: true,
      change: (value: any) => { return this.typeOptions.find(x => x.value === value)?.label }
    },
    {
      key: 'accountLevel', title: '账号等级', checked: true,
      change: (value: any) => { return this.levelOptions.find(x => x.value === value)?.label }
    },
    {
      key: 'roleId', title: '角色', checked: true,
      change: (value: any) => { return this.roleOptions.find(x => x.value === value)?.label }
    },
    {
      key: 'createTime', title: '创建时间', checked: true,
      change: (value: any) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : ''
    },
    {
      key: 'updateTime', title: '最近更新时间', checked: true,
      change: (value: any) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : ''
    },
  ];
  loading = false;
  tableSize: NzTableSize = 'default';
  tablSorts: Array<{ key: string, value: NzTableSortOrder }> = [];
  allChecked = true;
  indeterminate = false;
  typeOptions: Array<{ label: string, value: string }> = [];
  levelOptions: Array<{ label: string, value: string }> = [];
  roleOptions: Array<{ label: string, value: string }> = [];
  @ViewChild('tableBody') tableBodyEl!: ElementRef;
  destroy$ = new Subject();

  getFullscreen() {
    return isFullscreenForNoScroll();
  }

  constructor(private modalService: NzModalService,
    private messageService: NzMessageService,
    private fb: FormBuilder,
    private accountService: AccountService,
    private baseinfoService: BaseinfoService,
    private roleService: RoleService) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.initList();
    this.accountService.refreshAccountList$
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
      account: [null],
      phone: [null],
      accountType: [null],
      accountLevel: [null],
      roleId: [null],
    });
    this.baseinfoService.getDictDataListByTypeId(CACHE_ACCOUNT_TYPE_ID)
      .subscribe(json => {
        if (json.code === 200) {
          this.typeOptions = json.data.map((x: any) => {
            return { label: x.name, value: x.value }
          })
        }
      })
    this.baseinfoService.getDictDataListByTypeId(CACHE_ACCOUNT_LEVEL_ID)
      .subscribe(json => {
        if (json.code === 200) {
          this.levelOptions = json.data.map((x: any) => {
            return { label: x.name, value: x.value }
          })
        }
      })
    this.roleService.getRoleList({}).subscribe(json => {
      if (json.code === 200) {
        this.roleOptions = json.data.map((x: any) => {
          return { label: x.name, value: x.id };
        })
        console.log(this.roleOptions);
      }
    });
  }

  initList() {
    this.loading = true;
    this.accountService.getAccountList({
      ...this.formGroup.value,
      pageNum: this.pageNum,
      pageSize: this.pageSize
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
      nzContent: AccountFormComponent,
      nzComponentParams: {
        // allMenus: this.allMenus
      },
      nzKeyboard: false
    })
  }

  edit(e: MouseEvent, item: any) {
    this.modalService.create({
      nzTitle: '编辑',
      nzContent: AccountFormComponent,
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
        this.accountService.deleteAccountById(item.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(json => {
            if (json.code === 200) {
              this.messageService.success('操作成功！');
              this.accountService.refreshAccountList();
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
