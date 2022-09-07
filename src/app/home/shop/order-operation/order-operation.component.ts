import { Component, OnDestroy, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { Subject, takeUntil } from 'rxjs';
import { ShopService } from 'src/app/api/shop.service';

@Component({
  selector: 'app-order-operation',
  templateUrl: './order-operation.component.html',
  styleUrls: ['./order-operation.component.scss']
})
export class OrderOperationComponent implements OnInit, OnDestroy {

  orderId!: number;
  tableData: any[] = [];
  destroy$ = new Subject<void>()

  converDate(value: string) {
    return value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : '';
  }

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.initList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initList() {
    this.shopService.getOrderLogList({
      orderId: this.orderId
    }).pipe(takeUntil(this.destroy$))
      .subscribe((json) => {
        this.tableData = json.code === 200 ? json.data : [];
      });
  }
}
