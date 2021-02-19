import {Component, ElementRef, forwardRef, Host, OnInit, Optional, SkipSelf} from '@angular/core';
import {AbstractComponent} from '../definition.components';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ct-label',
  templateUrl: './label.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LabelComponent),
    multi: true
  }]
})
export class LabelComponent extends AbstractComponent implements OnInit {

  constructor(elRef: ElementRef, protected translate: TranslateService, @Optional() @Host() @SkipSelf()  protected controlContainer: ControlContainer) {
    super(elRef, translate, controlContainer);
  }

  ngOnInit() {
    super.init();
  }

  protected addLabel(el: string) {
    super.addLabel('p');
  }

}
