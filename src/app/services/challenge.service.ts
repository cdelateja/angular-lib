import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ClientService, ConfigService} from "cdelateja";
import {PageRequest} from "../dtos/class.definition";

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  private readonly URL = 'http://localhost:9000';

  constructor(private clientService: ClientService, private configService: ConfigService) {
    this.URL = this.configService.get('ctServers.challenge');
  }

  public getPages(): Observable<any> {
    return this.clientService.get(`${this.URL}` + this.configService.get('ctServers.getPages'));
  }

  public getPage(id: number): Observable<any> {
    return this.clientService.get(`${this.URL}` + `${this.configService.get('ctServers.getPage')}${id}`);
  }

  public getTemplates(): Observable<any> {
    return this.clientService.get(`${this.URL}` + this.configService.get('ctServers.getTemplates'));
  }

  public savePage(pageRequest: PageRequest): Observable<any> {
    return this.clientService.post(`${this.URL}` + this.configService.get('ctServers.savePages'),
      pageRequest);
  }

}
