import {Component, ElementRef, forwardRef, Host, Input, OnInit, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {AbstractComponent} from '../definition.components';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ct-catalog',
  templateUrl: './catalog.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CatalogComponent),
    multi: true
  },
    {
      provide: AbstractComponent,
      useExisting: CatalogComponent
    }]
})
export class CatalogComponent extends AbstractComponent implements OnInit {

  @Input()
  public label = 'Core.lblCatalog';
  public faTrash = faTrash;
  public values: any[] = [];

  constructor(elRef: ElementRef, protected translate: TranslateService,
              @Optional() @Host() @SkipSelf()
              protected controlContainer: ControlContainer) {
    super(elRef, translate, controlContainer);
  }

  public ngOnInit(): void {
    super.init();
  }

  public writeValue(value: any): void {
    this.values = [];
    if (value) {
      const list: string[] = value.replace('[', '').replace(']', '').split(',');
      list.forEach((v: string) => this.values.push({value: v}));
      super.writeValue(this.values);
    } else {
      super.writeValue(value);
    }

  }

  public add(): void {
    this.values.push({value: ''});
    this.callOnChanged(this.values);
  }

  public remove(index: number): void {
    this.values.splice(index, 1);
    this.callOnChanged(this.values);
  }

  private callOnChanged(value: any): void {
    const val = value.length === 0 ? null : value;
    this.onChange(val);
    super.writeValue(val);
  }

}
