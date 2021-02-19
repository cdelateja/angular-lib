import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ct-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {

  @Input()
  public type: string = new AlertType().DEAFULT;

  @Input()
  public label: string;

  constructor() {
  }

  ngOnInit() {
  }

}

export class AlertType {
  public DEAFULT = 'alert-secondary';
  public PRIMARY = 'alert-primary';
  public SUCCESS = 'alert-success';
  public DANGER = 'alert-danger';
  public WARNING = 'alert-warning';
  public INFO = 'alert-info';
  public LIGHT = 'alert-light';
  public DARK = 'alert-dark';
}
