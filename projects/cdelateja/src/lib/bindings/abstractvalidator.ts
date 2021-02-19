import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject} from 'rxjs';
import {
  createDynamicFormValidator,
  createFormValidator,
  FormBinder,
  generateValidators,
  Validator
} from '../directives/directives.validator';
import {ButtonType} from '../components/button/button.component';
import {AlertType} from '../components/alert/alert.component';
import {AfterViewInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FieldConfig} from '../dtos/definition-class';
import {AbstractComponent} from '../components/definition.components';

/**
 *
 */
@Component({
  selector: 'ct-abstract-component',
  template: `
    <span>
        Not a real component, this class is meant to be used as the definition form components
    </span>
  `
})
export class AbstractValidator implements OnInit, AfterViewInit {

  @ViewChildren(AbstractComponent)
  protected fieldsComponents: QueryList<AbstractComponent>;

  public formGroup: FormGroup;
  public formId: string;
  public formContainer;
  public buttonType: ButtonType = new ButtonType();
  public alertType: AlertType = new AlertType();
  public object?: any;

  private errorsObserver = new Subject<Error[]>();
  protected formBinder: FormBinder;
  protected fieldsMap = new Map<string, AbstractComponent>();
  protected multipleErrorsMessages = true;

  /**
   *
   * @param translate
   */
  constructor(protected translate: TranslateService) {
    this.initFormBinder();
  }


  ngOnInit() {
  }

  ngAfterViewInit() {
    this.init();
  }

  /**
   * Inicialize object this has to be call on ngOnInit() function
   */
  protected init() {
    this.fieldComponentsAsMap();
    this.validateChanges();
    this.formContainer = document.getElementById(this.formId);
    this.subscribeErrors();
  }

  /**
   *
   */
  protected initFormBinder() {
    if (this.formBinder !== undefined) {
      if (this.formBinder.formId === '') {
        this.formId = this.getUuId();
      }
      createFormValidator(this.formBinder, this);
    }
  }

  /**
   *
   * @param fieldsConfig
   */
  protected initDynamicFormBinder(fieldsConfig: FieldConfig[]) {
    this.formId = this.getUuId();
    createDynamicFormValidator(fieldsConfig, this);
  }

  /**
   * triggers the observable event to display errors on components
   */
  public setMessageErrors(errors: Error[]) {
    this.errorsObserver.next(errors);
  }

  /**
   * Clean error messages then it shows errors. Returns formValid Boolean
   */
  public validateForm(): Boolean {
    this.fieldsMap.forEach((abstractField: AbstractComponent, key: string) => {
      const abstractControl = this.formGroup.controls[key];
      this.validateField(abstractControl, abstractField);
    });
    return this.formGroup.valid;
  }

  /**
   * Function for remove all error messages
   */
  public cleanMessages() {
    this.fieldsMap.forEach((value: AbstractComponent, key: string) => {
      value.cleanMessages();
    });
  }

  /**
   * Function that returns string value o translate json file
   */
  private getMessage(error: any): string {
    return this.translate.instant(error.message, error);
  }

  /**
   * Validate a specific field
   * @param control
   * @param abstractField
   */
  public validateField(control: AbstractControl, abstractField: AbstractComponent) {
    const controlErrors: ValidationErrors = control.errors;
    if (controlErrors !== null) {
      abstractField.setMessagesErrors(controlErrors, this.multipleErrorsMessages);
    } else if (control.validator !== null) {
      abstractField.setAsValid();
    } else {
      abstractField.cleanMessages();
    }
  }

  /**
   * Get field Observable
   */
  public getFieldObservable(field: string): Observable<any> {
    const control = this.getControl(field);
    if (control) {
      return control.valueChanges;
    }
    return null;
  }

  public getFormObservable(): Observable<any> {
    return this.formGroup.valueChanges;
  }

  public disableField(field: string) {
    const control: AbstractControl = this.getControl(field);
    if (control) {
      control.disable();
    }
  }

  public enabledField(field: string) {
    const control: AbstractControl = this.getControl(field);
    if (control) {
      control.enable();
    }
  }

  private getControl(field: string) {
    return this.formGroup.controls[field];
  }

  /**
   * Creates an observable for every field
   */
  private validateChanges() {
    this.fieldsMap.forEach((abstractField: AbstractComponent, key: string) => {
      const abstractControl = this.formGroup.controls[key];
      abstractControl.valueChanges.subscribe(() => {
          this.validateField(abstractControl, abstractField);
        }
      );
    });
  }

  /**
   *
   */
  protected fieldComponentsAsMap() {
    this.fieldsComponents.forEach(f => {
      if (f.formControlName && !this.fieldsMap.has(f.formControlName)) {
        this.fieldsMap.set(f.formControlName, f);
      }
    });
  }

  /**
   * Generate an observable for errors
   */
  private subscribeErrors() {
    this.errorsObserver.asObservable().subscribe((errors: Error[]) => {
      errors.forEach(e => {
        const control = this.formGroup.controls[e.field];
        const abstractField = this.fieldsMap.get(e.field);
        control.setErrors(e.error);
        this.validateField(control, abstractField);
      });
    });
  }

  /**
   *
   * @param field
   */
  protected cleanErrors(field: string) {
    const control = this.formGroup.controls[field];
    const abstractField = this.fieldsMap.get(field);
    control.setErrors(null);
    this.validateField(control, abstractField);
  }

  /**
   * resets form and validation messages
   * @param value
   */
  public reset(value?: any) {
    if (value) {
      this.formGroup.reset(value);
    } else {
      this.formGroup.reset(this.object);
    }
    this.cleanMessages();
  }

  /**
   *
   * @param field
   * @param value
   */
  public setValue(field: string, value: any) {
    this.formGroup.controls[field].setValue(value);
  }

  /**
   * Generates unique id for form
   */
  public getUuId(): string {
    return '' + Math.round(Math.random() * 1000000);
  }

  /**
   *
   */
  protected getMessageErrors(): string[] {
    const messageErrors = [];
    this.fieldsMap.forEach((abstractField: AbstractComponent, key: string) => {
      const control = this.formGroup.controls[key];
      const controlErrors: ValidationErrors = control.errors;
      const element = this.formContainer.querySelector(`[name=${key}]`);
      const parent = element.closest('.form-group');
      const label = parent.querySelector('.ls-label');
      if (controlErrors != null) {
        messageErrors.push(label.textContent.split('*').join('').split('?').join('') + ': '
          + this.getMessage(controlErrors[Object.keys(controlErrors)[0]]));
      }
    });
    return messageErrors;
  }

  /**
   *
   * @param validators
   */
  protected addValidators(validators: Validator[]) {
    const validatorsMap = new Map<string, ValidatorFn[]>();
    generateValidators(validatorsMap, validators);
    validatorsMap.forEach((value: ValidatorFn[], key: string) => {
      this.formGroup.controls[key].clearValidators();
      this.formGroup.controls[key].setValidators(value);
      this.formGroup.controls[key].updateValueAndValidity();
    });
  }

  /**
   *
   */
  protected setAsSingleMessageError() {
    this.multipleErrorsMessages = false;
  }

  /**
   *
   */
  protected setAsMultipleMessageError() {
    this.multipleErrorsMessages = true;
  }

}

export class Error {
  field: string;
  error = {
    errorType: {
      message: ''
    }
  };

  static create(field: string, message: string): Error {
    return message != null ? {
      field,
      error: {
        errorType: {
          message
        }
      }
    } : {
      field,
      error: null
    };
  }
}
