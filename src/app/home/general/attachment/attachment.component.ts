import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NzTableQueryParams, NzTableSize, NzTableSortOrder } from 'ng-zorro-antd/table';
import { delay, Subject, takeUntil } from 'rxjs';
import { AttachmentService } from 'src/app/api/attachment.service';
import { TableColumn } from 'src/app/types/table-column';
import { changeSortArray, dateRangeToString } from 'src/app/utils/convert';
import { exitFullScreen, isFullscreenForNoScroll, openFullscreen } from 'src/app/utils/fullscreen';
import { NzBytesPipe } from 'ng-zorro-antd/pipes';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AttachmentFormComponent } from '../attachment-form/attachment-form.component';
import { format } from 'date-fns';
import { Global } from 'src/app/services/global';
import { download } from 'src/app/utils/download';
import { BaseList } from "../../BaseList";


@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent extends BaseList implements OnInit, OnDestroy {

  selectedIndex = 0;
  tabs: any[] = [];
  showSearch = false;

  getUrl(item: any) {
    if (item.mimetype.startsWith('image')) {
      return item.url;
    } else {
      const suffix = item.suffix;
      return Global.domain + 'attachment/suffixImage?suffix=' + suffix;
    }
  }



  constructor(private fb: FormBuilder,
    private attachmentService: AttachmentService,
    modalService: NzModalService) {
    super(modalService);
    this.setColumn([
      { key: 'preview', title: '预览', checked: true },
      { key: 'filename', title: '文件名', checked: true },
      { key: 'filedesc', title: '文件描述', checked: true },
      {
        key: 'filesize', title: '文件大小', checked: true, change: (value) => {
          return new NzBytesPipe().transform(value);
        }
      },
      { key: 'suffix', title: '类型', checked: true },
      { key: 'mimetype', title: 'MIME类型', checked: true },
      { key: 'createTime', title: '创建时间', showSort: true, checked: true, change: (value) => value ? format(new Date(value), 'yyyy-MM-dd') : '' },
      { key: 'filepath', title: '物理路径', checked: false }
    ]);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: [''],
      createTime: [[]]
    });
    this.initList();
    this.attachmentService.getAttachmentTypeList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(json => {
        if (json.code === 200) {
          this.tabs = json.data;
        }
      });
    this.attachmentService.refreshAttachmentList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initList();
      })
  }

  ngOnDestroy() {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  selectedIndexChange(index: number) {
    this.selectedIndex = index;
    this.pageNum = 1;
    this.initList();
  }

  preview(item: any) {
    download(item.url);
  }

  override initList() {
    this.loading = true;
    this.attachmentService.getAttachmentList({
      ...this.formGroup.value,
      mimetype: this.selectedIndex > 0 ? this.tabs[this.selectedIndex - 1] && this.tabs[this.selectedIndex - 1].value : '',
      createTime: this.formGroup.value.createTime && dateRangeToString(this.formGroup.value.createTime),
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
      nzContent: AttachmentFormComponent,
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
      nzContent: AttachmentFormComponent,
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

}
