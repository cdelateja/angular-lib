import {Component, OnInit} from '@angular/core';
import {ClientService} from 'cdelateja';
import {Router} from '@angular/router';

@Component({
  selector: 'app-petitions',
  templateUrl: './petitions.component.html',
  styleUrls: ['./petitions.component.scss']
})
export class PetitionsComponent implements OnInit {

  public responseGet: any = {};
  public cacheGet: any = {};
  public cacheSecondGet: any = {};
  public errorRetry: any = {};
  public errorGet: any = {};

  constructor(private client: ClientService,
              private router: Router) {
  }

  public ngOnInit(): void {
  }

  public toOtherPage(): void {
    this.router.navigate(['/hello']);
  }
}
