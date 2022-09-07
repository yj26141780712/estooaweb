import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { format } from 'date-fns';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzModalService } from 'ng-zorro-antd/modal';
import { delay, takeUntil } from 'rxjs';
import { ShopService } from 'src/app/api/shop.service';
import { SearchCondition } from 'src/app/types/search-conditon';
import { BaseList } from '../../BaseList';
import { CsManagerFormComponent } from '../cs-manager-form/cs-manager-form.component';

@Component({
  selector: 'app-cs-manager',
  templateUrl: './cs-manager.component.html',
  styleUrls: ['./cs-manager.component.scss']
})
export class CsManagerComponent extends BaseList implements OnInit {


  constructor(private fb: FormBuilder,
    private shopService: ShopService,
    private nzImageService: NzImageService,
    modalService: NzModalService) {
    super(modalService);
    this.setColumn([
      // { key: 'preview', title: '客服账号', checked: true },
      { key: 'nickname', title: '客服名称', checked: true },
      { key: 'avatar', title: '客服头像', checked: true },
      {
        key: 'account', title: '绑定管理员', checked: true, change: (value) => {
          return value?.name || value?.account;
        }
      },
      { key: 'status', title: '状态', checked: true },
      {
        key: 'createTime', title: '创建时间', checked: true, change: (value) => {
          return value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : ''
        }
      },
      {
        key: 'updateTime', title: '更新时间', checked: true, change: (value) => {
          return value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : ''
        }
      }
    ]);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      nickname: [''],
    });
    this.initList();
    this.shopService.refreshCsList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initList();
      })
  }

  ngOnDestroy() {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  override initList() {
    this.loading = true;
    this.shopService.getCustomerServiceList({
      ...this.searchValue.value,
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

  override add() {
    this.modalService.create({
      nzTitle: '新增',
      nzContent: CsManagerFormComponent,
      nzWidth: 600,
      nzComponentParams: {
        // allMenus: this.allMenus
      },
      nzKeyboard: false
    })
  }

  override edit(e: MouseEvent, item: any) {
    this.modalService.create({
      nzTitle: '编辑',
      nzContent: CsManagerFormComponent,
      nzWidth: 600,
      nzComponentParams: {
        isEdit: true,
        item
      }
    })
  }

  override delete(e: MouseEvent, item: any) {
    this.modalService.confirm({
      nzTitle: '确定要删除？',
      nzOnOk: () => {
        // console.log(item);
        // this.informationService.deleteInformationById(item.id)
        //   .pipe(takeUntil(this.destroy$))
        //   .subscribe(json => {
        //     if (json.code === 200) {
        //       this.messageService.success('操作成功！');
        //       this.informationService.refreshInformationList();
        //     }
        //   });
      }
    })
  }

  preview(item: any) {
    if (item.avatar) {
      this.nzImageService.preview([
        { src: item.avatar.url }
      ]);
    }
  }
}
