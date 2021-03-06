import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Observable, Subject} from 'rxjs';
import {IdRequest} from '../dtos/definition-class';
import {OauthService} from './oauth.service';
import {ClientService} from "./client.service";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private webSocketEndPoint;
  private readonly URL;
  private topic = '/user/queue/notify';
  private stompClient: any;
  private notificationPanel = new Subject<string>();

  constructor(private configService: ConfigService,
              private clientService: ClientService,
              private oauthService: OauthService) {
    this.URL = this.configService.get('lsServers.zuul.lswsnotifications');
    this.webSocketEndPoint = this.configService.get('lsServers.zuul.webSocketNotification') + '?user=';
  }

  public connect(): void {
    if (this.oauthService.getUser() !== null) {
      this.webSocketEndPoint = this.webSocketEndPoint + this.oauthService.getUser().userName;
      console.log('Initialize WebSocket Connection');
      const ws = new SockJS(this.webSocketEndPoint);
      this.stompClient = Stomp.over(ws);
      const socketAPI = this;
      this.stompClient.connect({}, frame => {
        socketAPI.stompClient.subscribe(socketAPI.topic, sdkEvent => {
          socketAPI.onMessageReceived(sdkEvent);
        });
      }, this.errorCallBack);
    }
  }

  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  // on error, schedule a reconnection attempt
  private errorCallBack(error): void {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  private onMessageReceived(message): void {
    this.notificationPanel.next(message.body);
  }

  public notificationObs(): Observable<string> {
    return this.notificationPanel.asObservable();
  }

  public getNotificationsByUser(request: IdRequest): Observable<any> {
    return this.clientService
      .create()
      .withToken()
      .post(this.URL + '/obtenerNoLeidos', request)
      .execute();
  }

  public markAsRead(request: IdRequest): Observable<any> {
    return this.clientService
      .create()
      .withToken()
      .post(this.URL + '/marcarLeido', request)
      .execute();
  }
}
