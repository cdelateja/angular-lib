import {Component, OnInit} from '@angular/core';
import {AbstractValidator, FormValidator, NotEmpty, NotNull, OauthService, Size, NotFalse, NotZero} from 'cdelateja';
import {BasicForm, Pais} from '../../../../dtos/class.definition';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html'
})
@FormValidator({
  formId: '',
  validators: [
    NotEmpty.generate(['password', 'birthday', 'comments', 'alias', 'name']),
    Size.generateMin(['password'], 5),
    NotNull.generate(['country', 'gender', 'hobbies']),
    NotFalse.generate(['terms']),
    NotZero.generate(['age'])
  ],
  object: new BasicForm()
})
export class BasicFormComponent extends AbstractValidator implements OnInit {

  public paises: Pais[] = [new Pais(1, 'Mexico'), new Pais(2, 'EUA'), new Pais(3, 'Canada')];
  public generos = [{id: 1, nombre: 'Masculino'}, {id: 2, nombre: 'Femenino'}, {id: 3, nombre: 'otro'}];
  public hobbies = ['Correr', 'Cine', 'Leer'];
  public singleMessages = true;

  constructor(protected translate: TranslateService, private oauthService: OauthService) {
    super(translate);
  }

  public ngOnInit(): void {
    // this.getFieldObservable('name').subscribe(value => {
    //   let errors: Error[] = [];
    //   if (value !== '') {
    //     errors.push(Error.create('name', 'Error aqui'));
    //     this.setMessageErrors(errors);
    //   } ecte {
    //     this.cleanErrors('name');
    //   }
    // });
    // this.addValidators([NotEmpty.generate(['name'])]);
    // this.reset(new BasicForm());
  }

  public submit(): void {
    console.log(this.formGroup.getRawValue());
    console.log(this.validateForm());
  }

  public clean(): void {
    this.reset(new BasicForm());
  }

  public changeMultiple(): void {
    this.cleanMessages();
    if (!this.singleMessages) {
      this.setAsSingleMessageError();
    } else {
      this.setAsMultipleMessageError();
    }
    this.validateForm();
  }


}
