import {Injectable} from '@angular/core';
import {MultipleSessionError, Response, Token, User, UserIAM} from '../dtos/definition-class';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {ClientService} from './client.service';
import {timer} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  private token = 'token';
  private user = 'user';
  private userIAM = 'userIAM';
  private authenticated = 'authenticated';
  private appName: string;
  private password: string;
  private readonly uriOauth: string;
  private readonly cookieName: string;
  private isAuthenticated = false;
  private timeDifference = 60;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };
  private readonly clientOptions: any;

  constructor(private http: HttpClient,
              private configService: ConfigService,
              private clientService: ClientService,
              private cookieService: CookieService) {
    this.clientOptions = this.clientService.getHttOptions();
    this.uriOauth = this.configService.get('lsServers.zuul.oauthsrv');
    this.cookieName = this.configService.get('sso.cookie');
  }


  public setProperties(appName: string, password: string) {
    this.appName = appName;
    this.password = password;
  }

  public getToken(): Token {
    return JSON.parse(localStorage.getItem(this.token));
  }

  public getUser(): User {
    return JSON.parse(localStorage.getItem(this.user));
  }

  public getUserIAM(): UserIAM {
    return JSON.parse(localStorage.getItem(this.userIAM));
  }

  public getIsAuthenticated(): boolean {
    if (!this.checkIfCookieExists()) {
      return false;
    }
    return JSON.parse(localStorage.getItem(this.authenticated));
  }

  public withToken(): ClientService {
    this.clientService.setHttOptions(this.getHeaders());
    return this.clientService;
  }

  public logout(): Promise<boolean> {
    if (!this.checkIfCookieExists()) {
      return Promise.resolve(true);
    }
    return this.ssoLogout().then(result => {
      localStorage.removeItem(this.token);
      localStorage.removeItem(this.user);
      localStorage.setItem(this.authenticated, JSON.stringify(false));
      this.cookieService.delete(this.cookieName);
      return true;
    });
  }

  public async authenticate(userName: string, password: string): Promise<boolean> {
    const authForm: URLSearchParams = new URLSearchParams();
    authForm.set('grant_type', 'password');
    authForm.set('scope', 'webclient');
    authForm.set('username', userName);
    authForm.set('password', password);
    await this.post(this.uriOauth + '/oauth/token', authForm).then((result) => {
      if (result) {
        localStorage.setItem(this.token, JSON.stringify(result));
        this.isAuthenticated = true;
        this.timerRefreshToken();
      } else {
        return this.isAuthenticated = false;
      }
    }).then(res => {
      return res;
    }).catch((err) => {
      console.warn(`Error authenticating user`);
      return false;
    });
    if (this.isAuthenticated) {
      await this.get(this.uriOauth + '/usuario').then((result) => {
        localStorage.setItem(this.user, JSON.stringify(new User(result['user-name'], result['authorities'])));
      }).then(res => {
        return res;
      }).catch((err) => {
        console.warn(`Error getting user`);
        return null;
      });
    }
    localStorage.setItem(this.authenticated, JSON.stringify(this.isAuthenticated));
    return this.isAuthenticated;
  }

  public async authenticateAndRequestCookie(userName: string, password: string, isAutoLogin: boolean = false): Promise<boolean> {
    await this.authenticate(userName, password);
    if (this.isAuthenticated) {
      await this.ssoStoreCookie(userName, password).then((result) => {
        this.isAuthenticated = true;
      }).catch(error => {
        this.isAuthenticated = true;
        if (!isAutoLogin) {
          this.isAuthenticated = false;
          localStorage.setItem(this.authenticated, JSON.stringify(this.isAuthenticated));
          throw new MultipleSessionError('Login.errorSesionMultiple');
        }
      });
      localStorage.setItem(this.authenticated, JSON.stringify(this.isAuthenticated));
    }
    console.log('Retornando valor del validate', this.isAuthenticated);
    return this.isAuthenticated;
  }

  public refreshToken() {
    const authForm2: URLSearchParams = new URLSearchParams();
    authForm2.set('grant_type', 'refresh_token');
    authForm2.set('refresh_token', this.getToken().refresh_token);
    this.post(this.uriOauth + '/oauth/token', authForm2).then((result) => {
      localStorage.setItem(this.token, JSON.stringify(result));
      this.isAuthenticated = true;
      this.timerRefreshToken();
    });
  }

  private timerRefreshToken() {
    const numbers = timer((Number(this.getToken().expires_in) - this.timeDifference) * 1000);
    numbers.subscribe(x => {
      this.refreshToken();
    });
  }

  private post(url: string, authForm: URLSearchParams): Promise<any> {
    const httpOptions: any = Object.assign({}, this.httpOptions);
    httpOptions.headers = httpOptions.headers.append('Authorization', this.getBasic());
    return this.http.post(url, authForm.toString(), httpOptions).pipe(
      map(data => {
        return data;
      })).toPromise();
  }

  private get(url: string): Promise<any> {
    return this.http.get(url, this.getHeaders()).pipe(
      map(data => {
        return data;
      })).toPromise();
  }

  public checkIfCookieExists(): boolean {
    return this.cookieService.check(this.cookieName);
  }

  public async ssoCheckCookie(): Promise<string> {
    console.log('cookieName', `${this.cookieName}`);
    if (this.checkIfCookieExists()) {
      const base64Credentials = btoa(`${this.appName}:${this.password}`);
      const cookieValue = this.cookieService.get(this.cookieName);
      console.log('cookie', `${this.cookieName},${cookieValue}`);
      this.clientService.setHttOptions(this.getHeaderSsoCheck());
      const responseCookie = await this.clientService.get(
        `${this.uriOauth}/auth/sso/session?credentials=${base64Credentials}&cookie=${cookieValue}`).pipe(
        map(response => {
          console.log('Respuesta del check session cookie', response);
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          console.log('Error');
          return '';
        })
      ).toPromise();

      if (responseCookie && responseCookie !== '') {
        console.log('respuesta decodificada', atob(responseCookie));
        return atob(responseCookie);
      }
    }
    return null;
  }

  public ssoStoreCookie(userName: string, passwordUser: string) {
    const base64Credentials = btoa(`${this.appName}:${this.password}`);
    const base64UserCredentials = btoa(`${userName}:${passwordUser}`);
    this.clientService.setHttOptions(this.getHeaderStoreCookie());
    return this.clientService.get(
      `${this.uriOauth}/sso/cookie?credentials=${base64Credentials}&userCredentials=${base64UserCredentials}`).pipe(
      map(response => {
        console.log('Respuesta de store cookie', response);
        if (response instanceof Response) {
          console.log('Error en validacion de cookie', response.responseError);
          throw new Error('Error por sesión multiple!');
        } else {
          this.cookieService.set(this.cookieName, btoa(response));
        }
        return response;
      })
    ).toPromise();

  }

  public ssoLogout(): Promise<any> {
    this.clientService.setHttOptions(this.getHeaderStoreCookie());
    return this.clientService.get(`${this.uriOauth}/sso/logout?uName=${this.getUser().userName}`).pipe(
      map(response => {
        console.log('Respuesta de store cookie', response);
        return response;
      })
    ).toPromise();
  }


  private getHeaderStoreCookie() {
    console.log('getHeaderStoreCookie', this.getToken().access_token);
    return {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${this.getToken().access_token}`
      }),
      responseType: 'text'
    };
  }

  private getHeaderSsoCheck() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain',
        Authorization: this.getBasic()
      }),
      responseType: 'text'
    };
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getToken().access_token}`
      })
    };
  }

  private getBasic(): string {
    return 'Basic ' + btoa(`${this.appName}:${this.password}`);
  }

}
