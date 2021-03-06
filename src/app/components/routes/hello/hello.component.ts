import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ClientService, LoginService, OauthService} from 'cdelateja';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit {

  constructor(private router: Router,
              private clien: ClientService,
              private loginService: LoginService,
              private oauthService: OauthService) {
  }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.loginService.logout();
  }


}
