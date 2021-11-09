import { Component, Input, OnInit } from '@angular/core';
import { AdsService } from '../ads.service';
import { Business } from 'src/app/models/business';
import { getDistanceFromLatLngInMiles } from 'src/app/helpers/measure-units.helper';
import { Ad } from 'src/app/models/ad';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FOOD_CATEGORIES, SHOPPING_CATEGORIES, EVENT_CATEGORIES } from '../../map/map_extras/map_extras';
import { AllowedAccountTypes } from 'src/app/helpers/enum/account-type.enum';
import { InfoObjectType } from 'src/app/helpers/enum/info-object-type.enum';
import { LoyaltyPointBalance } from 'src/app/models/loyalty-point-balance';
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service';

const PLACE_TO_EAT_AD_IMAGE = 'assets/images/def/places-to-eat/header_banner_in_house.jpg'
const SHOPPING_AD_IMAGE = 'assets/images/def/shopping/header_banner_in_house.jpg'
const EVENTS_AD_IMAGE = 'assets/images/def/events/header_banner_in_house.jpg'

@Component({
  selector: 'app-header-ad-banner',
  templateUrl: './header-ad-banner.component.html',
  styleUrls: ['./header-ad-banner.component.css']
})
export class HeaderAdBannerComponent implements OnInit {

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

  public switchAdInterval: any
  
  constructor(private adsService: AdsService,
              private deviceDetectorService: DeviceDetectorService,
              private loyaltyPointsService: LoyaltyPointsService) { 
                
                this.loyaltyPointsService.userLoyaltyPoints$.subscribe(
                  loyaltyPointsBalance => {
                    this.loyaltyPointBalance = loyaltyPointsBalance
                  }
                )

              }
              
  public getHeaderBanner(){

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

      accountType = localStorage.getItem('spotbie_userType')

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

    const headerBannerReqObj = {
      loc_x: this.lat,
      loc_y: this.lng,
      categories: this.categories,
      id: adId,
      account_type: accountType
    }
    
    //Retrieve the SpotBie Ads
    this.adsService.getHeaderBanner(headerBannerReqObj).subscribe(
      resp => {
        this.getHeaderBannerAdCallback(resp)
      }
    )

  }

  public async getHeaderBannerAdCallback(resp: any){

    if(resp.success){

      this.ad = resp.ad      
      this.business = resp.business
      
      if(!this.editMode){
        
        switch(this.business.user_type.toString()){

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

        this.currentCategoryList.reduce((previousValue: string, currentValue: string, currentIndex: number, array: string[]) => {
        
          if(resp.business.categories.indexOf(currentIndex) > -1)
            this.categoriesListFriendly.push(this.currentCategoryList[currentIndex])
                  
          return currentValue
  
        })
  
      }

      console.log("Your Ad:", resp)
      console.log("Header Banner caretgory list", this.categoriesListFriendly)

      this.business.is_community_member = true
      this.business.type_of_info_object = InfoObjectType.SpotBieCommunity

      this.displayAd = true

      this.totalRewards = resp.totalRewards

      if(!this.editMode)
        this.distance = getDistanceFromLatLngInMiles(this.business.loc_x, this.business.loc_y, this.lat, this.lng)
      else
        this.distance = 5

    } else
      console.log("getHeaderBannerAdCallback", resp)

    if(this.switchAdInterval == null){

      this.switchAdInterval = setInterval(()=>{
    
        if(!this.editMode) this.getHeaderBanner()

      }, 8000)
      
    }

  }

  public getAdStyle(){
    
    if(this.editMode) {

      return { 
        'position' : 'relative',
        'margin' : '0 auto',
        'right': '0'
      }
    
    }

  }

  public closeRewardMenu(){
    this.communityMemberOpen = false    
  }

  public clickGoToSponsored(){
    window.open("/advertise-my-business", '_blank')
  }

  public switchAd(){
    this.categoriesListFriendly = []
    this.categoryListForUi = null
    this.getHeaderBanner()
  }

  public openAd(): void{
    
    console.log("Open Ad", this.ad)
    this.communityMemberOpen = true
    //this.router.navigate([`/business-menu/${this.business.qr_code_link}`])

  }

  public updateAdImage(image: string = ''){
    
    if(image != ''){
      this.ad.images = image
      this.genericAdImage = image
    }

  }

  ngOnInit(): void {

    this.isMobile = this.deviceDetectorService.isMobile()

    this.getHeaderBanner()

  }

}
