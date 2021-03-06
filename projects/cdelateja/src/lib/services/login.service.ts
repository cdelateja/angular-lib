import {Injectable, NgZone} from '@angular/core';

import {OauthService} from './oauth.service';
import {ConfigService} from './config.service';
import {LoginRequest, MultipleSessionError, Token, User} from '../dtos/definition-class';
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
  private oauthUrl: string;
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
  public loginAction({getState, patchState}): void {
    this.login();
  }

  @Action(LogoutAction)
  public logoutAction({getState, patchState}): void {
    this.logout();
  }

  /**
   * This function is for having the same app in two different tabs and in one make the login or logout action so it propagates the action
   * Also it is for auto login other applications after the first app log in
   */
  public initListeners(): void {
    this.storageEvent = fromEvent(window, 'storage');
    this.storageEvent.pipe(delay(500)).subscribe((data) => {
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

  public setProperties(appName: string, password: string, pathHome: string): void {
    localStorage.setItem('PATH_HOME', pathHome);
    this.oauthService.setProperties(appName, password);
    this.oauthUrl = this.configService.get('servers.oauth.url');
  }

  public validateSso(): void {
    this.oauthService.ssoCheckCookie().then((result: Token) => {
      if (result) {
        this.login();
      }
    });
  }

  /**
   * Service to retrieve the user object
   *
   * @param request login request object
   */
  public async validateLogin(request: LoginRequest): Promise<boolean> {
    let isAuth = false;
    try {
      await this.oauthService.authenticateUser(request.username, request.password, request.autoLogin)
        .then((isAuthenticated: boolean) => {
          if (isAuthenticated) {
            // this.rolesList = this.oauthService.getUser().authorities;
          }
          isAuth = isAuthenticated;
        }).catch((error) => {
          throw error;
        });
    } catch (e) {
      if (e instanceof MultipleSessionError) {
        throw e;
      }
    }
    return new Promise((resolve) => {
      resolve(isAuth);
    });
  }

  public async validateLoginWithCookie(params: LoginRequest): Promise<boolean> {
    await this.oauthService.authenticate(params.username, params.password)
      .then((authenticated: boolean) => {
        if (authenticated) {
          // this.rolesList = this.oauthService.getUser().authorities;
        }
      }).catch((error) => {
        throw error;
      });
    return this.getIsAuthenticated();
  }

  public getIsAuthenticated(): boolean {
    return this.oauthService.getIsAuthenticated();
  }

  public getUser(): User {
    return this.oauthService.getUser();
  }

  public getToken(): Token {
    return this.oauthService.getToken();
  }

  public login(): void {
    this.statusApp = 'LOGGED';
    localStorage.setItem('APP_STATUS', 'LOGGED');
    localStorage.setItem('ACTION_NAME', STATUS.login);
    if (this.router.url === '/login') {
      this.zone.run(() => {
        this.router.navigate([localStorage.getItem('PATH_HOME')]);
      });
    }
  }

  public logout(): void {
    this.oauthService.logout().then((r) => {
      if (r) {
        localStorage.setItem('ACTION_NAME', STATUS.logout);
        localStorage.removeItem('APP_STATUS');
        localStorage.removeItem('PATH_HOME');
        this.statusApp = 'NOT_LOGGED';
        this.zone.run(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }

  public hasRole(authority: string): boolean {
    return this.oauthService.hasRole(authority);
  }
}
