import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup} from '@angular/forms';
import {AbstractValidator} from '../../bindings/abstractvalidator';
import { FormValidator, NotEmpty } from '../../directives/directives.validator';
import {LoginRequest} from '../../dtos/definition-class';
import {LoginService} from '../../services/login.service';
import {IdleService} from '../../services/idle.service';
import {Router} from '@angular/router';
import {NotificationPop} from '../services/notification.service';


@Component({
  selector: 'ct-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
@FormValidator({
  formId: '',
  validators: [
    NotEmpty.generate(['username', 'password'])
  ],
  object: new LoginRequest()
})
export class LoginComponent extends AbstractValidator implements OnInit {

  @Input()
  public appName: string;

  @Input()
  public appPassword: string;

  @Input()
  public idleTimeout: number;

  @Input()
  public pathHome: string;

  constructor(protected translate: TranslateService, private loginService: LoginService,
              private idleService: IdleService, private router: Router,
              protected notification: NotificationPop) {
    super(translate);
  }

  ngOnInit() {
    console.log('idleTimeout', this.idleTimeout);
    this.loginService.setProperties(this.appName, this.appPassword, this.pathHome);
    this.loginService.validateSso();

    if (this.idleTimeout !== undefined) {
      this.idleService.initIdleTimeout(this.idleTimeout);
      this.idleService.getObservableOnEndedIdle().subscribe(data => {
        this.loginService.logout();
      });
    }
  }

  async login(formGroup: FormGroup) {
    if (this.validateForm()) {
      const params = this.formGroup.value;
      console.log(params);
      await this.loginService.validateLogin(params).then((authenticated) => {
        console.log(authenticated);
        if (authenticated) {
          this.notification.showSuccess('Datos correctos');
        } else {
          this.notification.showError('Usuario y Password Incorrectos \n');
        }
      }).catch((error) => {
        this.notification.showError(this.translate.instant(error.message));
      });
    }
  }

}
