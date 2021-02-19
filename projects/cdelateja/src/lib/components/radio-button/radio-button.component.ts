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

  constructor(elRef: ElementRef, protected translate: TranslateService, @Optional() @Host() @SkipSelf() protected controlContainer: ControlContainer) {
    super(elRef, translate, controlContainer);
  }

  ngOnInit() {
    super.init();
  }

  protected addLabel(el: string) {
    const before = this.element.querySelector('.form-control');
    if (before !== null) {
      const form = this.element.querySelector('.form-group');
      const label = document.createElement('label');
      label.className = this.labelClass;
      form.insertBefore(label, before);
      this.setRequired(this.control && this.control.validator !== null);
      this.addToolTip();
    }
  }

}
