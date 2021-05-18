import {Component} from '@angular/core';
import {OauthService, ConfigService} from 'cdelateja';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private oauthService: OauthService, private configService: ConfigService,
              private translate: TranslateService) {
    this.translate.setDefaultLang('es');
  }
}
