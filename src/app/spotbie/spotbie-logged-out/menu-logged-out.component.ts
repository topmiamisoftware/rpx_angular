import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import {Location} from '@angular/common';

import {externalBrowserOpen} from '../../helpers/cordova/web-intent';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Router} from '@angular/router';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-menu-logged-out',
  templateUrl: './menu-logged-out.component.html',
  styleUrls: ['../menu.component.css'],
})
export class MenuLoggedOutComponent implements OnInit {
  @Output() myFavoritesEvt = new EventEmitter();
  @Output() spawnCategoriesOut = new EventEmitter();
  @Output() openHome = new EventEmitter();

  @ViewChild('spotbieMainMenu') spotbieMainMenu: ElementRef;

  logInWindow = {open: false};
  signUpWindow = {open: false};
  menuActive = false;
  isMobile: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  business = false;

  constructor(
    private location: Location,
    private deviceService: DeviceDetectorService,
    private router: Router
  ) {}

  spawnCategories(type: number, slideMenu = true): void {
    if (slideMenu) {
      this.slideMenu();
    }

    this.spawnCategoriesOut.emit(type);
  }

  goToBlog() {
    externalBrowserOpen('https://spotbie.com/business');
  }

  openWindow(window: any) {
    window.open = !window.open;
  }

  closeWindow(window) {
    window.open = false;
  }

  signUp() {
    this.logInWindow.open = false;
    this.signUpWindow.open = !this.signUpWindow.open;
  }

  logIn() {
    if (this.business) {
      window.location.assign(environment.businessClientApp);
    } else {
      window.location.assign(environment.personalClientApp);
    }
  }

  slideMenu() {
    if (this.logInWindow.open) this.logInWindow.open = false;
    else if (this.signUpWindow.open) this.signUpWindow.open = false;
    else this.menuActive = !this.menuActive;
  }

  getMenuStyle() {
    if (!this.menuActive) return {'background-color': 'transparent'};
  }

  scrollTo(el: string) {
    const element = document.getElementById(el);
    element.scrollIntoView();
  }

  myFavorites() {
    this.menuActive = false;
    this.myFavoritesEvt.emit();
  }

  goToBusiness() {
    this.router.navigate(['/business']);
  }

  goToAppUser() {
    this.router.navigate(['/home']);
  }

  home() {
    this.menuActive = false;

    this.signUpWindow.open = false;
    this.logInWindow.open = false;
    this.openHome.emit();
  }

  ngOnInit(): void {
    const activatedRoute = this.location.path();

    this.isMobile = this.deviceService.isMobile();
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();

    // check if we need to auto log-in
    const cookiedRememberMe = localStorage.getItem('spotbie_rememberMe');
    const logged_in = localStorage.getItem('spotbie_rememberMe');

    if (activatedRoute.indexOf('/business') > -1) this.business = true;

    if (
      cookiedRememberMe === '1' &&
      activatedRoute.indexOf('/home') > -1 &&
      logged_in !== '1'
    ) {
      this.logInWindow.open = true;
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      this.spotbieMainMenu.nativeElement.style.display = 'table';
    }, 750);
  }
}
