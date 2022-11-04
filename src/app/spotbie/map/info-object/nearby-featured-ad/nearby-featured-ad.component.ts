import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
import { EVENT_CATEGORIES, FOOD_CATEGORIES, SHOPPING_CATEGORIES } from '../../map_extras/map_extras';

const PLACE_TO_EAT_AD_IMAGE = 'assets/images/def/places-to-eat/featured_banner_in_house.jpg'
const SHOPPING_AD_IMAGE = 'assets/images/def/shopping/featured_banner_in_house.jpg'
const EVENTS_AD_IMAGE = 'assets/images/def/events/featured_banner_in_house.jpg'

const FEATURED_BANNER_TIMER_INTERVAL = 16000

@Component({
  selector: 'app-nearby-featured-ad',
  templateUrl: './nearby-featured-ad.component.html',
  styleUrls: ['./nearby-featured-ad.component.css']
})
export class NearbyFeaturedAdComponent implements OnInit, OnDestroy {

  @Input() lat: number
  @Input() lng: number
  @Input() business: Business = new Business()
  @Input() ad: Ad = null
  @Input() accountType: string = null
  @Input() editMode: boolean = false
  @Input() categories: number
  @Input() eventsClassification: number = null

  link: string
  displayAd: boolean = false
  whiteIconSvg = 'assets/images/home_imgs/spotbie-white-icon.svg'
  distance: number = 0
  totalRewards: number = 0
  categoriesListFriendly: string[] = []
  adIsOpen: boolean = false
  rewardMenuOpen: boolean = false
  isMobile: boolean = false
  currentCategoryList: Array<string> = []
  categoryListForUi: string = null
  loyaltyPointBalance: any
  adTypeWithId: boolean = false
  adList: Array<Ad> = []
  genericAdImage: string = PLACE_TO_EAT_AD_IMAGE
  businessReady: boolean = false
  switchAdInterval: any = false

  constructor(private adsService: AdsService,
              private deviceDetectorService: DeviceDetectorService,
              private loyaltyPointsService: LoyaltyPointsService,
              private router: Router) {
                this.loyaltyPointsService.userLoyaltyPoints$.subscribe(loyaltyPointsBalance => {
                    this.loyaltyPointBalance = loyaltyPointsBalance
                  })
              }

  getNearByFeatured(){
    let adId = null
    let accountType

    const needleElement = document.getElementsByClassName('sb-closeButton')

    if(needleElement.length > 1){
      return
    }

    if(this.editMode){
      if(this.ad == null){
        this.ad = new Ad()
        this.ad.id = 2
        adId = this.ad.id
      } else {
        adId = this.ad.id
      }

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

    this.adsService.getNearByFeatured(nearByFeaturedObj)
      .subscribe(resp => {
        this.getNearByFeaturedCallback(resp)
      })
  }

  async getNearByFeaturedCallback(resp: any){
    if(resp.success){
      this.ad = resp.ad
      this.business = resp.business
      this.businessReady = true

      if(!this.editMode && this.business !== null){
        switch(this.business.user_type) {
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
          if(resp.business.categories.indexOf(currentIndex) > -1){
            this.categoriesListFriendly.push(this.currentCategoryList[currentIndex])
          }
          return currentValue
        })

        this.business.is_community_member = true
        this.business.type_of_info_object = InfoObjectType.SpotBieCommunity

        this.distance = getDistanceFromLatLngInMiles(this.business.loc_x, this.business.loc_y, this.lat, this.lng)
      } else {
        this.distance = 5
      }

      this.displayAd = true
      this.totalRewards = resp.totalRewards

      if(!this.switchAdInterval){
        this.switchAdInterval = setInterval( () => {
          if(!this.editMode) this.getNearByFeatured()
        }, FEATURED_BANNER_TIMER_INTERVAL)
      }
    } else
      console.log("getNearByFeaturedCallback", resp)
  }

  getAdStyle() {
    if(this.adTypeWithId) {
      return {
        position: 'relative',
        margin: '0 auto',
        right: '0'
      }
    }
  }

  closeRewardMenu(){
    this.rewardMenuOpen = false;
  }

  clickGoToSponsored(){
    window.open("/business", '_blank');
  }

  switchAd(){
    this.getNearByFeatured()
  }

  openAd(): void{
    window.open(`/business-menu/${this.business.qr_code_link}`, '_blank')
  }

  updateAdImage(image: string = ''){
    if(image !== ''){
      this.ad.images = image
      this.genericAdImage = image
    }
  }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile()
    this.getNearByFeatured()
  }

  ngOnDestroy(): void {
    clearInterval(this.switchAdInterval)
    this.switchAdInterval = false
  }
}
