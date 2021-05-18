import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ct-navbar-brand',
  templateUrl: './navbar-brand.component.html',
  styleUrls: ['./navbar-brand.component.css']
})
export class NavbarBrandComponent implements OnInit {

  @Input()
  public srcImg: string;

  @Input()
  public label: string;

  public toggle = false;

  constructor() {
  }

  public ngOnInit(): void {
  }

}
