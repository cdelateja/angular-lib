import {Component, OnInit} from '@angular/core';
import {DynamicAbstractValidator, FieldConfig} from 'cdelateja';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent extends DynamicAbstractValidator implements OnInit {

  regConfig: FieldConfig[] = [
    {
      type: 'input',
      label: 'Username',
      placeHolder: 'Username',
      formControlName: 'userName',
      value: '',
      validations: ['NotEmpty']
    },
    {
      type: 'input',
      label: 'Complete name',
      placeHolder: 'Complete name',
      formControlName: 'completeName',
      value: '',
      validations: ['NotEmpty']
    },
    {
      type: 'input',
      label: 'Email',
      placeHolder: 'Email',
      value: '',
      formControlName: 'email',
      validations: ['NotEmpty', 'Email']
    },
    {
      type: 'radiobutton',
      label: 'Gender',
      placeHolder: 'Select gender',
      formControlName: 'gender',
      value: null,
      collections: ['F', 'M'],
      validations: ['NotNull']
    }
  ];

  constructor(protected translate: TranslateService) {
    super(translate);
    this.initDynamicFormBinder(this.regConfig);
  }

  ngOnInit() {
  }

  submit() {
    this.validateForm();
  }

  clean() {
    this.cleanMessages();
  }

}
