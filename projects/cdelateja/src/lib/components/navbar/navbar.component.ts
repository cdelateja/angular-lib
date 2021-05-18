import {Component, ContentChildren, HostListener, OnInit, QueryList} from '@angular/core';
import {Router} from '@angular/router';
import {NavbarBrandComponent} from './navbar-brand/navbar-brand.component';
import {NavbarDropdownComponent} from './navbar-dropdown/navbar-dropdown.component';
import {NavbarItemComponent} from './navbar-item/navbar-item.component';
import {LoginService} from '../../services/login.service';
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import {faBars} from '@fortawesome/free-solid-svg-icons/faBars';

@Component({
  selector: 'ct-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @ContentChildren(NavbarBrandComponent)
  private brandComponents: QueryList<NavbarBrandComponent>;

  @ContentChildren(NavbarDropdownComponent)
  private dropdownComponents: QueryList<NavbarDropdownComponent>;

  @ContentChildren(NavbarItemComponent)
  private itemComponents: QueryList<NavbarItemComponent>;

  public show = false;
  public toggle = false;
  public toggleClick = false;
  public faEllipsisV = faEllipsisV;
  public faArrowRight = faArrowRight;
  public faArrowLeft = faArrowLeft;
  public faBars = faBars;

  constructor(private router: Router, private loginService: LoginService) {
  }

  public ngOnInit(): void {
  }

  public logout(): void {
    this.loginService.logout();
  }

  public showMenu(): void {
    this.show = true;
  }

  public hideMenu(): void {
    this.show = false;
  }

  public toggleCollapse(): void {
    this.toggle = true;
    this.toggleClick = true;
    this.toggleComponents();
  }

  public toggleExpand(): void {
    this.toggle = false;
    this.toggleClick = false;
    this.toggleComponents();
  }

  public toggleComponents(): void {
    this.brandComponents.toArray().forEach((component: NavbarBrandComponent) => {
      component.toggle = this.toggle;
    });
    this.dropdownComponents.toArray().forEach((component: NavbarDropdownComponent) => {
      component.toggle = this.toggle;
    });
    this.itemComponents.toArray().forEach((component: NavbarItemComponent) => {
      component.toggle = this.toggle;
    });
  }

  public onMouseOver(): void {
    if (this.toggleClick) {
      this.toggle = false;
      this.toggleComponents();
    }
  }

  public onMouseOut(): void {
    if (this.toggleClick) {
      this.toggle = true;
      this.toggleComponents();
    }
  }

}
