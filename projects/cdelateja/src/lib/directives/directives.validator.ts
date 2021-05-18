import {FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import 'reflect-metadata';
import {AbstractValidator} from '../bindings/abstractvalidator';
import {FieldConfig} from '../dtos/definition-class';

/**
 * This defines what FormValidator needs
 * fields are for fields without Validators
 */
export class FormBinder {
  public formId: string;
  public validators?: Validator[] = [];
  public orValidators?: OrValidator[] = [];
  public object?: any;
}

/**
 * Definition for every validator
 * Every generate class must have a private constructor and a generate method
 */
export interface Validator {
  message?: string;
  fields: string[];

  isValid(value: any): any;
}

/**
 * This class is used as an or validator
 */
export class OrValidator implements Validator {
  public fields: string[];
  public message: string;
  public validators: Validator[];

  private constructor(fields: string[], validators: Validator[], message: string) {
    this.fields = fields;
    this.validators = validators;
    this.message = message;
  }

  public static generate(fields: string[], validators: Validator[], message: string): OrValidator {
    return new OrValidator(fields, validators, message);
  }

  public isValid(value: string): any {
    for (const v of this.validators) {
      if (v.isValid(value) === null) {
        return null;
      }
    }
    return {
      ranged: {
        message: this.message,
      }
    };
  }
}

/**
 * Custom validators
 */
export class LSValidators {
  /**
   * Generate any type of validator for the FormGroup
   */
  public static generateValidator(validator: Validator): any {
    const lambda = (c: FormControl) => {
      return validator.isValid(c.value);
    };
    return lambda;
  }
}

/**
 * This function creates the FormGroup and put every validator in it,
 * then it passes the reference to the AbstractValidator
 */
export function FormValidator(formBinder: FormBinder): any {
  return (target) => {
    Object.defineProperty(target.prototype, 'formBinder', {value: formBinder});
  };
}

/**
 * This function generates an AbstractValidator, its used when you have need to validate other forms in your page, or
 * your class doesnt extends from AbstractValidator
 */
export function createFormValidator(formBinder: FormBinder, abstractValidator: AbstractValidator): void {
  const validators = new Map<string, ValidatorFn[]>();
  const form: FormGroup = new FormGroup({});

  generateValidators(validators, formBinder.validators);
  generateValidators(validators, formBinder.orValidators);

  validators.forEach((value: ValidatorFn[], key: string) => {
    if (formBinder.object !== undefined) {
      form.addControl(key, new FormControl(formBinder.object[key] !== undefined ?
        formBinder.object[key] : '', value));
    } else {
      form.addControl(key, new FormControl('', value));
    }
  });

  if (formBinder.object !== undefined) {
    Object.keys(formBinder.object).forEach((e: string) => {
      if (!validators.has(e)) {
        form.addControl(e, new FormControl(formBinder.object[e], null));
      }
    });
  }

  abstractValidator.formGroup = form;
  abstractValidator.object = formBinder.object;
}

/**
 *
 * @param fieldsConfig
 * @param abstractValidator
 */
export function createDynamicFormValidator(fieldsConfig: FieldConfig[], abstractValidator: AbstractValidator): void {
  const validationsFounded = new Map<string, string[]>();
  const object = {};
  if (fieldsConfig) {
    fieldsConfig.forEach((f: FieldConfig) => {
      if (f.validations !== undefined) {
        f.validations.forEach((v: string) => {
          if (validationsFounded.has(v)) {
            validationsFounded.get(v).push(f.formControlName);
          } else {
            validationsFounded.set(v, [f.formControlName]);
          }
        });
      }
      object[f.formControlName] = f.value;
    });
  }
  const validators: Validator[] = getValidations(validationsFounded);
  const orValidators: OrValidator[] = [];
  const formBinder: FormBinder = {
    formId: '',
    validators,
    object
  };
  createFormValidator(formBinder, abstractValidator);
}

/**
 *
 * @param validatorsMap
 * @param validators
 */
export function generateValidators(validatorsMap: Map<string, ValidatorFn[]>, validators: Validator[]): void {
  if (validators !== undefined) {
    validators.forEach((v: Validator) => {
      v.fields.forEach((field: string) => {
        if (validatorsMap.has(field)) {
          validatorsMap.get(field).push(LSValidators.generateValidator(v));
        } else {
          validatorsMap.set(field, [LSValidators.generateValidator(v)]);
        }
      });
    });
  }
}

/**
 *
 * @param validationsFounded
 */
function getValidations(validationsFounded: Map<string, string[]>): Validator[] {
  const validators: Validator[] = [];
  validationsFounded.forEach((value: string[], key: string) => {
    if (key.includes('NotEmpty')) {
      validators.push(NotEmpty.generate(value));
    } else if (key.includes('NotNull')) {
      validators.push(NotNull.generate(value));
    } else if (key.includes('Email')) {
      validators.push(Email.generate(value));
    } else if (key.includes('OnlyNumbers')) {
      validators.push(OnlyNumbers.generate(value));
    } else {
      validators.push(Pattern.generate(value, key, 'Message error'));
    }
  });
  return validators;
}

/**
 * Size validator, it can validate range, min, or max lenght of a Value
 */
export class Size implements Validator {
  public min?: number;
  public max?: number;
  public message: string;
  public fields: string[];

  private constructor(fields: string[], min: number, max: number, message: string) {
    this.fields = fields;
    this.min = min;
    this.max = max;
    this.message = message;
  }

  public static generate(fields: string[], min: number, max: number, message: string = 'ValidatorMessages.ranged'): Size {
    return new Size(fields, min, max, message);
  }

  public static generateMin(fields: string[], min: number, message: string = 'ValidatorMessages.min'): Size {
    return new Size(fields, min, undefined, message);
  }

  public static generateMax(fields: string[], max: number, message: string = 'ValidatorMessages.max'): Size {
    return new Size(fields, undefined, max, message);
  }

  public isValid(value: any): any {
    if (value === null) {
      return null;
    }

    if (this.min !== undefined && this.max !== undefined) {
      if (value.length < this.min || value.length > this.max) {
        return {
          ranged: {
            message: this.message,
            min: this.min,
            max: this.max
          }
        };
      }
    } else if (this.min !== undefined) {
      if (value.length < this.min) {
        return {
          min: {
            message: this.message,
            min: this.min
          }
        };
      }
    } else if (this.max !== undefined) {
      if (value.length > this.max) {
        return {
          max: {
            message: this.message,
            max: this.max
          }
        };
      }
    }
    return null;
  }
}

/**
 * Validate pattern
 */
export class Pattern implements Validator {
  public fields: string[];
  public message: string;
  public regexp: string;

  private constructor(fields: string[], regexp: string, message: string) {
    this.fields = fields;
    this.regexp = regexp;
    this.message = message;
  }

  public static generate(fields: string[], regexp: string, message: string): Pattern {
    return new Pattern(fields, regexp, message);
  }

  public isValid(value: any): any {
    if (value === null) {
      return null;
    }
    if (!value.match(this.regexp)) {
      return {
        pattern: {
          message: this.message
        }
      };
    }
    return null;
  }
}

/**
 *
 */
export class NotEmpty implements Validator {
  public fields: string[];
  public message: string;

  private constructor(fields: string[], message: string) {
    this.fields = fields;
    this.message = message;
  }

  public static generate(fields: string[], message: string = 'ValidatorMessages.notEmpty'): NotEmpty {
    return new NotEmpty(fields, message);
  }

  public isValid(value: any): any {
    if (value === undefined || value === null || '' === value) {
      return {
        required: {
          message: this.message
        }
      };
    }
    return null;
  }
}

/**
 *
 */
export class NotNull implements Validator {
  public fields: string[];
  public message: string;

  private constructor(fields: string[], message: string) {
    this.fields = fields;
    this.message = message;
  }

  public static generate(fields: string[], message: string = 'ValidatorMessages.notNull'): NotNull {
    return new NotNull(fields, message);
  }

  public isValid(value: any): any {
    if (value === null) {
      return {
        nullValidator: {
          message: this.message
        }
      };
    }
    return null;
  }
}

/**
 *
 */
export class Email implements Validator {
  public fields: string[];
  public message: string;
  public regexEmail = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  private constructor(fields: string[], message: string) {
    this.fields = fields;
    this.message = message;
  }

  public static generate(fields: string[], message: string = 'ValidatorMessages.email'): NotEmpty {
    return new Email(fields, message);
  }

  public isValid(value: any): any {
    if (value === null) {
      return null;
    }
    if (!value.match(this.regexEmail)) {
      return {
        pattern: {
          message: this.message
        }
      };
    }
    return null;
  }
}

/**
 *
 */
export class OnlyNumbers implements Validator {
  public fields: string[];
  public message: string;
  public regexNumbers = '^-?(0|[1-9]\\d*)?$';

  private constructor(fields: string[], message: string) {
    this.fields = fields;
    this.message = message;
  }

  public static generate(fields: string[], message: string = 'ValidatorMessages.onlyNumbers'): NotEmpty {
    return new OnlyNumbers(fields, message);
  }

  public isValid(value: any): any {
    if (value === null) {
      return null;
    }
    if (!value.match(this.regexNumbers)) {
      return {
        pattern: {
          message: this.message
        }
      };
    }
    return null;
  }
}

export class NotFalse implements Validator {
  public fields: string[];
  public message: string;

  private constructor(fields: string[], message: string) {
    this.fields = fields;
    this.message = message;
  }

  public static generate(fields: string[], message: string = 'ValidatorMessages.notFalse'): NotEmpty {
    return new NotFalse(fields, message);
  }

  public isValid(value: boolean): any {
    if (value === null || value === false) {
      return {
        required: {
          message: this.message
        }
      };
    }
    return null;
  }
}

export class NotZero implements Validator {
  public fields: string[];
  public message: string;

  private constructor(fields: string[], message: string) {
    this.fields = fields;
    this.message = message;
  }

  public static generate(fields: string[], message: string = 'ValidatorMessages.notZero'): NotEmpty {
    return new NotZero(fields, message);
  }

  public isValid(value: number): any {
    if (value === null || value <= 0) {
      return {
        required: {
          message: this.message
        }
      };
    }
    return null;
  }
}
