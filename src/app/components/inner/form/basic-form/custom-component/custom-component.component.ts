import {Component, ElementRef, forwardRef, Host, Input, OnInit, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, FormGroup, NG_VALUE_ACCESSOR} from "@angular/forms";
import {AbstractComponent} from "cdelateja";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-custom-component',
  templateUrl: './custom-component.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomComponentComponent),
    multi: true
  },
    {
      provide: AbstractComponent,
      useExisting: CustomComponentComponent
    }]
})
export class CustomComponentComponent extends AbstractComponent implements OnInit {

  @Input()
  public group: FormGroup;

  constructor(elRef: ElementRef, protected translate: TranslateService,
              @Optional() @Host() @SkipSelf()
              protected controlContainer: ControlContainer) {
    super(elRef, translate, controlContainer);
  }

  ngOnInit() {
  }

}
