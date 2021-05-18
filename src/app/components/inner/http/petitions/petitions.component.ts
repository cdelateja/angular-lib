import {Component, OnInit} from '@angular/core';
import {ClientService} from "cdelateja";
import {Router} from "@angular/router";

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

  ngOnInit() {
    this.client.get('http://5.189.172.240:8888/participanteui/default', {bufferSize: 1}).subscribe(result => {
      this.responseGet = result;
    });
    this.client.get('http://5.189.172.240:8888/participanteui/default', {bufferSize: 1}).subscribe(result => {
      this.cacheGet = result;
    });
    this.client.get('http://5.189.172.5:8888/participanteui/devCloud', {bufferSize: 1, take: 1}).subscribe(result => {
    }, error => {
      this.errorRetry = error;
    });
    this.client.post('http://5.189.172.240:8888/participanteui/devCloud', {bufferSize: 1, take: 1}).subscribe(result => {
      this.errorGet = result;
    });

  }

  toOtherPage() {
    this.router.navigate(['/hello']);
  }
}
