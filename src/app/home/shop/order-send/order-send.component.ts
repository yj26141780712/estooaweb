import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { ShopService } from 'src/app/api/shop.service';

@Component({
  selector: 'app-order-send',
  templateUrl: './order-send.component.html',
  styleUrls: ['./order-send.component.scss']
})
export class OrderSendComponent implements OnInit, OnDestroy {

  item: any;
  loading = false;
  tableData: any[] = [];
  orderProduct: any[] = [];
  expressList: any[] = [];
  snObj: any = {};
  expressCode!: string;
  expressNo!: string;
  destory$ = new Subject<void>();
  constructor(private nzModalRef: NzModalRef,
    private messageService: NzMessageService,
    private shopService: ShopService) { }

  ngOnInit(): void {
    this.orderProduct = [...this.item.orderProduct];
    this.orderProduct.forEach(x => {
      this.snObj[x.id] = '';
    });
    this.shopService.getExpressList({})
      .pipe(takeUntil(this.destory$))
      .subscribe(json => {
        this.expressList = json.code ? [...json.data] : [];
      })
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }


  cancel() { }

  submitForm() {
    if (!this.expressCode) {
      this.messageService.error('请选择快递公司！');
      return;
    }
    if (!this.expressNo) {
      this.messageService.error('请输入快递单号！');
      return;
    }
    if (this.orderProduct.some(x => !this.snObj[x.id])) {
      this.messageService.error('请输入发货商品的SN！');
      return;
    }
    this.loading = true;
    this.shopService.sendProduct({
      orderSn: this.item.orderSn,
      expressCode: this.expressCode,
      expressNo: this.expressNo,
      orderProducts: this.orderProduct.map(x => {
        return { id: x.id, productSn: this.snObj[x.id] }
      })
    })
      .pipe(takeUntil(this.destory$))
      .subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.nzModalRef.destroy();
          this.shopService.refreshOrderList();
        }
        this.loading = false;
      });
  }
}
