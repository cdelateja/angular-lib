import {Component, ElementRef, Input} from '@angular/core';
import {AbstractControl, ControlContainer, ControlValueAccessor, FormControl, ValidationErrors} from '@angular/forms';
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

  @Input()
  public hint: string;

  public controlErrors: ValidationErrors;
  public errorsKeys: string[];
  public status = 'clean';
  public validMessage = 'ValidatorMessages.valid';
  public control: FormControl;
  public val: any;

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
  protected init(): void {
    if (this.controlContainer && this.formControlName) {
      this.control = this.controlContainer.control.get(this.formControlName) as FormControl;
    } else {
      this.control = new FormControl(this.value, []);
    }
  }

  /**
   *
   * @param el
   */
  protected addLabel(el: string): void {
  }

  /**
   *
   */
  public addToolTip(): void {
  }

  /**
   *
   * @param required
   */
  public setRequired(required: boolean): void {
  }

  /**
   *
   * @param toolTip
   */
  public setToolTip(toolTip: string): void {
    this.toolTip = toolTip;
  }

  /**
   * Sets the string value to the label
   * @param label
   */
  public setLabel(label: string): void {
    this.label = label;
  }

  public setMessagesErrors(controlErrors: ValidationErrors, multiMessageErrors: boolean): void {
    this.controlErrors = controlErrors;
    if (this.controlErrors) {
      if (multiMessageErrors) {
        this.errorsKeys = Object.keys(controlErrors);
      } else {
        this.errorsKeys = [];
        this.errorsKeys.push(Object.keys(controlErrors)[0]);
      }
      this.status = 'invalid';
    }
  }

  public validate(multiMessageErrors: boolean): void {
    const controlErrors: ValidationErrors = this.control.errors;
    if (controlErrors !== null) {
      this.setMessagesErrors(controlErrors, multiMessageErrors);
      this.control.markAsTouched();
    } else if (this.control.validator !== null) {
      this.setAsValid();
    } else {
      this.cleanMessages();
    }
  }

  public cleanMessages(): void {
    this.errorsKeys = [];
    this.status = 'clean';
    this.control.markAsUntouched();
  }

  public setAsValid(): void {
    this.errorsKeys = [];
    this.status = 'valid';
  }

  /**
   *
   */
  public get value(): any {
    return this.val;
  }

  /**
   *
   * @param val
   */
  public set value(val: any) {
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
