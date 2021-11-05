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

@Component({
  selector: 'app-single-ad',
  templateUrl: './single-ad.component.html',
  styleUrls: ['./single-ad.component.css']
})
export class SingleAdComponent implements OnInit {

  @Input('lat') lat: number
  @Input('lng') lng: number
  @Input('business') business: Business = new Business()
  @Input('ad') ad: Ad = null

  @Input('categories') categories: number

  @Input('editMode') editMode: boolean = false

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

    if(this.editMode){
      
      if(this.ad == null){
        
        this.ad = new Ad()
        this.ad.id = 10
        adId = this.ad.id

      } else adId = this.ad.id
      
    }

    const headerBannerReqObj = {
      loc_x: this.lat,
      loc_y: this.lng,
      categories: JSON.stringify(this.categories),
      id: adId
    }
    
    //Retrieve the SpotBie Ads
    this.adsService.getHeaderBanner(headerBannerReqObj).subscribe(
      resp => {

        this.getHeaderBannerAdCallback(resp)

      }
    )

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


        this.currentCategoryList.reduce((previousValue: string, currentValue: string, currentIndex: number, array: string[]) => {
        
          if(resp.business.categories.indexOf(currentIndex) > -1)
            this.categoriesListFriendly.push(this.currentCategoryList[currentIndex])
                  
          return currentValue
  
        })
  

      }

      this.categoryListForUi = this.categoriesListFriendly.toString().replace(',', ', ')

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

  }

  public switchAd(){
    this.getHeaderBanner()
  }

  public openAd(): void{
    
    this.rewardMenuOpen = true
    //this.router.navigate([`/business-menu/${this.business.qr_code_link}`])

  }

  public updateAdImage(image: string = ''){
    
    if(image != '') this.ad.images = image
  
  }

  ngOnInit(): void {

    this.isMobile = this.deviceDetectorService.isMobile()
    
    this.getHeaderBanner()

  }

}
