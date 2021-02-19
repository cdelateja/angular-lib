import {Component, ElementRef, forwardRef, Host, OnInit, Optional, SkipSelf} from '@angular/core';
import {AbstractComponent} from '../definition.components';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ct-check-box',
  templateUrl: './check-box.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckBoxComponent),
    multi: true
  },
    {
      provide: AbstractComponent,
      useExisting: CheckBoxComponent
    }]
})
export class CheckBoxComponent extends AbstractComponent implements OnInit {

  constructor(elRef: ElementRef, protected translate: TranslateService,  @Optional() @Host() @SkipSelf() protected controlContainer: ControlContainer) {
    super(elRef, translate, controlContainer);
  }

  ngOnInit() {
    super.init();
  }

  protected addLabel(el: string) {
    if (this.label) {
      const form = this.element.querySelector('.form-check');
      const label = document.createElement('label');
      label.className = this.labelClass;
      this.translate.get(this.label).subscribe(e => {
        label.innerHTML = e;
        form.appendChild(label);
        this.setRequired(this.control && this.control.validator !== null);
        this.addToolTip();
      });
    }
  }

}
