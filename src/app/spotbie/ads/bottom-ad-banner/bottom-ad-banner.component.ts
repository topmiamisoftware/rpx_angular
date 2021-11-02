import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AllowedAccountTypes } from 'src/app/helpers/enum/account-type.enum';
import { InfoObjectType } from 'src/app/helpers/enum/info-object-type.enum';
import { getDistanceFromLatLngInMiles } from 'src/app/helpers/measure-units.helper';
import { Ad } from 'src/app/models/ad';
import { Business } from 'src/app/models/business';
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

  public getSingleAdList(){
    
    let searchObjSb = {
      loc_x: this.lat,
      loc_y: this.lng,
      categories: JSON.stringify(this.categories)
    }

    //Retrieve the SpotBie Ads
    this.adsService.getSingleAdList(searchObjSb).subscribe(
      resp => {
        this.getSingleAdListCb(resp)
      }
    )

  }

  public async getSingleAdListCb(resp: any){

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
 
      await this.currentCategoryList.reduce((previousValue: string, currentValue: string, currentIndex: number, array: string[]) => {
        
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
    this.getSingleAdList()
  }

  public clickGoToSponsored(){
    
    window.open("/advertise-my-business", '_blank')

  }

  ngOnInit(): void {
    
    this.isMobile = this.deviceDetectorService.isMobile()

    this.getSingleAdList()
    
  }

}
