import {Component, ElementRef, forwardRef, Host, Input, OnInit, Optional, SkipSelf} from '@angular/core';
import {AbstractComponent} from '../definition.components';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Equals} from '../../dtos/definition-class';

@Component({
  selector: 'ct-combo-box',
  templateUrl: './combo-box.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ComboBoxComponent),
    multi: true
  },
    {
      provide: AbstractComponent,
      useExisting: ComboBoxComponent
    }]
})
export class ComboBoxComponent extends AbstractComponent implements OnInit {

  @Input()
  public values: any = [];

  @Input()
  public itemCaption: string;

  /**
   * Use to validate if an object is equals to other object
   */
  @Input()
  public eqVal: string;

  constructor(elRef: ElementRef, protected translate: TranslateService,
              @Optional() @Host() @SkipSelf() protected controlContainer: ControlContainer) {
    super(elRef, translate, controlContainer);
    this.val = null;
  }

  public ngOnInit(): void {
    super.init();
  }

  public writeValue(value: any): void {
    if (value !== null) {
      this.values.forEach((e) => {
        if (this.eqVal) {
          if (e[this.eqVal] === value[this.eqVal]) {
            super.writeValue(e);
          }
        } else {
          if (e === value) {
            super.writeValue(e);
          }
        }
      });
    } else {
      super.writeValue(value);
    }
  }

  public compareObjects(o1: any, o2: any): boolean {
    if (o1 instanceof Equals) {
      return o1.equals(o2);
    }
    return o1 === o2;
  }

}
