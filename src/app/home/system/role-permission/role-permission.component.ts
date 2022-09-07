import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { forkJoin, Subject } from 'rxjs';
import { MenuService } from 'src/app/api/menu.service';
import { RoleService } from 'src/app/api/role.service';
import { TreeData, TreeViewComponent } from 'src/app/components/tree-view/tree-view.component';

interface DataMenu {
  id: number;
  actions?: Array<{ name: string, value: string }>;
}

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss']
})
export class RolePermissionComponent implements OnInit {

  item: any;
  treeData: TreeData[] = [];
  private _roleId!: number;
  checkedKeys: number[] = [];
  expandedKeys: number[] = [];
  loading = false;
  allMenus: DataMenu[] = [];
  menuActions: string[] = [];
  @ViewChild('tree') tree!: TreeViewComponent;

  destroy$ = new Subject();

  isChecked(node: any, value: string) {
    return this.menuActions.includes(`${node.key}-${value}`);
  }

  constructor(private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private menuService: MenuService,
    private roleService: RoleService) { }

  ngOnInit(): void {
    this.getTreeData();
  }

  getTreeData() {
    forkJoin([
      this.menuService.getMenuList(),
      this.roleService.getMenusById(this.item.id)
    ]).subscribe(jsons => {
      if (jsons[0].code === 200) {
        const arr = jsons[0].data.sort((a: any, b: any) => a.sort - b.sort);
        this.allMenus = jsons[0].data.map((a: any) => {
          return a.isPage === 1 ? {
            id: a.id,
            actions: a.dictdatas.map((b: any) => {
              return { name: b.name, value: b.value }
            })
          } : { id: a.id };
        });;
        this.treeData = jsons[0].data.map((a: any) => {
          return {
            name: a.name, id: a.id, parentId: a.parentId,
            origin: {
              id: a.id,
              acitons: a.dictdatas.map((b: any) => {
                return { name: b.name, value: b.value }
              })
            }
          };
        });
        this.expandedKeys = jsons[0].data.map((a: any) => a.id);
      }
      if (jsons[1].code === 200 && Array.isArray(jsons[1].data)) {
        this.checkedKeys = jsons[1].data.map((a: any) => a.id);
        console.log(123);
        jsons[1].data.forEach((m: any) => {
          if (Array.isArray(m.actions)) {
            m.actions.forEach((a: any) => {
              this.menuActions.push(`${m.id}-${a}`);
            })
          }
        });
        console.log(this.menuActions);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  test(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

  getSelectedMenuIds() {
    return this.tree.getSelectedKeys();
  }

  checkChange(e: boolean, value: string, node: any): void {
    const id = node.key;
    const action = `${id}-${value}`;
    if (e) {
      if (!this.menuActions.includes(action)) {
        this.menuActions.push(action);
      }
    } else {
      const findIndex = this.menuActions.findIndex(x => x === action);
      if (findIndex) {
        this.menuActions.splice(findIndex, 1);
      }
    }
  }

  cancle(): void {
    this.modalRef.destroy();
  }

  submit(): void {
    this.loading = true;
    const menuIds = this.tree.getSelectedKeys();
    const selectedMenus = [...this.allMenus.filter((x: any) => menuIds.includes(x.id))];
    const menus = selectedMenus.map(x => {
      return x.actions ? {
        id: x.id,
        actions: x.actions.filter(a => this.menuActions.includes(`${x.id}-${a.value}`)).map(a => a.value)
      } : { id: x.id }
    })

    this.roleService.updateMenusById(JSON.stringify(menus), this.item.id).subscribe(json => {
      if (json.code === 200) {
        this.messageService.success('操作成功！');
        this.modalRef.destroy();
      }
      this.loading = false;
    })
  }
}
