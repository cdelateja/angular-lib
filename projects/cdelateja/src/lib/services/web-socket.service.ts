import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Observable, Subject} from 'rxjs';
import {IdRequest} from '../dtos/definition-class';
import {OauthService} from './oauth.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private webSocketEndPoint;
  private readonly URL;
  private topic = '/user/queue/notify';
  private stompClient: any;
  private notificationPanel = new Subject<string>();

  constructor(private configService: ConfigService, private oauthService: OauthService) {
    this.URL = this.configService.get('lsServers.zuul.lswsnotifications');
    this.webSocketEndPoint = this.configService.get('lsServers.zuul.webSocketNotification') + '?user=';
  }

  connect() {
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

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  // on error, schedule a reconnection attempt
  private errorCallBack(error) {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  private onMessageReceived(message) {
    this.notificationPanel.next(message.body);
  }

  public notificationObs(): Observable<string> {
    return this.notificationPanel.asObservable();
  }

  public getNotificationsByUser(request: IdRequest): Observable<any> {
    return this.oauthService.withToken().post(this.URL + '/obtenerNoLeidos', request);
  }

  public markAsRead(request: IdRequest): Observable<any> {
    return this.oauthService.withToken().post(this.URL + '/marcarLeido', request);
  }
}
