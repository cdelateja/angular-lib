import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders} from '@angular/common/http';
import {ClientOptions, Progress, Response, Token} from '../dtos/definition-class';
import {catchError, concatMap, delay, map, retryWhen, shareReplay, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private token = 'token';
  public cache: Map<string, Observable<any>> = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {
  }

  public static validateData(response: Response): boolean {
    const status: number = response.responseStatus;
    const system = status / 1000;
    const error = status % 1000;
    switch (error) {
      case 200:
        return true;
      default:
        return false;
    }
  }

  public create(): RestClient {
    return new RestClient(this.http, this);
  }

  public getToken(): Token {
    return JSON.parse(localStorage.getItem(this.token));
  }

}

export class RestClient {

  private NO_CONNECTION = 0;
  private httpOptions = {};
  private type: string;
  private url: string;
  private contentType = 'application/json';
  private token = '';
  private responseType = '';
  private jsonBody: any;
  private options: ClientOptions;

  constructor(private http: HttpClient,
              private clientService: ClientService) {
  }

  public static create(http: HttpClient, clientService: ClientService): RestClient {
    return new RestClient(http, clientService);
  }

  public post(url: string, jsonBody: any): RestClient {
    this.type = 'post';
    this.url = url;
    this.jsonBody = jsonBody;
    return this;
  }

  public put(url: string, jsonBody: any): RestClient {
    this.type = 'put';
    this.url = url;
    this.jsonBody = jsonBody;
    return this;
  }

  public get(url: string): RestClient {
    this.type = 'get';
    this.url = url;
    return this;
  }

  public delete(url: string, options?: ClientOptions): RestClient {
    this.type = 'delete';
    this.url = url;
    return this;
  }

  public upload(url: string, data: any): RestClient {
    this.type = 'upload';
    this.url = url;
    this.jsonBody = data;
    return this;
  }

  public setOptions(options: ClientOptions): RestClient {
    this.options = options;
    return this;
  }

  public asResponseBlob(): RestClient {
    this.responseType = 'blob';
    return this;
  }

  public asPlainText(): RestClient {
    this.contentType = 'text/plain';
    return this;
  }

  public asFormWWW(appName: string, password: string): RestClient {
    this.contentType = 'application/x-www-form-urlencoded';
    this.token = 'Basic ' + btoa(`${appName}:${password}`);
    return this;
  }

  public withToken(): RestClient {
    this.token = `Bearer ${this.clientService.getToken().access_token}`;
    return this;
  }

  public execute(): Observable<any> {
    this.createHeaders();
    return this.processPetition(this.type, this.url, this.jsonBody);
  }

  private createHeaders(): void {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': this.contentType,
        Authorization: this.token
      }),
      responseType: this.responseType
    };
  }

  private processPetition(type: string, url: string, body?: any): Observable<any> {
    console.log(`Url[${type}]: ${url}`);
    console.log('HttpOptions: ', this.httpOptions);
    console.log('Body: ', body);
    // console.log('Options: ', options);
    if (this.options) {
      if (this.options.bufferSize > 0) {
        return this.getByCache(type, url, body);
      }
      return this.getPetition(type, url, this.options, body);
    } else {
      this.options = this.getDefaultOptions();
      return this.getPetition(type, url, this.options, body);
    }
  }

  private getByCache(type: string, url: string, body?: any): Observable<any> {
    if (this.clientService.cache.has(url)) {
      return this.clientService.cache.get(url);
    } else {
      const petition = this.getPetition(type, url, this.options, body);
      this.clientService.cache.set(url, petition);
      return petition;
    }
  }

  private getDefaultOptions(): ClientOptions {
    return {
      bufferSize: 0,
      delay: 2000,
      take: 10
    };
  }

  private getPetition(type: string, url: string, options: ClientOptions, body?: any): Observable<any> {
    switch (type) {
      case 'get':
        return this.http.get(url, this.httpOptions).pipe(
          catchError((error: HttpErrorResponse) => {
            return this.validateErrorHttp(error);
          }),
          retryWhen((errors) => {
            return this.retry(errors, options.delay, options.take);
          }),
          tap((result) => {
            return result;
          }),
          map((data) => {
            return data;
          }),
          shareReplay({bufferSize: options.bufferSize, refCount: true}));

      case 'post':
        return this.http.post(url, body, this.httpOptions).pipe(
          catchError((error: HttpErrorResponse) => {
            return this.validateErrorHttp(error);
          }),
          retryWhen((errors) => {
            return this.retry(errors, options.delay, options.take);
          }),
          map((data) => {
            return data;
          }),
          shareReplay({bufferSize: options.bufferSize, refCount: true}));

      case 'upload':
        return this.http.post(url, body, {
          reportProgress: true,
          observe: 'events',
          headers: new HttpHeaders({
            Authorization: this.token
          })
        }).pipe(map((event: any) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                const progress = Math.round(100 * event.loaded / event.total);
                return new Progress(progress);

              case HttpEventType.Response:
                return event.body;
              default:
                return `Unhandled event: ${event.type}`;
            }
          })
        );

      case 'put':
        return this.http.put(url, body, this.httpOptions).pipe(
          catchError((error: HttpErrorResponse) => {
            return this.validateErrorHttp(error);
          }),
          retryWhen((errors) => {
            return this.retry(errors, options.delay, options.take);
          }),
          map((data) => {
            return data;
          }),
          shareReplay({bufferSize: options.bufferSize, refCount: true}));

      case 'delete':
        return this.http.delete(url, this.httpOptions).pipe(
          catchError((error: HttpErrorResponse) => {
            return this.validateErrorHttp(error);
          }),
          retryWhen((errors) => {
            return this.retry(errors, options.delay, options.take);
          }),
          map((data) => {
            return data;
          }),
          shareReplay({bufferSize: options.bufferSize, refCount: true}));
    }
  }

  private validateErrorHttp(error: HttpErrorResponse): Observable<any> {
    console.log('Handling error locally and rethrowing it...', error);
    if (error.status === this.NO_CONNECTION) {
      return throwError(new Response(error.status, error.message));
    } else {
      return new Observable((observer) => {
        observer.next(new Response(error.status, error.message));
      });
    }
  }

  private retry(errors: any, timesDelay?: number, timesTake?: number): Observable<any> {
    const tTake = timesTake ? timesTake : 10;
    return errors.pipe(
      delay(timesDelay ? timesDelay : 2000),
      take(tTake + 1),
      tap(() => console.log('retrying...')),
      concatMap((error, i) => {
        const count = i + 1;
        if (count === tTake) {
          console.log('Limited reached');
          return throwError(new Response(500, 'Unable to connect to server'));
        }
        return new Observable((observer) => {
          observer.next(error);
        });
      }),
    );
  }
}
