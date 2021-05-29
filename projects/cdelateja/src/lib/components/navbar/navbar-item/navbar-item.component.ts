import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ct-navbar-item',
  templateUrl: './navbar-item.component.html',
  styleUrls: ['./navbar-item.component.css']
})
export class NavbarItemComponent implements OnInit {

  @Input()
  public label: string;

  @Input()
  public routerLink: any;

  @Input()
  public icon: any;

  public toggle = false;

  constructor() {
  }

  public ngOnInit(): void {
  }

}
