import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AllowedAccountTypes } from 'src/app/helpers/enum/account-type.enum';
import { InfoObjectType } from 'src/app/helpers/enum/info-object-type.enum';
import { getDistanceFromLatLngInMiles } from 'src/app/helpers/measure-units.helper';
import { Ad } from 'src/app/models/ad';
import { Business } from 'src/app/models/business';
import { LoyaltyPointBalance } from 'src/app/models/loyalty-point-balance';
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service';
import { AdsService } from 'src/app/spotbie/ads/ads.service';
import { EVENT_CATEGORIES, FOOD_CATEGORIES, SHOPPING_CATEGORIES } from '../../../map/map_extras/map_extras';

const PLACE_TO_EAT_AD_IMAGE = 'assets/images/def/places-to-eat/featured_banner_in_house.jpg'
const SHOPPING_AD_IMAGE = 'assets/images/def/shopping/featured_banner_in_house.jpg'
const EVENTS_AD_IMAGE = 'assets/images/def/events/featured_banner_in_house.jpg'

@Component({
  selector: 'app-nearby-featured-ad',
  templateUrl: './nearby-featured-ad.component.html',
  styleUrls: ['./nearby-featured-ad.component.css']
})
export class NearbyFeaturedAdComponent implements OnInit {

  @Input() lat: number
  @Input() lng: number
  @Input() business: Business = new Business()
  @Input() ad: Ad = null
  @Input() accountType: string = null
  @Input() editMode: boolean = false
  @Input() categories: number
  @Input() eventsClassification: number = null

  public link: string

  public displayAd: boolean = false

  public whiteIconSvg = 'assets/images/home_imgs/spotbie-white-icon.svg'

  public distance: number = 0

  public totalRewards: number = 0

  public categoriesListFriendly: string[] = []

  public adIsOpen: boolean = false

  public rewardMenuOpen: boolean = false

  public isMobile: boolean = false

  public currentCategoryList: Array<string> = []

  public categoryListForUi: string = null

  public loyaltyPointBalance: LoyaltyPointBalance

  public adTypeWithId: boolean = false

  public adList: Array<Ad> = []
  
  public genericAdImage: string = PLACE_TO_EAT_AD_IMAGE

  public businessReady: boolean = false

  public switchAdInterval: any = false

  constructor(private adsService: AdsService,
              private deviceDetectorService: DeviceDetectorService,
              private loyaltyPointsService: LoyaltyPointsService,
              private router: Router) { 
                
                this.loyaltyPointsService.userLoyaltyPoints$.subscribe(
                  loyaltyPointsBalance => {
                    this.loyaltyPointBalance = loyaltyPointsBalance
                  }
                )

              }
              
  public getNearByFeatured(){

    let adId = null
    let accountType 

    //Stop the service if there's a window on top of the ad component.    
    let needleElement = document.getElementsByClassName('sb-closeButton')
  
    if(needleElement.length > 1){
      //There's a componenet aside from the infoObjectWindow
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

    const nearByFeaturedObj = {
      loc_x: this.lat,
      loc_y: this.lng,
      categories: this.categories,
      id: adId,
      account_type: accountType
    }

    //Retrieve the SpotBie Ads
    this.adsService.getNearByFeatured(nearByFeaturedObj).subscribe(
      resp => {
        this.getNearByFeaturedCallback(resp)
      }
    )

  }

  public async getNearByFeaturedCallback(resp: any){

    if(resp.success){

      this.ad = resp.ad
      this.business = resp.business

      this.businessReady = true

      if(!this.editMode){

        switch( this.business.user_type ){

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
      console.log("Featured Banner caretgory list", this.categoriesListFriendly)

      this.business.is_community_member = true
      this.business.type_of_info_object = InfoObjectType.SpotBieCommunity

      this.displayAd = true

      this.totalRewards = resp.totalRewards

      if(!this.editMode)
        this.distance = getDistanceFromLatLngInMiles(this.business.loc_x, this.business.loc_y, this.lat, this.lng)
      else
        this.distance = 5

      if(!this.switchAdInterval){

        this.switchAdInterval = setInterval( () => {
      
          if(!this.editMode) this.getNearByFeatured()
  
        }, 8000)
        
      }

    } else
      console.log("getNearByFeaturedCallback", resp)

  }

  public getAdStyle(){
    
    if(this.adTypeWithId) {
      
      return { 
        'position' : 'relative',
        'margin' : '0 auto',
        'right': '0'
      }
    
    }

  }

  public closeRewardMenu(){
    this.rewardMenuOpen = false    
  }

  public clickGoToSponsored(){
    
    window.open("/advertise-my-business", '_blank')

  }

  public switchAd(){
    this.getNearByFeatured()
  }

  public openAd(): void{
    
    window.open(`/business-menu/${this.business.qr_code_link}`, '_blank')

  }

  public updateAdImage(image: string = ''){

    if(image != ''){
      this.ad.images = image
      this.genericAdImage = image
    }

  }

  ngOnInit(): void {

    this.isMobile = this.deviceDetectorService.isMobile()
    
    this.getNearByFeatured()

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    clearInterval(this.switchAdInterval)
    this.switchAdInterval = false
  }

}
