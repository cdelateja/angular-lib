import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialog {

  private confirm = new Subject<string>();
  private renderer: Renderer2;

  private bodyModal = '<div class="modal-dialog dialog-confirmation">\n' +
    '  <div class="modal-content">\n' +
    '    <div class="modal-confirm">\n' +
    '      <h4></h4>\n' +
    '    </div>\n' +
    '    <div class="modal-body">\n' +
    '    </div>\n' +
    '    <div class="modal-footer">\n' +
    '      <button type="button" class="btn btn-danger btn-block">Close</button>\n' +
    '      <button type="button" class="btn btn-primary btn-block">Confirm</button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>';

  constructor(rendererFactory: RendererFactory2, private translate: TranslateService) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public getYesConfirmation(): Observable<string> {
    return this.confirm.asObservable();
  }

  public createConfirmation(strHeader: string, strBody: string) {
    const container = document.createElement('div');

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    backdrop.style.display = 'block';

    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.innerHTML = this.bodyModal;
    modal.style.display = 'block';

    const title = modal.querySelector('h4');
    title.textContent = strHeader;

    const modalBody = modal.querySelector('.modal-body');
    modalBody.textContent = strBody;

    const buttonCancel = modal.querySelector('.btn-danger');
    buttonCancel.textContent = this.translate.instant('Core.btnCancel');

    const buttonOk = modal.querySelector('.btn-primary');
    buttonOk.textContent = this.translate.instant('Core.btnAccept');

    const message = document.createElement('div');
    message.className = 'popup-message';

    container.appendChild(modal);
    container.appendChild(backdrop);

    document.body.appendChild(container);
    document.body.className = 'modal-open';

    this.renderer.listen(buttonCancel, 'click', (event) => {
      document.body.removeChild(container);
      document.body.className = '';
    });
    this.renderer.listen(buttonOk, 'click', (event) => {
      this.confirm.next('');
      document.body.removeChild(container);
      document.body.className = '';
    });
  }
}
