import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ct-navbar-dropdown',
  templateUrl: './navbar-dropdown.component.html',
  styleUrls: ['./navbar-dropdown.component.css']
})
export class NavbarDropdownComponent implements OnInit {

  @Input()
  public label: string;

  @Input()
  public icon: any;

  public toggle = false;
  public id: string;

  constructor() {
    this.id = this.getUuId();
  }

  public ngOnInit(): void {
  }

  private getUuId(): string {
    return 'c' + Math.round(Math.random() * 1000000);
  }

}
