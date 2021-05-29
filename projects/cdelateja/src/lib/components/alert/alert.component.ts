import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ct-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {

  @Input()
  public type: string = new AlertType().DEFAULT;

  constructor() {
  }

  public ngOnInit(): void {
  }

}

export class AlertType {
  public DEFAULT = 'alert-secondary';
  public PRIMARY = 'alert-primary';
  public SUCCESS = 'alert-success';
  public DANGER = 'alert-danger';
  public WARNING = 'alert-warning';
  public INFO = 'alert-info';
  public LIGHT = 'alert-light';
  public DARK = 'alert-dark';
}
