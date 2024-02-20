import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import {MapComponent} from '../map/map.component';
import {DeviceDetectorService} from 'ngx-device-detector';
import {SettingsComponent} from './settings/settings.component';
import {AllowedAccountTypes} from '../../helpers/enum/account-type.enum';
import {UserauthService} from '../../services/userauth.service';
import {logOutCallback} from '../../helpers/logout-callback';
import {LoyaltyPointsState} from './state/lp.state';
import {BehaviorSubject, Observable} from 'rxjs';
import {BusinessLoyaltyPointsState} from "./state/business.lp.state";

@Component({
  selector: 'app-menu-logged-in',
  templateUrl: './menu-logged-in.component.html',
  styleUrls: ['../menu.component.css', './menu-logged-in.component.css'],
})
export class MenuLoggedInComponent implements OnInit {
  @Output() userBackgroundEvent = new EventEmitter();

  @ViewChild('spotbieMainMenu') spotbieMainMenu: ElementRef;
  @ViewChild('spotbieMap') spotbieMap: MapComponent;
  @ViewChild('spotbieSettings') spotbieSettings: SettingsComponent;

  eAllowedAccountTypes = AllowedAccountTypes;
  foodWindow = {open: false};
  mapApp$ = new BehaviorSubject<boolean>(false);
  settingsWindow = {open: false};
  menuActive = false;
  spotType: string;
  isMobile: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  userType: number;
  userLoyaltyPoints$: Observable<number>;
  userName: string = null;
  qrCode = false;
  business = false;
  getRedeemableItems = false;
  eventMenuOpen = false;

  constructor(
    private userAuthService: UserauthService,
    private deviceService: DeviceDetectorService,
    private loyaltyPointState: LoyaltyPointsState,
    private businessLoyaltyPointsState: BusinessLoyaltyPointsState
  ) {}

  myFavorites() {
    this.menuActive = false;
    this.spotbieMap.myFavorites();
  }

  toggleLoyaltyPoints() {
    this.spotbieMap.goToLp();
  }

  toggleQRScanner() {
    this.spotbieMap.goToQrCode();
  }

  toggleRewardMenu(ac: string) {
    this.spotbieMap.goToRewardMenu();
  }

  spawnCategories(category: number): void {
    if (!this.isDesktop) {
      this.slideMenu();
    }

    this.spotbieMap.spawnCategories(category);
  }

  home() {
    this.settingsWindow.open = false;
    this.foodWindow.open = false;
    this.getRedeemableItems = false;
    this.eventMenuOpen = false;

    if (this.userType === AllowedAccountTypes.Personal) {
      this.spotbieMap.openWelcome();
      this.spotbieMap.closeCategories();
    }
  }

  openBusinessSettings() {
    this.settingsWindow.open = true;

    setTimeout(() => {
      this.spotbieSettings.changeAccType();
    }, 500);
  }

  slideMenu() {
    if (this.settingsWindow.open) this.settingsWindow.open = false;
    else this.menuActive = !this.menuActive;
  }

  getMenuStyle() {
    if (this.menuActive === false) {
      return {'background-color': 'transparent'};
    }
  }

  openWindow(window: any): void {
    window.open = true;
  }

  closeWindow(window: any): void {
    window.open = false;
  }

  logOut(): void {
    this.userAuthService.logOut().subscribe(resp => {
      logOutCallback(resp);
    });
  }

  usersAroundYou() {
    this.spotbieMap.mobileStartLocation();
  }

  getLoyaltyPointBalance() {
    this.loyaltyPointState.getLoyaltyPointBalance().subscribe((r) => {
      this.userLoyaltyPoints$ = this.loyaltyPointState.balance$;
    });
  }

  getBusinessLoyaltyPointBalance() {
    this.businessLoyaltyPointsState.getBusinessLoyaltyPointBalance().subscribe();
  }

  getPointsWrapperStyle() {
    if (this.isMobile) return {'width:': '85%', 'text-align': 'right'};
    else return {width: '45%'};
  }

  openEvents() {
    this.eventMenuOpen = true;
  }

  closeEvents() {
    this.eventMenuOpen = false;
  }

  ngOnInit(): void {
    this.isMobile = this.deviceService.isMobile();
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();

    this.userType = parseInt(localStorage.getItem('spotbie_userType'), 10);

    if (this.userType === AllowedAccountTypes.Personal) {
      this.business = false;
      this.getLoyaltyPointBalance();
    } else {
      this.business = true;
      this.getBusinessLoyaltyPointBalance();
    }

    this.userName = localStorage.getItem('spotbie_userLogin');
  }

  toggleRedeemables() {
    this.getRedeemableItems = !this.getRedeemableItems;
  }

  closeRedeemables() {
    this.getRedeemableItems = false;
  }

  ngAfterViewInit() {
    this.mapApp$.next(true);
  }
}
