import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UserauthService } from 'src/app/services/userauth.service';
import { LoyaltyPointsComponent } from '../loyalty-points/loyalty-points.component';
import { QrComponent } from '../qr/qr.component';
import { RedeemableComponent } from '../redeemable/redeemable.component';
import { RewardMenuComponent } from '../reward-menu/reward-menu.component';

@Component({
  selector: 'app-business-dashboard',
  templateUrl: './business-dashboard.component.html',
  styleUrls: ['./business-dashboard.component.css']
})
export class BusinessDashboardComponent implements OnInit {

  @Output('openBusinessSettingsEvt') openBusinessSettingsEvt = new EventEmitter

  @ViewChild('loyaltyPointsApp') loyaltyPointsApp: LoyaltyPointsComponent
  @ViewChild('rewardMenuApp') rewardMenuApp: RewardMenuComponent
  @ViewChild('qrApp') qrApp: QrComponent
  @ViewChild('redeemablesApp') redeemablesApp: RedeemableComponent

  @ViewChild('lpAppAnchor') lpAppAnchor: ElementRef
  @ViewChild('qrCodeAppAnchor') qrCodeAppAnchor: ElementRef
  @ViewChild('rewardMenuAppAnchor') rewardMenuAppAnchor: ElementRef

  public displayBusinessSetUp: boolean = false
  public businessFetched: boolean = false

  public getRedeemableItems: boolean =  false

  constructor(private userAuthServe: UserauthService) { }

  public redeemedLp(){
    this.getRedeemableItems = true
    this.redeemablesApp.getRedeemed()
  }

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

  public checkIfBusinessIsSet(){

    this.userAuthServe.getSettings().subscribe(
      
      resp => {
        
        if(resp.business == null && this) 
          this.displayBusinessSetUp = true 
        else
          this.displayBusinessSetUp = false

        this.businessFetched = true

      } 

    )
    
  }

  public openSettings(){
    this.openBusinessSettingsEvt.emit()
  }

  ngOnInit(): void {
    this.checkIfBusinessIsSet()
  }

}
