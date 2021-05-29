import {Component, ElementRef, forwardRef, Host, OnInit, Optional, SkipSelf} from '@angular/core';
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

  constructor(elRef: ElementRef, protected translate: TranslateService,
              @Optional() @Host() @SkipSelf() protected controlContainer: ControlContainer) {
    super(elRef, translate, controlContainer);
  }

  public ngOnInit(): void {
    super.init();
  }

  public writeValue(date: string): void {
    this.onChange(date);
    super.writeValue(date);
  }

}
