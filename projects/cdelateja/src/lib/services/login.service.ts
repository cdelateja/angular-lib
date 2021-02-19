import {Injectable, NgZone} from '@angular/core';

import {OauthService} from './oauth.service';
import {ConfigService} from './config.service';
import {LoginRequest, MultipleSessionError, Token, User, UserIAM} from '../dtos/definition-class';
import {Action, Store} from '@ngxs/store';
import {LoginAction, LogoutAction, STATUS} from './login.action';
import {fromEvent, Observable} from 'rxjs';
import {delay} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public rolesList: string[];
  private iamUrl: string;
  private storageEvent: Observable<Event>;
  private statusApp = 'NOT_LOGGED';

  constructor(private store: Store,
              private router: Router,
              private zone: NgZone,
              private oauthService: OauthService,
              private configService: ConfigService) {
    this.initListeners();
    if (localStorage.getItem('APP_STATUS')) {
      this.statusApp = localStorage.getItem('APP_STATUS');
    }
  }

  @Action(LoginAction)
  loginAction({getState, patchState}) {
    this.login();
  }

  @Action(LogoutAction)
  logoutAction({getState, patchState}) {
    this.logout();
  }

  /**
   * This function is for having the same app in two different tabs and in one make the login or logout action so it propagates the action
   * Also it is for auto login other applications after the first app log in
   */
  initListeners() {
    this.storageEvent = fromEvent(window, 'storage');
    this.storageEvent.pipe(delay(500)).subscribe(data => {
      console.log('initListeners');
      const action = localStorage.getItem('ACTION_NAME');
      if (this.statusApp === 'NOT_LOGGED') {
        if (action === STATUS.login) {
          this.store.dispatch(new LoginAction());
        }
      }
      if (this.statusApp === 'LOGGED') {
        if (action === STATUS.logout) {
          this.store.dispatch(new LogoutAction());
        }
      }
    });
  }

  public setProperties(appName: string, password: string, pathHome: string) {
    localStorage.setItem('PATH_HOME', pathHome);
    this.oauthService.setProperties(appName, password);
    this.iamUrl = this.configService.get('lsServers.zuul.iamserverrepo');
  }

  public validateSso() {
    console.log('Antes del serivico de ssCheckCookie');
    this.oauthService.ssoCheckCookie().then(result => {
      if (result && result !== '') {
        this.loginWithSsoCookie(result);
      }
    });
  }

  public loginWithSsoCookie(cookie: string) {
    const userPassword: string[] = cookie.split(':');
    const loginRequest = new LoginRequest();
    loginRequest.username = userPassword[0];
    loginRequest.password = userPassword[1];
    loginRequest.autoLogin = true;
    console.log('Entrando al login', loginRequest);
    this.validateLoginWithCookie(loginRequest).then(r => {
      if (r) {
        console.log(r);
        this.login();
      }
    });
  }

  /**
   * Service to retrieve the user object
   *
   * @param params login request object
   */
  public async validateLogin(params: LoginRequest): Promise<boolean> {
    try {
      await this.oauthService.authenticateAndRequestCookie(params.username, params.password, params.autoLogin)
        .then((authenticated) => {
          if (authenticated) {
            this.rolesList = this.oauthService.getUser().authorities;
            this.login();
          }
        }).catch(error => {
          throw error;
        });
      if (this.getIsAuthenticated()) {
        await this.oauthService.withToken().get(`${this.iamUrl}/usuario/admin/by/nombre?nombre=${params.username}`)
          .toPromise().then(result => {
            localStorage.setItem('userIAM', JSON.stringify(result));
          });
      }
      return this.getIsAuthenticated();
    } catch (e) {
      if (e instanceof MultipleSessionError) {
        throw e;
      }
      return false;
    }
  }

  public async validateLoginWithCookie(params: LoginRequest): Promise<boolean> {
    await this.oauthService.authenticate(params.username, params.password)
      .then((authenticated) => {
        if (authenticated) {
          this.rolesList = this.oauthService.getUser().authorities;
        }
      }).catch(error => {
        throw error;
      });
    if (this.getIsAuthenticated()) {
      await this.oauthService.withToken().get(`${this.iamUrl}/usuario/admin/by/nombre?nombre=${params.username}`)
        .toPromise().then(result => {
          localStorage.setItem('userIAM', JSON.stringify(result));
        });
    }
    return this.getIsAuthenticated();
  }

  public getIsAuthenticated(): boolean {
    return this.oauthService.getIsAuthenticated();
  }

  public getUser(): User {
    return this.oauthService.getUser();
  }

  public getUserIAM(): UserIAM {
    return this.oauthService.getUserIAM();
  }

  public getToken(): Token {
    return this.oauthService.getToken();
  }

  public login() {
    this.statusApp = 'LOGGED';
    localStorage.setItem('APP_STATUS', 'LOGGED');
    localStorage.setItem('ACTION_NAME', STATUS.login);
    if (this.router.url === '/login') {
      this.zone.run(() => {
        this.router.navigate([localStorage.getItem('PATH_HOME')]);
      });
    }
  }

  public logout() {
    this.oauthService.logout().then(r => {
      if (r) {
        localStorage.setItem('ACTION_NAME', STATUS.logout);
        localStorage.removeItem('APP_STATUS');
        localStorage.removeItem('PATH_HOME');
        localStorage.removeItem('userIAM');
        this.statusApp = 'NOT_LOGGED';
        this.zone.run(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }
}
