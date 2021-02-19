import {Component, ElementRef, Input} from '@angular/core';
import {AbstractControl, ControlContainer, ControlValueAccessor, ValidationErrors} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

/**
 * Defines the base attributes and behavior for LS input components
 */
@Component({
  selector: 'ct-abstract-component',
  template: `
    <span>
        Not a real component, this class is meant to be used as the definition of all input components
    </span>
  `
})
export class AbstractComponent implements ControlValueAccessor {

  protected readonly element: HTMLInputElement;

  @Input()
  public label: string;

  @Input()
  public placeHolder: string;

  @Input()
  public toolTip: string;

  @Input()
  public formControlName: string;

  @Input()
  public disabled = false;

  public controlErrors: ValidationErrors;
  public errorsKeys: string[];
  public status = 'clean';
  public validMessage = 'ValidatorMessages.valid';

  protected control: AbstractControl;
  protected val: any;
  protected labelClass = 'ct-label';
  protected multipleErrors = false;
  protected onChange: any = () => {
  };
  protected onTouched: any = () => {
  };


  /**
   *
   * @param elRef
   * @param translate
   * @param controlContainer
   */
  constructor(elRef: ElementRef, protected translate: TranslateService, protected controlContainer: ControlContainer) {
    this.element = elRef.nativeElement;
  }

  /**
   *
   */
  protected init() {
    if (this.controlContainer && this.formControlName) {
      this.control = this.controlContainer.control.get(this.formControlName);
    }
    this.addLabel('input');
  }

  /**
   *
   * @param el
   */
  protected addLabel(el: string) {
    if (this.label) {
      const input = this.element.querySelector(el);
      if (input !== null) {
        const form = this.element.querySelector('.form-group');
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

  /**
   *
   */
  public addToolTip() {
    if (this.toolTip) {
      const label = this.element.querySelector('.ct-label');
      if (label !== null) {
        const span = document.createElement('span');
        span.className = 'badge badge-warning data-tooltip';
        span.innerHTML = '?';
        span.setAttribute('data-tooltip', this.translate.instant(this.toolTip));
        label.appendChild(span);
      }
    }
  }

  /**
   *
   * @param required
   */
  public setRequired(required: boolean) {
    if (this.label) {
      const label = this.element.querySelector('.ct-label');
      const mark = this.element.querySelector('.required-field-indicator');
      if (label !== null) {
        if (required && mark == null) {
          const span = document.createElement('span');
          span.className = 'required-field-indicator';
          span.innerHTML = '*';
          label.appendChild(span);
        } else if (!required && mark !== null) {
          label.removeChild(mark);
        }
      }
    }
  }

  /**
   *
   * @param toolTip
   */
  public setToolTip(toolTip: string) {
    this.toolTip = toolTip;
  }

  /**
   * Sets the string value to the label
   * @param label
   */
  public setLabel(label: string) {
    this.label = label;
  }

  public setMessagesErrors(controlErrors: ValidationErrors, multiMessageErrors: boolean) {
    this.controlErrors = controlErrors;
    if (this.controlErrors) {
      if (multiMessageErrors) {
        this.errorsKeys = Object.keys(controlErrors);
      } else {
        this.errorsKeys = [];
        this.errorsKeys.push(Object.keys(controlErrors)[0]);
      }
      this.status = 'invalid'
    }
  }

  public cleanMessages() {
    this.errorsKeys = [];
    this.status = 'clean';
  }

  public setAsValid() {
    this.errorsKeys = [];
    this.status = 'valid';
  }


  /**
   *
   */
  public get value() {
    return this.val;
  }

  /**
   *
   * @param val
   */
  public set value(val) {
    this.val = val;
    this.onChange(val);
    this.onTouched();
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(value: any): void {
    this.val = value;
  }

  public getElement(): HTMLInputElement {
    return this.element;
  }
}
