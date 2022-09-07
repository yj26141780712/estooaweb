import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BaseinfoService } from 'src/app/api/baseinfo.service';
import { MenuService } from 'src/app/api/menu.service';
import { CACHE_MENU_ACTIONS_ID } from 'src/app/services/global';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss']
})
export class MenuFormComponent implements OnInit {
  isEdit = false;
  item: any;
  allMenus: any[] = [];
  formGroup!: FormGroup;
  parentNodes: any[] = [];
  loading = false;
  actionOptions: Array<{ label: string, value: string }> = [];
  constructor(private fb: FormBuilder,
    private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private menuSerive: MenuService,
    private baseinfoService: BaseinfoService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      value: [''],
      icon: [''],
      url: [''],
      sort: ['0'],
      level: ['1'],
      parentId: [0],
      isPage: [false],
      actions: [[]]
    });
    this.initSelect();
    if (this.item) {
      for (const key in this.formGroup.value) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
      this.formGroup.controls['isPage'].setValue(this.item.isAdmin === 1);
      if (this.formGroup.value.actions) {
        this.formGroup.controls['actions'].setValue(this.formGroup.value.actions.split(','));
      } else {
        this.formGroup.controls['actions'].setValue([]);
      }
    }
  }

  initSelect() {
    this.parentNodes = this.getChildren(this.allMenus, 0);
    this.baseinfoService.getDictDataListByTypeId(CACHE_MENU_ACTIONS_ID)
      .subscribe(json => {
        if (json.code === 200) {
          this.actionOptions = json.data.sort((a: any, b: any) => b.seq - a.seq).map((x: any) => {
            return { label: x.name, value: x.value };
          })
        }
      })
  }

  getChildren(list: any, parentId: number) {
    const arr: any[] = [];
    const children = list.filter((x: any) => x.parentId === parentId);
    children.forEach((x: any) => {
      const _children = this.getChildren(list, x.id);
      arr.push({
        title: x.name,
        key: x.id,
        children: _children,
        isLeaf: _children.length === 0
      });
    });
    return arr;
  }


  cancel() {
    this.modalRef.destroy();
  }

  submitForm() {
    for (const key in this.formGroup.controls) {
      this.formGroup.controls[key].markAsDirty();
      this.formGroup.controls[key].updateValueAndValidity();
    }
    if (this.formGroup.invalid) {
      return;
    }
    this.loading = true;
    const actions = Array.isArray(this.formGroup.value.actions) ? this.formGroup.value.actions.join(',') : '';
    if (this.isEdit) {
      this.menuSerive.updateMenuById({
        ...this.formGroup.value,
        level: Number(this.formGroup.value.level || '1'),
        sort: Number(this.formGroup.value.sort || '0'),
        parentId: this.formGroup.value.parentId || 0,
        isPage: this.formGroup.value.isPage ? 1 : 0,
        actions
      }, this.item.id).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.modalRef.destroy();
          this.menuSerive.refreshMenuList();
        }
        this.loading = false;
      })
    } else {
      this.menuSerive.createMenu({
        ...this.formGroup.value,
        level: Number(this.formGroup.value.level || '1'),
        sort: Number(this.formGroup.value.sort || '0'),
        parentId: this.formGroup.value.parentId || 0,
        isPage: this.formGroup.value.isPage ? 1 : 0,
        actions
      }).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.modalRef.destroy();
          this.menuSerive.refreshMenuList();
        }
        this.loading = false;
      })
    }
  }
}
