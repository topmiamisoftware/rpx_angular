import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { PlaceToEat } from 'src/app/models/place-to-eat'
import { PlaceToEatItem } from 'src/app/models/place-to-eat-item'
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service'
import { BusinessMenuServiceService } from 'src/app/services/spotbie-logged-in/business-menu/business-menu-service.service'

@Component({
  selector: 'app-business-menu',
  templateUrl: './business-menu.component.html',
  styleUrls: ['./business-menu.component.css']
})
export class BusinessMenuComponent implements OnInit {

  @Input() loyaltyPoints: string

  @Output() closeWindowEvt = new EventEmitter()

  public menuItemList: Array<any>

  public itemCreator: boolean = false

  public userLoyaltyPoints
  public userResetBalance
  public userPointToDollarRatio

  public placeToEatRewards: Array<PlaceToEatItem>
  public reward: PlaceToEatItem

  public qrCodeLink: string = null
  public userHash: string = null

  public userType: string = null

  public placeToEat: PlaceToEat = new PlaceToEat()

  constructor(private loyaltyPointsService: LoyaltyPointsService,
              private businessMenuService: BusinessMenuServiceService,
              private router: Router,
              route: ActivatedRoute){

      if(this.router.url.indexOf('business-menu') > -1){               
        this.qrCodeLink = route.snapshot.params.qrCode
        this.userHash   = route.snapshot.params.userHash
      }        

  }

  public fetchLoyaltyPoints(){    

    this.loyaltyPointsService.fetchLoyaltyPoints().subscribe(

      resp => {

        console.log("resp", resp)

        if(resp.success){
          this.userLoyaltyPoints = resp.loyalty_points.balance    
          this.userResetBalance = resp.loyalty_points.reset_balance 
          this.userPointToDollarRatio = resp.loyalty_points.loyalty_point_dollar_percent_value
        }       

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

    if(resp.success){
      
      this.placeToEatRewards = resp.placeToEatRewards

      if(this.userType === '4'){
        this.userPointToDollarRatio = resp.loyalty_point_dollar_percent_value	
        this.placeToEat.name = resp.placeToEatName
      }

      console.log("resp", resp)

    }

  }

  public addItem(){
    this.itemCreator = !this.itemCreator
  }

  public closeWindow(){
    this.closeWindowEvt.emit()
  }

  public openReward(reward){

    this.reward = reward
    this.itemCreator = true
  
  }

  public closeRewardCreator(){
    this.reward = null
    this.itemCreator = false
  }

  public closeRewardCreatorAndRefetchRewardList(){

    this.closeRewardCreator()
    this.fetchRewards()

  }

  public placeToEatTileStyling(reward: PlaceToEatItem)
  {

    if(reward.type == '0')
      return { 'background': 'url(' + reward.images + ')' }
    else
      return { 'background': 'linear-gradient(90deg,#35a99f,#64e56f)' }
       
  }

  ngOnInit(): void {

    this.userType = localStorage.getItem('spotbie_userType')

    if(this.userType !== '4'){

      this.fetchLoyaltyPoints()
      this.fetchRewards()

    } else {

      if(this.qrCodeLink !== null && this.userHash !== null){
        
        this.fetchRewards(this.qrCodeLink, this.userHash)

      }
  
    }

  }

}
