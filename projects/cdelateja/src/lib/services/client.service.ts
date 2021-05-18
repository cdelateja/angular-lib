import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders} from '@angular/common/http';
import {ClientOptions, Progress, Response} from '../dtos/definition-class';
import {catchError, concatMap, delay, map, retryWhen, shareReplay, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private NO_CONNECTION = 0;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private petitionsCache: Map<string, Observable<any>> = new Map<string, Observable<any>>();

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

  /**
   * M&eacute;todo que asigna un httpOptions
   * @param httpOptions
   */
  public setHttOptions(httpOptions: any): void {
    this.httpOptions = httpOptions;
  }

  public getHttOptions(): any {
    return this.httpOptions;
  }

  public post(url: string, jsonBody: any, options?: ClientOptions): Observable<any> {
    return this.processPetition('post', url, jsonBody, options);
  }

  public put(url: string, jsonBody: any, options?: ClientOptions): Observable<any> {
    return this.processPetition('put', url, jsonBody, options);
  }

  public get(url: string, options?: ClientOptions): Observable<any> {
    return this.processPetition('get', url, null, options);
  }

  public delete(url: string, options?: ClientOptions): Observable<any> {
    return this.processPetition('delete', url, null, options);
  }

  public postStream(url: string, jsonBody: any): Observable<any> {
    this.httpOptions['responseType'] = 'blob';
    return this.http.post(url, JSON.stringify(jsonBody), this.httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.validateErrorHttp(error);
      }),
      retryWhen((errors) => {
        return this.retry(errors);
      }),
      map((data) => {
        return data;
      }));
  }

  upload(url: string, data: any): Observable<any> {
    return this.http.post(url, data, {
      reportProgress: true,
      observe: 'events',
      headers: new HttpHeaders({
        Authorization: this.httpOptions.headers.get('Authorization')
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
  }

  private processPetition(type: string, url: string, body?: any, options?: ClientOptions): Observable<any> {
    console.log(`Url[${type}]: ${url}`);
    console.log('HttpOptions: ', this.httpOptions);
    console.log('Body: ', body);
    // console.log('Options: ', options);
    if (options) {
      if (options.bufferSize > 0) {
        if (this.petitionsCache.has(url)) {
          return this.petitionsCache.get(url);
        } else {
          const petition = this.getPetition(type, url, options, body);
          this.petitionsCache.set(url, petition);
          return petition;
        }
      }
      return this.getPetition(type, url, options, body);
    } else {
      const clientOptions: ClientOptions = {
        bufferSize: 0,
        delay: 2000,
        take: 10
      };
      return this.getPetition(type, url, clientOptions, body);
    }
  }

  private getPetition(type: string, url: string, options: ClientOptions, body?: any) {
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
