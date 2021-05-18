import {Component, ElementRef, forwardRef, Host, Input, OnInit, Optional, SkipSelf} from '@angular/core';
import {AbstractComponent} from '../definition.components';
import {TranslateService} from '@ngx-translate/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'ct-number-field',
  templateUrl: './number-field.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberFieldComponent),
    multi: true
  },
    {
      provide: AbstractComponent,
      useExisting: NumberFieldComponent
    }]
})
export class NumberFieldComponent extends AbstractComponent implements OnInit {

  @Input()
  public prefix: string;

  @Input()
  public suffix: string;

  constructor(elRef: ElementRef, protected translate: TranslateService,
              @Optional() @Host() @SkipSelf()
              protected controlContainer: ControlContainer) {
    super(elRef, translate, controlContainer);
    this.value = 0;
  }

  public ngOnInit(): void {
    super.init();
  }

}
