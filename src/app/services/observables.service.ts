import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {PageResponse} from "../dtos/class.definition";

@Injectable({
  providedIn: 'root'
})
export class ObservablesService {

  private openModalObs = new Subject<any>();
  private openModalViewObs = new Subject<number>();
  private refreshObs = new Subject<any>();

  constructor() {
  }

  public obsNewPage(): Observable<PageResponse> {
    return this.openModalObs.asObservable();
  }

  public openModalNewPage(newPage: any) {
    this.openModalObs.next(newPage);
  }

  public obsModalViewPage(): Observable<number> {
    return this.openModalViewObs.asObservable();
  }

  public openModalViewPage(id: number) {
    this.openModalViewObs.next(id);
  }

  public obsRefresh(): Observable<any> {
    return this.refreshObs.asObservable();
  }

  public refreshTable(newPage: any) {
    this.refreshObs.next(newPage);
  }


}
