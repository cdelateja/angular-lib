import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {OauthService} from './oauth.service';
import {ConfigService} from './config.service';
import {PreferenciaGridRequest} from '../dtos/definition-class';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  private readonly URL = '';

  constructor(private oauthService: OauthService, private configService: ConfigService) {
    this.URL = this.configService.get('lsServers.zuul.iamserverrepo');
  }

  public getPreferences(user: string, gridName: string): Observable<any> {
    return this.oauthService.withToken().get(`${this.URL}/preferencia/grid/by/nombre?usuario=${user}&gridName=${gridName}`);
  }

  public save(request: PreferenciaGridRequest): Observable<any> {
    return this.oauthService.withToken().post(`${this.URL}/preferencia/grid/add`, request);
  }

  public delete(request: PreferenciaGridRequest): Observable<any> {
    return this.oauthService.withToken().post(`${this.URL}/preferencia/delete/by/nombre`, request);
  }
}
