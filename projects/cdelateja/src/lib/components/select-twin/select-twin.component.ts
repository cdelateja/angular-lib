import {Component, ElementRef, forwardRef, Host, Input, OnInit, Optional, SkipSelf, ViewChild} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AbstractComponent} from '../definition.components';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ct-select-twin',
  templateUrl: './select-twin.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectTwinComponent),
    multi: true
  },
    {
      provide: AbstractComponent,
      useExisting: SelectTwinComponent
    }]
})
export class SelectTwinComponent extends AbstractComponent implements OnInit {

  @Input()
  public values: any = [];

  @Input()
  public itemCaption: string;

  @Input()
  public rightLabel: string;

  @ViewChild('leftSelect', {static: false})
  private leftSelect;

  @ViewChild('rightSelect', {static: false})
  private rightSelect;

  /**
   * Use to validate if an object is equals to other object
   */
  @Input()
  public eqVal: string;

  public localValues: any = [];
  public selValues: any = [];

  constructor(elRef: ElementRef, protected translate: TranslateService, @Optional() @Host() @SkipSelf() protected controlContainer: ControlContainer) {
    super(elRef, translate, controlContainer);
    this.val = null;
  }

  ngOnInit() {
    super.init();
    this.toLocalValues();
  }

  protected addLabel(el: string) {
    if (this.label) {
      const input = this.element.querySelector('.first-twin');
      if (input !== null) {
        const form = this.element.querySelector('.parent');
        const label = document.createElement('label');
        label.className = this.labelClass;
        this.translate.get(this.label).subscribe(e => {
          label.innerHTML = e;
          form.insertBefore(label, input);
          this.setRequired(this.control && this.control.validator !== null);
          this.addToolTip();
        });
      }
    }
  }

  private toLocalValues() {
    this.localValues = [];
    this.values.forEach(e => this.localValues.push(e));
  }

  writeValue(items: any): void {
    this.toLocalValues();
    this.selValues = [];
    if (items === null || items === undefined) {
      this.onChange(null);
      super.writeValue(null);
    } else {
      this.localValues.forEach(e => {
        items.forEach(val => {
          if (e[this.eqVal] === val[this.eqVal]) {
            this.selectElement(e);
          }
        });
      });
    }
  }

  private callOnChanged(value: any) {
    const val = value.length === 0 ? null : value;
    this.onChange(val);
    super.writeValue(val);
  }

  public selectElement(el: any) {
    const idx = this.localValues.indexOf(el);
    this.localValues.splice(idx, 1);
    this.selValues.push(el);
    this.callOnChanged(this.selValues);
  }

  public toRight() {
    Array.from(this.leftSelect.nativeElement.options).forEach((opt: any) => {
      if (opt.selected) {
        this.localValues.forEach(e => {
          const item = this.itemCaption !== undefined ? e[this.itemCaption] : e;
          if (item === opt.text) {
            this.selectElement(e);
          }
        });
      }
    });
  }

  public removeElement(el: any) {
    const idx = this.selValues.indexOf(el);
    this.selValues.splice(idx, 1);
    this.localValues.push(el);
    this.callOnChanged(this.selValues);
  }

  public toLeft() {
    Array.from(this.rightSelect.nativeElement.options).forEach((opt: any) => {
      if (opt.selected) {
        this.selValues.forEach(e => {
          const item = this.itemCaption !== undefined ? e[this.itemCaption] : e;
          if (item === opt.text) {
            this.removeElement(e);
          }
        });
      }
    });
  }
}
