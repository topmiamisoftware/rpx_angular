import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AllowedAccountTypes } from 'src/app/helpers/enum/account-type.enum';
import { InfoObjectType } from 'src/app/helpers/enum/info-object-type.enum';
import { getDistanceFromLatLngInMiles } from 'src/app/helpers/measure-units.helper';
import { Ad } from 'src/app/models/ad';
import { Business } from 'src/app/models/business';
import { LoyaltyPointBalance } from 'src/app/models/loyalty-point-balance';
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service';
import { EVENT_CATEGORIES, FOOD_CATEGORIES, SHOPPING_CATEGORIES } from '../../map/map_extras/map_extras';
import { AdsService } from '../ads.service';

const PLACE_TO_EAT_AD_IMAGE = 'assets/images/def/places-to-eat/footer_banner_in_house.jpg'
const SHOPPING_AD_IMAGE = 'assets/images/def/shopping/footer_banner_in_house.jpg'
const EVENTS_AD_IMAGE = 'assets/images/def/events/footer_banner_in_house.jpg'

@Component({
  selector: 'app-bottom-ad-banner',
  templateUrl: './bottom-ad-banner.component.html',
  styleUrls: ['./bottom-ad-banner.component.css']
})
export class BottomAdBannerComponent implements OnInit {

  @Input() lat: number
  @Input() lng: number
  @Input() business: Business = new Business()
  @Input() ad: Ad = null
  @Input() accountType: string = null
  @Input() categories: number
  @Input() editMode: boolean = false
  @Input() eventsClassification: number = null

  public link: string

  public displayAd: boolean = false

  public whiteIconSvg = 'assets/images/home_imgs/spotbie-white-icon.svg'

  public distance: number = 0

  public totalRewards: number = 0

  public categoriesListFriendly: string[] = []

  public adIsOpen: boolean = false

  public communityMemberOpen: boolean = false

  public isMobile: boolean = false

  public currentCategoryList: Array<string> = []

  public categoryListForUi: string = null

  public loyaltyPointBalance: LoyaltyPointBalance

  public adTypeWithId: boolean = false

  public genericAdImage: string = PLACE_TO_EAT_AD_IMAGE

  public switchAdInterval: any = false

  constructor(private adsService: AdsService,
              private deviceDetectorService: DeviceDetectorService,
              private loyaltyPointsService: LoyaltyPointsService) { 
                
                this.loyaltyPointsService.userLoyaltyPoints$.subscribe(
                  loyaltyPointsBalance => {
                    this.loyaltyPointBalance = loyaltyPointsBalance
                  }
                )

              }

  public getBottomHeader(){
    
    let adId = null
    let accountType

    //Stop the service if there's a window on top of the ad component.    
    let needleElement = document.getElementsByClassName('sb-closeButton')
      
    if(needleElement.length > 0){
      //There's a componenet on top of the bottom header.
      return//bounce this request
    }

    if(this.editMode){
      
      if(this.ad == null){
        
        this.ad = new Ad()
        this.ad.id = 2
        adId = this.ad.id

      } else adId = this.ad.id

      accountType = parseInt(localStorage.getItem('spotbie_userType'))

      switch(accountType){
        case 1:
          this.genericAdImage = PLACE_TO_EAT_AD_IMAGE
          break
        case 2:
          this.genericAdImage = SHOPPING_AD_IMAGE
          break
        case 3:
          this.genericAdImage = EVENTS_AD_IMAGE 
          this.categories = this.eventsClassification         
          break  
      }

    } else {

      switch(this.accountType){

        case 'food':
          accountType = 1
          this.genericAdImage = PLACE_TO_EAT_AD_IMAGE
          break
        case 'shopping':
          accountType = 2
          this.genericAdImage = SHOPPING_AD_IMAGE
          break
        case 'events':
          accountType = 3
          this.genericAdImage = EVENTS_AD_IMAGE
          this.categories = this.eventsClassification
          break                          
        
      }

    }

    let searchObjSb = {      
      loc_x: this.lat,
      loc_y: this.lng,
      categories: this.categories,
      id: adId,
      account_type: accountType
    }

    //Retrieve the SpotBie Ads
    this.adsService.getBottomHeader(searchObjSb).subscribe(
      resp => {
        this.getBottomHeaderCb(resp)             
      }
    )
    
  }

  public async getBottomHeaderCb(resp: any){
    
    if(resp.success){

      this.ad = resp.ad
      
      if(this.editMode) this.ad.name = "Harry's"

      this.business = resp.business

      if(!this.editMode){

        switch(this.business.user_type){

          case AllowedAccountTypes.PlaceToEat:
            this.currentCategoryList = FOOD_CATEGORIES          
            break
  
          case AllowedAccountTypes.Events:
            this.currentCategoryList = EVENT_CATEGORIES          
            break
  
          case AllowedAccountTypes.Shopping:
            this.currentCategoryList = SHOPPING_CATEGORIES          
            break            
        }
        
        this.categoriesListFriendly = []

        await this.currentCategoryList.reduce((previousValue: string, currentValue: string, currentIndex: number, array: string[]) => {
          
          if(resp.business.categories.indexOf(currentIndex) > -1)
            this.categoriesListFriendly.push(this.currentCategoryList[currentIndex])          
          
          return currentValue
  
        })
        
      }
      
      console.log("Your Footer Ad:", resp)
      console.log("Footer Banner caretgory list", this.categoriesListFriendly)
      
      this.business.is_community_member = true
      this.business.type_of_info_object = InfoObjectType.SpotBieCommunity
      
      this.displayAd = true

      this.totalRewards = resp.totalRewards

      if(!this.editMode)
        this.distance = getDistanceFromLatLngInMiles(this.business.loc_x, this.business.loc_y, this.lat, this.lng)
      else
        this.distance = 5
      

    } else
      console.log("getSingleAdListCb", resp)

      
    if(!this.switchAdInterval){

      this.switchAdInterval = setInterval(()=>{
    
        if(!this.editMode) this.getBottomHeader()

      }, 8000)
      
    }

  }

  public spotbieAdWrapperStyles(){
    
    if(this.editMode) return { 'margin-top' : '45px' }

  }

  public openAd(): void{
    
    this.communityMemberOpen = true
    //this.router.navigate([`/business-menu/${this.business.qr_code_link}`])
    
  }

  public closeRewardMenu(){
    this.communityMemberOpen = false    
  }
  
  public switchAd(){
    this.categoriesListFriendly = []
    this.categoryListForUi = null
    this.getBottomHeader()
  }

  public clickGoToSponsored(){
    
    window.open("/advertise-my-business", '_blank')

  }

  public updateAdImage(image: string = ''){

    if(image != ''){
      this.ad.images = image
      this.genericAdImage = image
    }

  }

  ngOnInit(): void {
    
    this.isMobile = this.deviceDetectorService.isMobile()
    this.getBottomHeader()
    
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    clearInterval(this.switchAdInterval)
    this.switchAdInterval = false
  }

}
