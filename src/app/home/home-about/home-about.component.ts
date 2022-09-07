import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { addDays, addMonths, differenceInDays, format } from 'date-fns';
import * as echarts from 'echarts';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/api/data.service';
import { SocketIoService } from 'src/app/services/socket.io.service';

@Component({
  selector: 'app-home-about',
  templateUrl: './home-about.component.html',
  styleUrls: ['./home-about.component.less']
})
export class HomeAboutComponent implements OnInit, OnDestroy {

  activeKey = 'payOrder';
  activeItem: any;
  list: any[] = [
    { key: 'payOrder', title: '支付订单', unit: '笔', color: '#F0A70A' },
    { key: 'payAmount', title: '支付金额', unit: '元', color: '#4498FF' },
    { key: 'noSend', title: '待发货订单', unit: '笔', color: '#38C769' },
    { key: 'payNum', title: '支付人数(累计)', unit: '人', color: '#B052EA' },
    { key: 'afterScale', title: '售后维权', unit: '笔', color: '#627EFC' },
    { key: 'refund', title: '退款订单', unit: '笔', color: '#FF826C' }
  ];
  times: Date[] = [];
  data: any;
  payPrecent = 0;
  numPrecent = 0;
  payTypes = [
    { label: '微信支付', value: 'wechatPay', num: 0, color: '#04BE02' },
    { label: '支付宝支付', value: 'aliPay', num: 0, color: '#1678ff' },
    { label: '其他', value: 'other', num: 0, color: '#B03A5B' },
  ]
  @ViewChild('chart') chartEl!: ElementRef;
  @ViewChild('payTypeChart') payChartEl!: ElementRef;
  chart!: any;
  payChart: any;
  destroy$ = new Subject<void>();

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.activeItem = this.list.find(x => x.key === this.activeKey);
    this.times = [
      new Date(format(new Date(), 'yyyy-MM-dd 00:00:00')),
      new Date(format(new Date(), 'yyyy-MM-dd 23:59:59'))
    ];
    this.getDataIndex();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  change() {
    this.destroy$.next();
    this.getDataIndex();
  }

  selectItem(item: any) {
    this.activeItem = item;
    this.activeKey = item.key;
    this.initCharts();
  }

  getDataIndex() {
    this.dataService.getDataIndex(
      format(this.times[0], 'yyyy-MM-dd HH:mm:ss'),
      format(this.times[1], 'yyyy-MM-dd HH:mm:ss')
    ).pipe(takeUntil(this.destroy$))
      .subscribe(json => {
        if (json.code === 200) {
          this.data = json.data;
          this.list.forEach(x => {
            if (x.key === 'payNum') {
              x.num = Array.from(new Set(
                this.data.payOrderArr.map((x: any) => x.accountId)
              )).length;
            } else {
              x.num = this.data[x.key + 'Num'];
            }
          });
          this.payPrecent = Number(this.data.totalAmount) > 0 ?
            Number(this.data.payAmountNum) / Number(this.data.totalAmount) * 100 : 0;
          this.numPrecent = Number(this.data.totalNum) > 0 ?
            Number(this.data.payOrderNum) / Number(this.data.totalNum) * 100 : 0
          this.payTypes.forEach(p => {
            p.num = this.data.payOrderArr.filter((x: any) => x.payType === p.value).length;
          });
          this.initCharts();
          this.initPayCharts();
        }
      });
  }

  getChartX() {
    const d = differenceInDays(this.times[1], this.times[0]);
    if (d === 0) {
      let arr = [];
      for (let i = 0; i < 24; i++) {
        const stime = format(this.times[0], `yyyy-MM-dd ${(i).toString().padStart(2, '0')}:00:00`)
        const etime = format(this.times[0], `yyyy-MM-dd ${(i + 1).toString().padStart(2, '0')}:00:00`)
        arr.push({
          label: stime.substring(8, 16),
          stime: new Date(stime),
          etime: new Date(etime)
        });
      }
      return arr;
    } else if (d > 0 && d < 60) {
      const arr = [];
      const sDate = new Date(format(this.times[0], 'yyyy-MM-dd 00:00:00'));
      const eDate = addDays(new Date(format(this.times[1], 'yyyy-MM-dd 00:00:00')), 1);
      for (let i = 0; addDays(sDate, i) < eDate; i++) {
        const stime = addDays(sDate, i);
        const etime = addDays(sDate, i + 1);
        arr.push({
          label: format(stime, 'yyyy-MM-dd'),
          stime,
          etime
        });
      }
      return arr;
    } else {
      const arr = [];
      const sDate = new Date(format(this.times[0], 'yyyy-MM-01 00:00:00'));
      const eDate = addMonths(new Date(format(this.times[1], 'yyyy-MM-01 00:00:00')), 1);
      for (let i = 0; addMonths(sDate, i) < eDate; i++) {
        const stime = addMonths(sDate, i);
        const etime = addMonths(sDate, i + 1);
        arr.push({
          label: format(stime, 'yyyy-MM'),
          stime,
          etime
        });
      }
      console.log(arr);
      return arr;
    }
  }

  getChartY(times: any[]) {
    if (this.activeKey === 'payOrder') {
      return times.map(t =>
        this.data.payOrderArr.filter((x: any) =>
          t.stime <= new Date(x.createTime) &&
          t.etime > new Date(x.createTime)).length);
    } else if (this.activeKey === 'payAmount') {
      return times.map(t =>
        this.data.payAmountArr.filter((x: any) =>
          t.stime <= new Date(x.createTime) &&
          t.etime > new Date(x.createTime)).reduce((a: any, b: any) => a + Number(b.counter), 0)
      );
    } else if (this.activeKey === 'noSend') {
      return times.map(t =>
        this.data.noSendArr.filter((x: any) =>
          t.stime <= new Date(x.createTime) &&
          t.etime > new Date(x.createTime)).length);
    } else if (this.activeKey === 'payNum') {
      const lastTime = times[times.length - 1].stime;
      return times.map(t =>
        this.data.noSendArr.filter((x: any) =>
          t.stime <= new Date(x.createTime) &&
          lastTime > new Date(x.createTime)).reduce((a: any, b: any) => a.counter + b), 0);
    } else {
      return times.map(x => 0);
    }
  }

  initCharts() {
    if (!this.chart) {
      this.chart = echarts.init(this.chartEl.nativeElement);
    }
    const dataX: any[] = this.getChartX();
    const dataY: any[] = this.getChartY(dataX);
    const option = {
      grid: {
        left: 40,
        right: 40,
        top: 20,
        bottom: 20
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: dataX.map(x => x.label),
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        minInterval: 1
      },
      series: [
        {
          data: dataY,
          type: 'line',
          smooth: true,
          symbol: 'none'
        }
      ]
    }
    this.chart.setOption(option);
  }

  initPayCharts() {
    if (!this.payChart) {
      this.payChart = echarts.init(this.payChartEl.nativeElement);
    }

    const option = {
      series: [
        {
          name: '支付方式',
          type: 'pie',
          radius: ['80%', '90%'],
          label: {
            show: false,
            position: 'center'
          },
          labelLine: {
            show: false
          },
          data: this.payTypes.map(x => {
            return { value: x.num, name: x.label }
          })
        }
      ]
    };
    this.payChart.setOption(option);
  }

}
