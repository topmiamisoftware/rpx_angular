import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoyaltyPointsComponent } from '../loyalty-points/loyalty-points.component';
import { QrComponent } from '../qr/qr.component';
import { RedeemableComponent } from '../redeemable/redeemable.component';
import { RewardMenuComponent } from '../reward-menu/reward-menu.component';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  @Output('spawnCategoriesEvt') spawnCategoriesEvt = new EventEmitter  

  @ViewChild('loyaltyPointsApp') loyaltyPointsApp: LoyaltyPointsComponent
  @ViewChild('rewardMenuApp') rewardMenuApp: RewardMenuComponent
  @ViewChild('qrApp') qrApp: QrComponent
  @ViewChild('redeemablesApp') redeemablesApp: RedeemableComponent

  @ViewChild('lpAppAnchor') lpAppAnchor: ElementRef
  @ViewChild('rewardMenuAppAnchor') rewardMenuAppAnchor: ElementRef
  @ViewChild('qrCodeAppAnchor') qrCodeAppAnchor: ElementRef

  public scannerStarted: boolean = false

  public isMobile: boolean = false

  public getRedeemableItems: boolean =  false

  constructor(private deviceDetectorService: DeviceDetectorService) { }

  public redeemedLp(){
    this.getRedeemableItems = true
    this.redeemablesApp.getRedeemed()
  }

  public openLoyaltyPoints(){
    this.loyaltyPointsApp.initBusinessLoyaltyPoints()
  }

  public scrollToLpAppAnchor(){

    this.lpAppAnchor.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

  }
  public scrollToQrAppAnchor(){

    this.qrCodeAppAnchor.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    this.startQrScanner()
  
  }
  
  public scrollToRewardMenuAppAnchor(){

    this.rewardMenuAppAnchor.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

  }

  public startQrScanner(){
    this.scannerStarted = true 
  }

  public closeQrScanner(){
    this.scannerStarted = false 
  }
  
  public spawnCategories(category: string){

    let obj = {
      category: category
    }

    this.spawnCategoriesEvt.emit(obj)

  }

  public closeAll(){

    //Close all the windows in the dashboard
    this.loyaltyPointsApp.closeThis()
    this.rewardMenuApp.closeWindow()
    this.qrApp.closeQr()

  }

  ngOnInit(): void {

    this.isMobile = this.deviceDetectorService.isMobile()

  }

}
