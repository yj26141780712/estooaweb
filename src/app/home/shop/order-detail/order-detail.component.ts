import { Component, OnDestroy, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { Subject, takeUntil } from 'rxjs';
import { ShopService } from 'src/app/api/shop.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {

  orderId!: number;
  detail: any = {};
  current = 1;
  steps: any[] = [
    { text: '买家下单', desc: '' },
    { text: '买家付款', desc: '' },
    { text: '商家发货', desc: '' },
    { text: '交易完成', desc: '' }
  ];
  destroy$ = new Subject<void>();

  convertDate(value: string) {
    return value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : '';
  }

  get address() {
    return this.detail && (`${this.detail.provinceName}${this.detail.cityName}${this.detail.areaName}${this.detail.address}`)
  }

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  init() {
    this.shopService.getOrderDetail(this.orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(json => {
        this.detail = json.data;
        this.steps[0].time = this.detail.createTime;
        this.steps[1].time = this.detail.payTime;
        this.steps[2].time = this.detail.sendTime;
        this.steps[3].time = this.detail.confirmTime;
        if (this.detail.statusCode === 'nopay') {
          this.current = 1;
        } else if (this.detail.statusCode === 'nosend') {
          this.current = 2;
        } else if (this.detail.statusCode === 'noget') {
          this.current = 3;
        } else if (this.detail.statusCode === 'finish') {
          this.current = 4;
        }
      });
  }
}
