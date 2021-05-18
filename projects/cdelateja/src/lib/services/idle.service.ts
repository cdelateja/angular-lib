import {Observable, Subscription, Subject, merge, fromEvent, interval} from 'rxjs';
import {NgZone, Injectable} from '@angular/core';
import {take, switchMap, tap, skipWhile} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdleService {

  // events
  public inactivityEvents: Array<any>[] = [[document, 'click'],
    [document, 'wheel'],
    [document, 'scroll'],
    [document, 'mousemove'],
    [document, 'keyup'],
    [window, 'resize'],
    [window, 'scroll'],
    [window, 'mousemove']
  ];

  private inactivityTime = 20;
  private timeLapsedSinceInactivity = 0;
  private subscription: Subscription;
  private observable: Observable<any>;
  private mergedObservable$: Observable<any>;
  private observableOnIdleEnd = new Subject<any>();

  /**
   * Constructor
   */
  constructor(private ngZone: NgZone) {

  }

  /**
   * Init de idle timeout
   * @param seconds time
   */
  public initIdleTimeout(seconds?: number): void {
    if (seconds !== null) {
      this.inactivityTime = seconds;
    }
    const observableArray$: Observable<any>[] = [];
    this.inactivityEvents.forEach((x) => {
      observableArray$.push(fromEvent(x[0], x[1]));
    });
    this.mergedObservable$ = merge(...observableArray$);
  }

  /**
   * Start the observable for idle
   */
  public startIdleTimeout(): void {
    this.createObservable();
  }

  /**
   * Unsubscribe the observable
   */
  public stopIdleTimeout(): void {
    if (this.subscription && !this.subscription.closed) {
      this.unsubscribeObservable();
    }
  }

  /**
   * Get the observable when end the Idle time out
   */
  public getObservableOnEndedIdle(): Observable<any> {
    return this.observableOnIdleEnd.asObservable();
  }

  /**
   *
   */
  private isItTimeToShowPopUp(val: number): void {
    const timeLeftForInactive = this.inactivityTime - val;
  }

  /**
   *
   */
  private createObservable(): void {
    this.ngZone.runOutsideAngular(() => {

      this.observable = this.mergedObservable$
        .pipe(
          switchMap((ev) => interval(1000).pipe(take(this.inactivityTime))),
          tap((value: any) => this.isItTimeToShowPopUp(value)),
          skipWhile((x: number) => {
            this.timeLapsedSinceInactivity = x;
            return x !== this.inactivityTime - 1;
          })
        );

      this.subscribeObservable();
    });

  }

  /**
   *
   */
  private subscribeObservable(): void {
    this.subscription = this.observable.subscribe((x) => {
      this.observableOnIdleEnd.next();
      this.unsubscribeObservable();
    });
  }

  /**
   *
   */
  private unsubscribeObservable(): void {
    this.subscription.unsubscribe();
  }

}
