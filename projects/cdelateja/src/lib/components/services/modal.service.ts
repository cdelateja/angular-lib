import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private close = new Subject();

  constructor() {
  }

  callClose() {
    this.close.next();
  }

  getCloseCall(): Observable<any> {
    return this.close.asObservable();
  }
}
