import {Component, ElementRef, forwardRef, Host, Input, OnInit, Optional, SkipSelf} from '@angular/core';
import {AbstractComponent} from '../definition.components';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ct-radio-button',
  templateUrl: './radio-button.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioButtonComponent),
    multi: true
  },
    {
      provide: AbstractComponent,
      useExisting: RadioButtonComponent
    }]
})
export class RadioButtonComponent extends AbstractComponent implements OnInit {

  @Input()
  public values: any = [];

  @Input()
  public itemCaption: string;

  @Input()
  public eqVal: string;

  constructor(elRef: ElementRef, protected translate: TranslateService,
              @Optional() @Host() @SkipSelf() protected controlContainer: ControlContainer) {
    super(elRef, translate, controlContainer);
    this.value = null;
  }

  public ngOnInit(): void {
    super.init();
  }

  public compareObjects(o1: any): boolean {
    if (this.value !== null) {
      if (this.eqVal) {
        if (o1[this.eqVal] === this.value[this.eqVal]) {
          return true;
        }
      } else {
        if (o1 === this.value) {
          return true;
        }
      }
    }
    return false;
  }

}
