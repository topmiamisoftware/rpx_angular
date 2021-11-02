import { Component, Input, OnInit } from '@angular/core';
import { AdsService } from '../ads.service';
import { Business } from 'src/app/models/business';
import { getDistanceFromLatLngInMiles } from 'src/app/helpers/measure-units.helper';
import { Ad } from 'src/app/models/ad';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FOOD_CATEGORIES, SHOPPING_CATEGORIES, EVENT_CATEGORIES } from '../../map/map_extras/map_extras';
import { AllowedAccountTypes } from 'src/app/helpers/enum/account-type.enum';
import { InfoObjectType } from 'src/app/helpers/enum/info-object-type.enum';

@Component({
  selector: 'app-single-ad',
  templateUrl: './single-ad.component.html',
  styleUrls: ['./single-ad.component.css']
})
export class SingleAdComponent implements OnInit {

  @Input('lat') lat: number
  @Input('lng') lng: number
  @Input('business') business: Business = new Business()
  @Input('ad') ad: Ad = new Ad()

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

  constructor(private adsService: AdsService,
              private deviceDetectorService: DeviceDetectorService) { }
              
  public getHeaderBanner(){

    const headerBannerReqObj = {
      loc_x: this.lat,
      loc_y: this.lng,
      categories: JSON.stringify(this.categories)
    }

    this.adsService.getHeaderBanner(headerBannerReqObj).subscribe(
      resp =>{
        this.getHeaderBannerAdCallback(resp)
      }
    )

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

      this.categoryListForUi = this.categoriesListFriendly.toString().replace(',', ', ')

      this.business.is_community_member = true
      this.business.type_of_info_object = InfoObjectType.SpotBieCommunity

      this.displayAd = true

      this.totalRewards = resp.totalRewards

      this.distance = getDistanceFromLatLngInMiles(this.business.loc_x, this.business.loc_y, this.lat, this.lng)

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

  ngOnInit(): void {

    this.isMobile = this.deviceDetectorService.isMobile()

    this.getHeaderBanner()

  }

}
