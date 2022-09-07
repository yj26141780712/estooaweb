import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableSize } from 'ng-zorro-antd/table';
import { delay, Subject, takeUntil } from 'rxjs';
import { MenuService } from 'src/app/api/menu.service';
import { TableColumn } from 'src/app/types/table-column';
import { exitFullScreen, isFullscreenForNoScroll, openFullscreen } from 'src/app/utils/fullscreen';
import { MenuFormComponent } from '../menu-form/menu-form.component';


interface TreeNodeInterface {
  key: string;
  id: number;
  sort: number;
  level: number;
  name: string;
  url: string;
  parentId: number;
  isAdmin: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
  [key: string]: any
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit, OnDestroy {

  total = 0;
  pageSize = 10;
  tableData: TreeNodeInterface[] = [];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  expandList: string[] = [];
  columns: TableColumn[] = [
    { key: 'icon', title: '菜单图标', checked: true },
    { key: 'url', title: '菜单地址', checked: true },
    { key: 'sort', title: '菜单排序', checked: true },
    { key: 'isPage', title: '是否页面', checked: true, change: (value: number) => value === 1 ? '是' : '否' }
  ];
  loading = false;
  tableSize: NzTableSize = 'default';
  allMenus: any[] = [];
  allChecked = true;
  indeterminate = false;
  @ViewChild('tableBody') tableBodyEl!: ElementRef;
  destory$ = new Subject();
  getFullscreen() {
    return isFullscreenForNoScroll();
  }

  constructor(private modalService: NzModalService,
    private messageService: NzMessageService,
    private menuService: MenuService) { }

  ngOnInit(): void {
    this.initList();
    this.menuService.refresh$.pipe(takeUntil(this.destory$))
      .subscribe(() => {
        this.initList();
      })
  }

  ngOnDestroy(): void {
    this.destory$.next('');
    this.destory$.complete();
  }

  initList() {
    this.loading = true;
    this.menuService.getMenuList()
      .pipe(delay(300), takeUntil(this.destory$))
      .subscribe(json => {
        if (json.code === 200) {
          this.allMenus = json.data || [];
          this.tableData = this.getList(this.allMenus, 0);
          this.tableData.forEach(item => {
            this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
          });
        }
        this.loading = false;
      })
  }

  getList(menus: any[], parentId: number): TreeNodeInterface[] {
    const parentMenus = menus.filter(a => a.parentId === parentId);
    const arr: TreeNodeInterface[] = [];
    parentMenus.forEach(o => {
      const childern = this.getList(menus, o.id).sort((a, b) => a.sort - b.sort);
      arr.push({
        key: o.id + '',
        children: childern && childern.length > 0 ? childern : null,
        ...o
      });
    });
    return arr;
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
    if ($event) {
      this.expandList.push(data.key);
    } else {
      const index = this.expandList.indexOf(data.key);
      this.expandList.splice(index, 1);
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: this.getExpendState(root.key) });
    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: this.getExpendState(node.children[i].key), parent: node });
        }
      }
    }
    return array;
  }

  getExpendState(key: string) {
    return this.expandList.indexOf(key) > -1;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }


  add() {
    this.modalService.create({
      nzTitle: '新增',
      nzContent: MenuFormComponent,
      nzComponentParams: {
        allMenus: this.allMenus
      }
    })
  }

  edit(e: MouseEvent, item: any) {
    this.modalService.create({
      nzTitle: '编辑',
      nzContent: MenuFormComponent,
      nzComponentParams: {
        allMenus: this.allMenus,
        isEdit: true,
        item
      }
    })
  }

  delete(e: MouseEvent, item: any) {
    this.modalService.confirm({
      nzTitle: '确定要删除？',
      nzOnOk: () => {
        this.menuService.deleteMenuById(item.id)
          .pipe(takeUntil(this.destory$))
          .subscribe(json => {
            if (json.code === 200) {
              this.messageService.success('操作成功！');
              this.menuService.refreshMenuList();
            }
          });
      }
    })
  }

  refresh() {
    this.menuService.refreshMenuList();
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
}
