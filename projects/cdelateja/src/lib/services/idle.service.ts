import { Observable, Subscription, Subject, merge, fromEvent, interval } from 'rxjs';
import { NgZone, Injectable } from '@angular/core';
import { take, switchMap, tap, skipWhile } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class IdleService {

    //events
    public inactivityEvents: Array<any>[] = [[document, 'click'],
    [document, 'wheel'],
    [document, 'scroll'],
    [document, 'mousemove'],
    [document, 'keyup'],
    [window, 'resize'],
    [window, 'scroll'],
    [window, 'mousemove']
    ];

    inactivityTime = 20;
    private timeLapsedSinceInactivity = 0;
    private subscription: Subscription;
    private observeable$: Observable<any>;
    private mergedObservable$: Observable<any>;
    private observableOnIdleEnd = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _ngZone: NgZone) {

    }

    /**
     * Init de idle timeout
     * @param seconds time
     */
    public initIdleTimeout(seconds?: number) {
        if (seconds !== null) {
            this.inactivityTime = seconds;
        }
        let observableArray$: Observable<any>[] = [];
        this.inactivityEvents.forEach(x => {
            observableArray$.push(fromEvent(x[0], x[1]))
        })
        this.mergedObservable$ = merge(...observableArray$);
    }

    /**
     * Start the observable for idle
     */
    public startIdelTimeout() {
        this.createObserable();
        //console.log('subscription started');
    }

    /**
     * Unsubscribe the observable
     */
    public stopIdleTimeout() {
        if (this.subscription && !this.subscription.closed) {
            this.unsubscribeObservable();
        }
    }

    /**
     * Get the observable when end the Idle time out
     */
    public getObservableOnEndedIdle() {
        return this.observableOnIdleEnd.asObservable();
    }

    /**
     * 
     * @param val 
     */
    private isItTimeToShowPopUp(val: number) {
        let timeLeftForInactive = this.inactivityTime - val;
        //console.log(timeLeftForInactive);
    }

    /**
     * 
     */
    private createObserable(): void {
        this._ngZone.runOutsideAngular(() => {

            this.observeable$ = this.mergedObservable$
                .pipe(
                    switchMap(ev => interval(1000).pipe(take(this.inactivityTime))),
                    tap(value => this.isItTimeToShowPopUp(value)),
                    skipWhile((x) => {
                        this.timeLapsedSinceInactivity = x;
                        return x != this.inactivityTime - 1;
                    })
                );

            this.subscribeObservable();
        });

    }

    /**
     * 
     */
    private subscribeObservable() {
        this.subscription = this.observeable$.subscribe((x) => {
            //console.log(`subscribed for ${x + 1} sec`);
            this.observableOnIdleEnd.next();
            this.unsubscribeObservable();
        });
    }

    /**
     * 
     */
    private unsubscribeObservable() {
        //console.log('  unsubscriebd');
        this.subscription.unsubscribe();
    }

}