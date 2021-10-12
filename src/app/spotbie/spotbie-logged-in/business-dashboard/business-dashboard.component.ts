import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoyaltyPointsComponent } from '../loyalty-points/loyalty-points.component';
import { QrComponent } from '../qr/qr.component';
import { RewardMenuComponent } from '../reward-menu/reward-menu.component';

@Component({
  selector: 'app-business-dashboard',
  templateUrl: './business-dashboard.component.html',
  styleUrls: ['./business-dashboard.component.css']
})
export class BusinessDashboardComponent implements OnInit {

  @ViewChild('loyaltyPointsApp') loyaltyPointsApp: LoyaltyPointsComponent
  @ViewChild('rewardMenuApp') rewardMenuApp: RewardMenuComponent
  @ViewChild('qrApp') qrApp: QrComponent

  @ViewChild('lpAppAnchor') lpAppAnchor: ElementRef
  @ViewChild('qrCodeAppAnchor') qrCodeAppAnchor: ElementRef
  @ViewChild('rewardMenuAppAnchor') rewardMenuAppAnchor: ElementRef

  constructor() { }

  public openLoyaltyPoints(){
    console.log("BusinessDashboardComponent loyaltyPointsApp") 
    this.loyaltyPointsApp.initBusinessLoyaltyPoints()
  }

  public scrollToLpAppAnchor(){

    this.lpAppAnchor.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

  }
  public scrollToQrAppAnchor(){

    this.qrCodeAppAnchor.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

  }
  
  public scrollToRewardMenuAppAnchor(){

    this.rewardMenuAppAnchor.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

  }

  public closeAll(){

    //Close all the windows in the dashboard
    this.loyaltyPointsApp.closeThis()
    this.rewardMenuApp.closeWindow()
    this.qrApp.closeQr()

  }

  ngOnInit(): void {}

}
