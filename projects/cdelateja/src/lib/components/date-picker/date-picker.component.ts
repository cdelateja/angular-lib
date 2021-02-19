import {Component, ElementRef, forwardRef, Host, OnInit, Optional, SkipSelf, ViewChild} from '@angular/core';
import {AbstractComponent} from '../definition.components';
import {TranslateService} from '@ngx-translate/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'ct-date-picker',
  templateUrl: './date-picker.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerComponent),
    multi: true
  },
    {
      provide: AbstractComponent,
      useExisting: DatePickerComponent
    }]
})
export class DatePickerComponent extends AbstractComponent implements OnInit {

  @ViewChild('popup', {static: false})
  protected popup: ElementRef;

  public firstDate: Date;

  public weeks: any[] = [];
  private lastDate: Date;
  private lastMonth: Date;

  private date: Date;
  private lastSelected: HTMLElement;
  private daySelected: Day;

  constructor(elRef: ElementRef, protected translate: TranslateService, @Optional() @Host() @SkipSelf() protected controlContainer: ControlContainer) {
    super(elRef, translate, controlContainer);
  }

  ngOnInit() {
    super.init();
    this.date = new Date;
    this.getFirstAndFinalDay(this.date);
  }

  writeValue(date: string): void {
    if (date) {
      const dateSplited = date.split('/');
      this.daySelected = new Day(0, false,
        new Date(Number(dateSplited[2]), Number(dateSplited[1]) - 1, Number(dateSplited[0])));
      console.log(this.daySelected);
    }
    this.onChange(date);
    super.writeValue(date);
  }

  // protected addLabel(el: string) {
  //   super.addLabel('.input-group');
  // }

  public getFirstAndFinalDay(date: Date) {
    this.firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.lastMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    this.generateDaysOfMonth();
  }

  public generateDaysOfMonth() {
    this.weeks = [];
    let day = 1;
    let countDays = 1;
    let days: Day[] = [];

    let sumDays = 1;
    const dayOfToday = this.firstDate.getDay() === 0 ? 7 : this.firstDate.getDay();
    while (sumDays < dayOfToday) {
      sumDays += 1;
      days.push(new Day(this.lastMonth.getDate() - (dayOfToday - sumDays), true,
        new Date(this.lastMonth.getFullYear(), this.lastMonth.getMonth(), this.lastMonth.getDate() - (dayOfToday - sumDays))));
      countDays += 1;
    }

    while (day <= this.lastDate.getDate()) {
      days.push(new Day(day, false, new Date(this.date.getFullYear(), this.date.getMonth(), day)));
      day += 1;
      if (countDays === 7) {
        this.weeks.push(days);
        days = [];
        countDays = 0;
      }
      countDays += 1;
    }

    let dayOfLastDate = this.lastDate.getDay() === 0 ? 7 : this.lastDate.getDay();
    sumDays = 1;
    while (dayOfLastDate < 7) {
      days.push(new Day(sumDays, true, new Date(this.date.getFullYear(), this.date.getMonth() + 1, sumDays)));
      sumDays += 1;
      dayOfLastDate += 1;
    }

    this.weeks.push(days);
  }

  public backMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
    this.getFirstAndFinalDay(this.date);
  }

  public nextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
    this.getFirstAndFinalDay(this.date);
  }

  public backYear() {
    this.date = new Date(this.date.getFullYear() - 1, this.date.getMonth(), 1);
    this.getFirstAndFinalDay(this.date);
  }

  public nextYear() {
    this.date = new Date(this.date.getFullYear() + 1, this.date.getMonth(), 1);
    this.getFirstAndFinalDay(this.date);
  }

  public selectDate($event, day: Day) {
    if (this.lastSelected) {
      this.lastSelected.classList.remove('date-selected');
    }
    this.lastSelected = $event.srcElement;
    this.lastSelected.classList.add('date-selected');
    this.daySelected = day;

  }

  public isSelected(day: Day): boolean {
    if (this.daySelected) {
      return this.daySelected.date.getDate() === day.date.getDate()
        && this.daySelected.date.getMonth() === day.date.getMonth()
        && this.daySelected.date.getFullYear() === day.date.getFullYear();
    }

    return false;
  }

  public togglePopUp() {
    this.popup.nativeElement.classList.toggle('date-popup-show');
  }

  public accept() {
    if (this.daySelected) {
      this.writeValue(`${this.daySelected.date.getDate()}/${this.daySelected.date.getMonth() + 1}/${this.daySelected.date.getFullYear()}`);
    }
    this.togglePopUp();
  }

}

class Day {
  public day: number;
  public otherMonth: boolean;
  public date: Date;

  constructor(day: number, otherMonth: boolean, date?: Date) {
    this.day = day;
    this.otherMonth = otherMonth;
    this.date = date;
  }
}
