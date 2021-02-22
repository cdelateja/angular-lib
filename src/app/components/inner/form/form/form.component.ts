import { Component, OnInit } from '@angular/core';
import {AbstractValidator, FormValidator, NotEmpty, NotNull, Size} from "cdelateja";
import {BasicForm} from "../../../../dtos/class.definition";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
@FormValidator({
  formId: '',
  validators: [
    NotEmpty.generate(['password', 'birthday', 'comments', 'alias']),
    Size.generateMin(['password'], 5),
    NotNull.generate(['country', 'gender', 'hobbies', 'terms'])
  ],
  object: new BasicForm()
})
export class FormComponent extends AbstractValidator {

  public paises = ['Mexico', 'EUA', 'Canada'];
  public generos = ['Masculino', 'Femenino', 'Otro'];
  public hobbies = ['Correr', 'Cine', 'Leer'];
  public singleMessages = false;

  constructor(protected translate: TranslateService) {
    super(translate);
  }

  submit() {
    console.log(this.validateForm());
  }

  clean() {
    this.reset();
  }

  changeMultiple() {
    this.cleanMessages();
    if (this.singleMessages) {
      this.setAsSingleMessageError();
    } else {
      this.setAsMultipleMessageError();
    }
    this.validateForm();
  }
}
