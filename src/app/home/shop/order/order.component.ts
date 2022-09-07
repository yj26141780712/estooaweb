import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { format } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableSize, NzTableSortOrder, NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject, takeUntil, delay } from 'rxjs';
import { BaseinfoService } from 'src/app/api/baseinfo.service';
import { ShopService } from 'src/app/api/shop.service';
import { SearchCondition } from 'src/app/types/search-conditon';
import { TableColumn } from 'src/app/types/table-column';
import { changeSortArray } from 'src/app/utils/convert';
import { isFullscreenForNoScroll, exitFullScreen, openFullscreen } from 'src/app/utils/fullscreen';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { OrderOperationComponent } from '../order-operation/order-operation.component';
import { OrderSendComponent } from '../order-send/order-send.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

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
    { key: 'product', title: '商品信息', checked: true, },
    { key: 'dispatchStatusText', title: '商品状态', checked: true, },
    // { key: 'return', title: '退款状态', checked: true, },
    // { key: 'shouhou', title: '售后状态', checked: true, },
    { key: 'statusDesc', title: '订单状态', checked: true, },
    { key: 'account', title: '下单用户', checked: true, },
    { key: 'get', title: '收货信息', checked: true, },
    { key: 'dispatchTypeText', title: '配送方式', checked: true, },
    { key: 'payFee', title: '支付金额', checked: true, }
  ];
  loading = false;
  tableSize: NzTableSize = 'default';
  tablSorts: Array<{ key: string, value: NzTableSortOrder }> = [];
  allChecked = true;
  indeterminate = false;
  statusCodeOptions: { value: string, label: string }[] = [];
  @ViewChild('tableBody') tableBodyEl!: ElementRef;
  destroy$ = new Subject();

  getFullscreen() {
    return isFullscreenForNoScroll();
  }

  formatTime(value: string) {
    return format(new Date(value), 'yyyy-MM-dd HH:mm:ss');
  }

  getPayTypeText(type: string) {
    return type;
  }

  constructor(private modalService: NzModalService,
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private baseinfoService: BaseinfoService,
    private shopService: ShopService) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.initList();
    this.shopService.refreshOrderList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initList();
      })
    this.baseinfoService.getDictDataListByTypeId(61)
      .pipe(takeUntil(this.destroy$))
      .subscribe(json => {
        this.statusCodeOptions = json.code === 200 ? json.data.map((x: any) => {
          return { value: x.value, label: x.name };
        }) : [];
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  initSearchForm() {
    this.formGroup = this.fb.group({
      statusCode: [''],
      createTime: ['']
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
    this.shopService.getOrderList(condition)
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

  export() {
    this.messageService.warning('功能未开放！');
  }

  orderSend(e: MouseEvent, item: any) {
    e.stopPropagation();
    e.preventDefault();
    this.modalService.create({
      nzTitle: '订单发货',
      nzContent: OrderSendComponent,
      nzWidth: 700,
      nzComponentParams: {
        item
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

  showLog(orderId: number) {
    this.modalService.create({
      nzTitle: '操作日志',
      nzContent: OrderOperationComponent,
      nzComponentParams: {
        orderId
      },
      nzFooter: null
    });
  }

  showDetail(orderId: number) {
    this.modalService.create({
      nzTitle: '查看详情',
      nzContent: OrderDetailComponent,
      nzComponentParams: {
        orderId
      },
      nzWidth: 800,
      nzFooter: null,
      nzBodyStyle: { padding: '0px' }
    });
  }
}
