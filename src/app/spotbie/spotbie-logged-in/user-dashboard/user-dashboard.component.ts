import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {LoyaltyPointsComponent} from '../loyalty-points/loyalty-points.component';
import {QrComponent} from '../qr/qr.component';
import {RedeemableComponent} from '../redeemable/redeemable.component';
import {RewardMenuComponent} from '../reward-menu/reward-menu.component';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  @Output() spawnCategoriesEvt = new EventEmitter();

  @ViewChild('loyaltyPointsApp') loyaltyPointsApp: LoyaltyPointsComponent;
  @ViewChild('rewardMenuApp') rewardMenuApp: RewardMenuComponent;
  @ViewChild('qrApp') qrApp: QrComponent;
  @ViewChild('redeemablesApp') redeemablesApp: RedeemableComponent;
  @ViewChild('lpAppAnchor') lpAppAnchor: ElementRef;
  @ViewChild('rewardMenuAppAnchor') rewardMenuAppAnchor: ElementRef;
  @ViewChild('qrCodeAppAnchor') qrCodeAppAnchor: ElementRef;

  scannerStarted = false;
  isMobile = false;
  getRedeemableItems = false;

  constructor(private deviceDetectorService: DeviceDetectorService) {}

  redeemedLp() {
    this.getRedeemableItems = true;
  }

  openLoyaltyPoints() {
    this.loyaltyPointsApp.initBusinessLoyaltyPoints();
  }

  scrollToLpAppAnchor() {
    this.lpAppAnchor.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    this.redeemedLp();
  }

  scrollToQrAppAnchor() {
    if (typeof this.qrCodeAppAnchor !== undefined)
      this.qrCodeAppAnchor.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    this.startQrScanner();
  }

  scrollToRewardMenuAppAnchor() {
    this.rewardMenuAppAnchor.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  startQrScanner() {
    this.scannerStarted = true;
  }

  closeQrScanner() {
    this.scannerStarted = false;
  }

  closeRedeemables() {
    this.getRedeemableItems = false;
  }

  spawnCategories(category: number) {
    const obj = {
      category,
    };

    this.spawnCategoriesEvt.emit(obj);
  }

  closeAll() {
    // Close all the windows in the dashboard
    this.loyaltyPointsApp.closeThis();
    this.rewardMenuApp.closeWindow();
    this.qrApp.closeQr();
  }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
  }
}
