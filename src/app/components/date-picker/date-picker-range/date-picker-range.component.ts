import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { addDays, addMonths, format, startOfMonth } from 'date-fns';
import { OnChangeType, OnTouchedType } from 'ng-zorro-antd/core/types';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-date-picker-range',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerRangeComponent),
      multi: true
    }
  ],
  templateUrl: './date-picker-range.component.html',
  styleUrls: ['./date-picker-range.component.scss'],
})
export class DatePickerRangeComponent implements ControlValueAccessor, OnInit, OnDestroy {

  placeholder = '请选择日期范围';
  @Input('placement') placement?: string | string[] = 'top';
  items: Array<{ label: string, value: string }> = [
    { label: '今天', value: 'today' },
    { label: '昨天', value: 'yesterday' },
    { label: '最近7天', value: '7days' },
    { label: '最近30天', value: '30days' },
    { label: '本月', value: 'month' },
    { label: '上月', value: 'lastMonth' },
    { label: '自定义', value: 'custom' }
  ];
  activeValue = this.items[0].value;
  visible = false;
  ranges: Date[] = [];
  private destroy$ = new Subject<void>();

  get value(): any {
    return this.ranges;
  }

  set value(v: Date[]) {
    if (v !== this.ranges) {
      this.ranges = v;
      this.onChange(v);
      this.onTouched();
      this.cdr.markForCheck();
    }
  }

  onChange: OnChangeType = () => { };
  onTouched: OnTouchedType = () => { };

  writeValue(value: Date[]): void {
    if (Array.isArray(value)) {
      this.ranges[0] = value[0];
      this.ranges[1] = value[1];
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {

    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  getText() {
    return this.ranges[0] && this.ranges[1] ? `${this.getDate1()} - ${this.getDate2()}` : '';
  }

  getDate1() {
    return this.ranges[0] ? format(this.ranges[0], 'yyyy-MM-dd HH:mm:ss') : '';
  }

  getDate2() {
    return this.ranges[1] ? format(this.ranges[1], 'yyyy-MM-dd HH:mm:ss') : '';
  }

  changeText(value: string) {

  }

  constructor(private el: ElementRef,
    private render: Renderer2,
    private cdr: ChangeDetectorRef) {
    this.render.setStyle(this.el.nativeElement, 'display', 'block');
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  change(value: boolean): void {

  }

  selectItem(item: { label: string, value: string }, e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.activeValue = item.value;
    if (this.activeValue !== 'custom') {
      this.setDate();
      this.changeDate();
      this.cdr.markForCheck();
      this.onChange(this.ranges);
      this.visible = false;
    }
  }

  setDate() {
    switch (this.activeValue) {
      case 'today':
        this.ranges[0] = new Date();
        this.ranges[1] = new Date();
        break;
      case 'yesterday':
        this.ranges[0] = addDays(new Date(), -1);
        this.ranges[1] = addDays(new Date(), -1);
        break;
      case '7days':
        this.ranges[0] = addDays(new Date(), -6);
        this.ranges[1] = new Date();
        break;
      case '30days':
        this.ranges[0] = addDays(new Date(), -29);
        this.ranges[1] = new Date();
        break;
      case 'month':
        this.ranges[0] = startOfMonth(new Date());
        this.ranges[1] = new Date();
        break;
      case 'lastMonth':
        this.ranges[0] = startOfMonth(addMonths(new Date(), -1));
        this.ranges[1] = addDays(startOfMonth(new Date()), -1);
        break;
    }
  }

  rangeChage(value: Date[]) {
    this.visible = false;
    this.changeDate();
    this.cdr.markForCheck();
    this.onChange(this.ranges);
  }

  changeDate() {
    if (this.ranges[0] > this.ranges[1]) {
      let t = this.ranges[0];
      this.ranges[0] = this.ranges[1];
      this.ranges[1] = t;
    }
    this.ranges[0] = new Date(format(this.ranges[0], 'yyyy-MM-dd 00:00:00'));
    this.ranges[1] = new Date(format(this.ranges[1], 'yyyy-MM-dd 23:59:59'));
  }

}
