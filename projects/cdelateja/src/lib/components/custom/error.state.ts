import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

export class CustomErrorStateMatcher implements ErrorStateMatcher {

  public control: FormControl;

  public setControl(control: FormControl): void {
    this.control = control;
  }

  public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(this.control && this.control.invalid);
  }
}
