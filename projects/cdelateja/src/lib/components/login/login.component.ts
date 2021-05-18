import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AbstractValidator} from '../../bindings/abstractvalidator';
import {FormValidator, NotEmpty} from '../../directives/directives.validator';
import {LoginRequest} from '../../dtos/definition-class';
import {LoginService} from '../../services/login.service';
import {IdleService} from '../../services/idle.service';
import {NotificationPop} from '../services/notification.service';

@Component({
  selector: 'ct-login',
  templateUrl: './login.component.html',
  styles: []
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

  @Input()
  public icon: any;

  @Input()
  public title: string;

  constructor(protected translate: TranslateService, private loginService: LoginService,
              private idleService: IdleService, protected notification: NotificationPop) {
    super(translate);
  }

  public ngOnInit(): void {
    this.loginService.setProperties(this.appName, this.appPassword, this.pathHome);
    this.loginService.validateSso();

    // if (this.idleTimeout !== undefined) {
    //   this.idleService.initIdleTimeout(this.idleTimeout);
    //   this.idleService.getObservableOnEndedIdle().subscribe(data => {
    //     console.log('Se termina tiempo de inactividad');
    //     this.loginService.logout();
    //   });
    // }
  }

  public async login(): Promise<any> {
    if (this.validateForm()) {
      const params = this.formGroup.value;
      await this.loginService.validateLogin(params).then((authenticated: boolean) => {
        if (authenticated) {
          this.loginService.login();
        } else {
          this.notification.showError(this.translate.instant('Login.error'));
        }
      }).catch((error) => {
        this.notification.showError(this.translate.instant(error.message));
      });
    }
  }
}
