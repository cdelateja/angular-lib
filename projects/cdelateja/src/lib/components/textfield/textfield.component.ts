import {Component, ElementRef, forwardRef, Host, OnInit, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AbstractComponent} from '../definition.components';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ct-textfield',
  templateUrl: './textfield.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextfieldComponent),
    multi: true
  },
    {
      provide: AbstractComponent,
      useExisting: TextfieldComponent
    }]
})
export class TextfieldComponent extends AbstractComponent implements OnInit {

  constructor(elRef: ElementRef, protected translate: TranslateService,
              @Optional() @Host() @SkipSelf()
              protected controlContainer: ControlContainer) {
    super(elRef, translate, controlContainer);
  }

  ngOnInit() {
    super.init();
  }

}
