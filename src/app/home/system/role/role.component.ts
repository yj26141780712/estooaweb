import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams, NzTableSize, NzTableSortOrder } from 'ng-zorro-antd/table';
import { delay, Subject, takeUntil } from 'rxjs';
import { RoleService } from 'src/app/api/role.service';
import { TableColumn } from 'src/app/types/table-column';
import { changeSortArray } from 'src/app/utils/convert';
import { exitFullScreen, isFullscreenForNoScroll, openFullscreen } from 'src/app/utils/fullscreen';
import { RoleFormComponent } from '../role-form/role-form.component';
import { RolePermissionComponent } from '../role-permission/role-permission.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

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
      key: 'name', title: '角色名称', checked: true
    },
    {
      key: 'value', title: '角色关键字', checked: true
    },
    {
      key: 'desc', title: '角色描述', checked: true
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

  constructor(private modalService: NzModalService,
    private messageService: NzMessageService,
    private fb: FormBuilder,
    private roleService: RoleService) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.initList();
    this.roleService.refreshRoleList$
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
      name: [null],
      value: [null]
    });
  }

  initList() {
    this.loading = true;
    this.roleService.getRoleList({
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
      nzContent: RoleFormComponent,
      nzComponentParams: {
        // allMenus: this.allMenus
      },
      nzKeyboard: false
    })
  }

  setPermission(e: MouseEvent, item: any) {
    this.modalService.create({
      nzTitle: '分配权限',
      nzContent: RolePermissionComponent,
      nzWidth: 600,
      nzComponentParams: {
        item
      }
    })
  }

  edit(e: MouseEvent, item: any) {
    this.modalService.create({
      nzTitle: '编辑',
      nzContent: RoleFormComponent,
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
        this.roleService.deleteRoleById(item.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(json => {
            if (json.code === 200) {
              this.messageService.success('操作成功！');
              this.roleService.refreshRoleList();
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
