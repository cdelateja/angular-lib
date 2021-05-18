import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationPop {
  private notClass = 'alert alert-dismissible';

  public showSuccess(body: string, header?: string): void {
    this.createNotification(body, this.notClass + ' alert-success', header);
  }

  public showError(body: string, header?: string): void {
    this.createNotification(body, this.notClass + ' alert-danger', header);
  }

  private createNotification(strBody: string, type: string, strHeader?: string): void {
    const notification = document.createElement('div');
    notification.className = 'notification-dimmer';

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';

    const message = document.createElement('div');
    message.className = 'popup-message';

    const alert = document.createElement('div');
    alert.className = type;

    if (strHeader !== undefined) {
      const header = document.createElement('h4');
      header.className = 'alert-heading';
      header.innerHTML = strHeader;
      alert.appendChild(header);
    }

    const body = document.createElement('p');
    body.innerHTML = strBody;

    const close = document.createElement('button');
    close.className = 'close';
    close.innerHTML = '<span>&times;</span>';

    alert.appendChild(body);
    alert.appendChild(close);

    message.appendChild(alert);
    notification.appendChild(message);
    notification.appendChild(backdrop);

    document.body.appendChild(notification);
    document.body.className = 'modal-open';
    setTimeout(
      function() {
        message.setAttribute('style', 'transform: translate(-50%, 0%);');
      }, 200);
    message.addEventListener('click', function() {
      message.setAttribute('style', 'transform: translate(-50%, -117%);');
      setTimeout(
        function() {
          document.body.removeChild(notification);
          document.body.className = '';
        }, 500);
    });
  }

}
