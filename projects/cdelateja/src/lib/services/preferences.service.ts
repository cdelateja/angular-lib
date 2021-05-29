import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ConfigService} from './config.service';
import {PreferenciaGridRequest} from '../dtos/definition-class';
import {ClientService} from "./client.service";

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  private readonly URL = '';

  constructor(private clientService: ClientService, private configService: ConfigService) {
    this.URL = this.configService.get('lsServers.zuul.iamserverrepo');
  }

  public getPreferences(user: string, gridName: string): Observable<any> {
    return this.clientService
      .create()
      .withToken()
      .get(`${this.URL}/preferencia/grid/by/nombre?usuario=${user}&gridName=${gridName}`)
      .execute();
  }

  public save(request: PreferenciaGridRequest): Observable<any> {
    return this.clientService
      .create()
      .withToken()
      .post(`${this.URL}/preferencia/grid/add`, request)
      .execute();
  }

  public delete(request: PreferenciaGridRequest): Observable<any> {
    return this.clientService
      .create()
      .withToken()
      .post(`${this.URL}/preferencia/delete/by/nombre`, request)
      .execute();
  }
}
