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

@Component({
  selector: 'app-bottom-ad-banner',
  templateUrl: './bottom-ad-banner.component.html',
  styleUrls: ['./bottom-ad-banner.component.css']
})
export class BottomAdBannerComponent implements OnInit {

  @Input('lat') lat: number
  @Input('lng') lng: number
  @Input('business') business: Business = new Business()
  @Input('ad') ad: Ad = null

  @Input('editMode') editMode: boolean = false

  @Input('categories') categories: number

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

  public getBottomHeader(){
    
    let adId = null
    
    if(this.editMode){
      
      if(this.ad == null){
        
        this.ad = new Ad()
        this.ad.id = 10
        adId = this.ad.id

      } else adId = this.ad.id
      
    }

    let searchObjSb = {      
      loc_x: this.lat,
      loc_y: this.lng,
      categories: JSON.stringify(this.categories),
      id: adId
    }

    //Retrieve the SpotBie Ads
    this.adsService.getBottomHeader(searchObjSb).subscribe(
      resp => {
        console.log("getBottomHeaderCb", resp)
        this.getBottomHeaderCb(resp)       
      
      }
    )

  }

  public async getBottomHeaderCb(resp: any){

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
   
        await this.currentCategoryList.reduce((previousValue: string, currentValue: string, currentIndex: number, array: string[]) => {
          
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
      console.log("getSingleAdListCb", resp)

  }

  public openAd(): void{
    
    this.rewardMenuOpen = true
    //this.router.navigate([`/business-menu/${this.business.qr_code_link}`])
    
  }

  public closeRewardMenu(){
    this.rewardMenuOpen = false    
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
    if(image !== '') this.ad.images = image
  }

  ngOnInit(): void {
    
    this.isMobile = this.deviceDetectorService.isMobile()

    this.getBottomHeader()
    
  }

}
