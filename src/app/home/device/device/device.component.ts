import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { format } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableSize, NzTableSortOrder, NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject, takeUntil, delay } from 'rxjs';
import { DeviceService } from 'src/app/api/device.service';
import { SearchCondition } from 'src/app/types/search-conditon';
import { TableColumn } from 'src/app/types/table-column';
import { changeSortArray } from 'src/app/utils/convert';
import { isFullscreenForNoScroll, exitFullScreen, openFullscreen } from 'src/app/utils/fullscreen';
import { BaseList } from '../../BaseList';
import { DeviceFormComponent } from '../device-form/device-form.component';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent extends BaseList implements OnInit {

  models: any[] = [];
  formatDate(value: string) {
    return value ? format(new Date(value), 'yyyy-MM-dd') : '';
  }

  constructor(modalService: NzModalService,
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private deviceService: DeviceService) {
    super(modalService);
    this.columns = [
      { key: 'sn', title: '设备SN', checked: true },
      { key: 'model', title: '设备型号', checked: true, },
      { key: 'useStatusText', title: '使用状态', checked: true },
      { key: 'runStatusText', title: '运行状态', checked: true },
      // { key: 'account', title: '租借用户', checked: true },
      { key: 'patient', title: '使用患者', checked: true },
      { key: 'accountDevice', title: '到期日', checked: true, change: (value) => value ? format(new Date(value), 'yyyy-MM-dd') : '' },
      { key: 'createTime', title: '最近归还人', checked: false },
      { key: 'createTime', title: '最近归还时间', checked: false },
    ]
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.initList();
    this.deviceService.refreshDeviceList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initList();
      });
    this.deviceService.getModelList({})
      .pipe(takeUntil(this.destroy$))
      .subscribe((json) => {
        this.models = json.code === 200 ? json.data : [];
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  initSearchForm() {
    this.formGroup = this.fb.group({
      modelId: [''],
      sn: ['']
    });
  }

  override initList() {
    this.loading = true;
    const condition: SearchCondition = {
      ...this.searchValue,
      pageSize: this.pageSize,
      pageNum: this.pageNum,
      sortBy: this.sortBy,
      orderBy: this.orderBy
    };
    this.deviceService.getDeviceList(condition)
      .pipe(delay(300), takeUntil(this.destroy$))
      .subscribe(json => {
        if (json.code === 200) {
          this.tableData = json.data;
          this.total = json.total
        }
        this.loading = false;
      })
  }

  override add() {
    this.modalService.create({
      nzTitle: '新增',
      nzContent: DeviceFormComponent,
      nzComponentParams: {
        // allMenus: this.allMenus
      },
      nzKeyboard: false
    })
  }

  override edit(e: MouseEvent, item: any) {
    this.modalService.create({
      nzTitle: '编辑',
      nzContent: DeviceFormComponent,
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
        console.log(item);
        this.deviceService.deleteDeviceById(item.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(json => {
            if (json.code === 200) {
              this.messageService.success('操作成功！');
              this.deviceService.refreshDeviceList();
            }
          });
      }
    })
  }

}
