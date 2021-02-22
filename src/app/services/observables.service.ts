import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {PageResponse} from "../dtos/class.definition";

@Injectable({
  providedIn: 'root'
})
export class ObservablesService {

  private openModalObs = new Subject<any>();

  constructor() {
  }

  public obsNewPage(): Observable<PageResponse> {
    return this.openModalObs.asObservable();
  }

  public openModalNewPage(newPage: any) {
    this.openModalObs.next(newPage);
  }


}
