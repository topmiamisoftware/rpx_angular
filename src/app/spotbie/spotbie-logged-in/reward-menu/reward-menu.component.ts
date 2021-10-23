import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AllowedAccountTypes } from 'src/app/helpers/enum/account-type.enum'
import { LoyaltyPointBalance } from 'src/app/models/loyalty-point-balance'
import { Business } from 'src/app/models/business'
import { Reward } from 'src/app/models/reward'
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service'
import { BusinessMenuServiceService } from 'src/app/services/spotbie-logged-in/business-menu/business-menu-service.service'
import { RewardCreatorComponent } from './reward-creator/reward-creator.component'

@Component({
  selector: 'app-reward-menu',
  templateUrl: './reward-menu.component.html',
  styleUrls: ['./reward-menu.component.css']
})
export class RewardMenuComponent implements OnInit {

  @ViewChild('rewardCreator') rewardCreator: RewardCreatorComponent

  @Input() fullScreenWindow: boolean = true

  @Input() loyaltyPoints: string

  @Output() closeWindowEvt = new EventEmitter()

  @Output() notEnoughLpEvt = new EventEmitter()

  public eAllowedAccountTypes = AllowedAccountTypes

  public menuItemList: Array<any>

  public itemCreator: boolean = false

  public userLoyaltyPoints
  public userResetBalance
  public userPointToDollarRatio

  public rewards: Array<Reward> = null
  public reward: Reward

  public qrCodeLink: string = null
  public userHash: string = null

  public userType: string = null

  public business: Business = new Business()

  public loyaltyPointsBalance: LoyaltyPointBalance

  constructor(private loyaltyPointsService: LoyaltyPointsService,
              private businessMenuService: BusinessMenuServiceService,
              private router: Router,
              route: ActivatedRoute){

      if(this.router.url.indexOf('business-menu') > -1){               
        this.qrCodeLink = route.snapshot.params.qrCode
        this.userHash   = route.snapshot.params.userHash
      }        

  }

  public getWindowClass(){

    if(this.fullScreenWindow)
      return 'spotbie-overlay-window'
    else
      return ''

  }

  public getLoyaltyPointBalance(){    

    this.loyaltyPointsService.userLoyaltyPoints$.subscribe(
      loyaltyPointsBalance => {
        this.loyaltyPointsBalance = loyaltyPointsBalance
      }
    )
    
  }
  
  public fetchRewards(qrCodeLink: string = null, userHash: string = null){
    
    let fetchRewardsReq = null

    if(qrCodeLink !== null && userHash !== null){
      fetchRewardsReq = {
        qrCodeLink: qrCodeLink,
        userHash: userHash
      }
    }

    this.businessMenuService.fetchRewards(fetchRewardsReq).subscribe(
      resp => {
        this.fetchRewardsCb(resp)
      }
    )

  }

  private fetchRewardsCb(resp){
    
    console.log("fetchRewardsCb", resp)

    if(resp.success){

      this.rewards = resp.rewards

      if(this.userType === this.eAllowedAccountTypes.Personal){
        this.userPointToDollarRatio = resp.loyalty_point_dollar_percent_value	
        this.business.name = resp.placeToEatName
      }

    }

  }

  public addItem(){
    
    if(this.loyaltyPointsBalance.balance === 0){
      this.notEnoughLpEvt.emit()
      this.closeWindow()
      return
    }

    this.itemCreator = !this.itemCreator
  
  }

  public closeWindow(){
    this.closeWindowEvt.emit()
  }

  public openReward(reward: Reward){

    this.reward = reward
    this.itemCreator = true
    
    this.rewardCreator

  }

  public closeRewardCreator(){
    this.reward = null
    this.itemCreator = false
  }

  public closeRewardCreatorAndRefetchRewardList(){

    this.closeRewardCreator()
    this.fetchRewards()

  }

  public placeToEatTileStyling(reward: Reward)
  {

    if(reward.type == '0')
      return { 'background': 'url(' + reward.images + ')' }
    else
      return { 'background': 'linear-gradient(90deg,#35a99f,#64e56f)' }
       
  }

  ngOnInit(): void {

    this.userType = localStorage.getItem('spotbie_userType')

    if(this.userType !== this.eAllowedAccountTypes.Personal){

      this.getLoyaltyPointBalance()
      this.fetchRewards()

    } else {

      if(this.qrCodeLink !== null && this.userHash !== null){
        
        this.fetchRewards(this.qrCodeLink, this.userHash)

      }
  
    }

  }

}
