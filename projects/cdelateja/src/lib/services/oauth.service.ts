import {Injectable} from '@angular/core';
import {Response, Token, User, ValidateReq} from '../dtos/definition-class';
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
  }

  public setProperties(appName: string, password: string): void {
    this.appName = appName;
    this.password = password;
  }

  public getUriOauth(): string {
    return this.configService.get('servers.oauth.url');
  }

  public getToken(): Token {
    return JSON.parse(localStorage.getItem(this.token));
  }

  public getUser(): User {
    return JSON.parse(localStorage.getItem(this.user));
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
    return this.ssoLogout().then((result) => {
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
    authForm.set('username', userName);
    authForm.set('password', password);
    await this.post(this.getUriOauth() + '/oauth/token', authForm).then((result) => {
      if (result) {
        localStorage.setItem(this.token, JSON.stringify(result));
        this.isAuthenticated = true;
        this.timerRefreshToken();
      } else {
        return this.isAuthenticated = false;
      }
    }).then((res: boolean) => {
      return res;
    }).catch((err) => {
      console.warn(`Error authenticating user`);
      return false;
    });
    if (this.isAuthenticated) {
      await this.findUser();
    }
    localStorage.setItem(this.authenticated, JSON.stringify(this.isAuthenticated));
    return this.isAuthenticated;
  }

  private async findUser(): Promise<void> {
    await this.withToken().get(this.getUriOauth() + '/user/find').toPromise()
      .then((result: Response) => {
        if (ClientService.validateData(result)) {
          const user: User = result.result;
          localStorage.setItem(this.user, JSON.stringify(user));
        }
      }).catch((err) => {
        console.warn(`Error getting user`);
        return null;
      });
  }

  public async authenticateUser(userName: string, password: string, isAutoLogin: boolean = false): Promise<boolean> {
    await this.authenticate(userName, password)
      .then((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          this.ssoStoreCookie();
        }
      });
    return new Promise((resolve) => {
      resolve(this.isAuthenticated);
    });
  }

  public refreshToken(): void {
    const authForm2: URLSearchParams = new URLSearchParams();
    authForm2.set('grant_type', 'refresh_token');
    authForm2.set('refresh_token', this.getToken().refresh_token);
    this.post(this.getUriOauth() + '/oauth/token', authForm2).then((result) => {
      localStorage.setItem(this.token, JSON.stringify(result));
      this.isAuthenticated = true;
      this.timerRefreshToken();
    });
  }

  private timerRefreshToken(): void {
    const numbers = timer((Number(this.getToken().expires_in) - this.timeDifference) * 1000);
    numbers.subscribe((x) => {
      this.refreshToken();
    });
  }

  private post(url: string, authForm: URLSearchParams): Promise<any> {
    const httpOptions: any = Object.assign({}, this.httpOptions);
    httpOptions.headers = httpOptions.headers.append('Authorization', this.getBasic());
    return this.http.post(url, authForm.toString(), httpOptions).pipe(
      map((data) => {
        return data;
      })).toPromise();
  }

  public checkIfCookieExists(): boolean {
    return this.cookieService.check(this.cookieName);
  }

  public async ssoCheckCookie(): Promise<Token> {
    let token: Token = null;
    if (this.checkIfCookieExists()) {
      const validateRe: ValidateReq = new ValidateReq();
      validateRe.key = this.cookieService.get(this.cookieName);
      await this.clientService.post(
        `${this.getUriOauth()}/user/login`, validateRe).pipe(
        map((response: Response) => {
          if (ClientService.validateData(response)) {
            token = response.result;
            localStorage.setItem(this.token, JSON.stringify(token));
            return token;
          }
          return null;
        }),
        catchError((error: HttpErrorResponse) => {
          console.log('Error: ' + error.message);
          return '';
        })
      ).toPromise();
    }
    return new Promise((resolve) => {
      resolve(token);
    });
  }

  public ssoStoreCookie(): void {
    this.cookieService.set(this.cookieName, this.getUser().secretKey);
  }

  public ssoLogout(): Promise<any> {
    this.clientService.setHttOptions(this.getHeaderStoreCookie());
    return this.withToken().get(`${this.getUriOauth()}/user/logout`).pipe(
      map((response) => {
        console.log('Respuesta de store cookie', response);
        return response;
      })
    ).toPromise();
  }

  private getHeaderStoreCookie(): any {
    console.log('getHeaderStoreCookie', this.getToken().access_token);
    return {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${this.getToken().access_token}`
      }),
      responseType: 'text'
    };
  }

  private getHeaders(): any {
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

  public hasRole(authority: string): boolean {
    return this.getUser().authorities.filter((userRole: string) => {
      return userRole === authority;
    }).length > 0;
  }

}
