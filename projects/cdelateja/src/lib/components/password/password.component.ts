import {Component, ElementRef, forwardRef, Host, OnInit, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AbstractComponent} from '../definition.components';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ct-password',
  templateUrl: './password.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PasswordComponent),
    multi: true
  },
    {
      provide: AbstractComponent,
      useExisting: PasswordComponent
    }]
})
export class PasswordComponent extends AbstractComponent implements OnInit {

  // tslint:disable-next-line:ban-types
  public show: Boolean = false;

  constructor(elRef: ElementRef, protected translate: TranslateService, @Optional() @Host() @SkipSelf() protected controlContainer: ControlContainer) {
    super(elRef, translate, controlContainer);
  }

  ngOnInit() {
    super.init();
  }

  protected addLabel(el: string) {
    super.addLabel('.input-group');
  }

  switch() {
    this.show = !this.show;
  }

}
