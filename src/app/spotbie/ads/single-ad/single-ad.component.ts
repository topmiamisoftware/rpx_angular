import { Component, Input, OnInit } from '@angular/core';
import { AdsService } from '../ads.service';
import { externalBrowserOpen } from 'src/app/helpers/cordova/web-intent'
import { Business } from 'src/app/models/business';
import { getDistanceFromLatLngInMiles } from 'src/app/helpers/measure-units.helper';
import { Ad } from 'src/app/models/ad';
import { Router } from '@angular/router';

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

  @Input('categories') categories: string

  public link: string

  public displayAd: boolean = false

  public whiteIconSvg = 'assets/images/home_imgs/spotbie-white-icon.svg'

  public distance: number = 0

  public totalRewards: number = 0

  public categoriesListFriendly: string = ''

  public adIsOpen: boolean = false

  public rewardMenuOpen: boolean = false

  constructor(private adsService: AdsService) { }

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

  public getHeaderBannerAdCallback(resp: any){

    if(resp.success){

      this.ad = resp.ad
      
      this.business = resp.business
      
      this.business.is_community_member = true
      this.business.type_of_info_object = 'spotbie_community'

      this.displayAd = true

      this.totalRewards = resp.totalRewards
      this.categoriesListFriendly = JSON.parse(
        this.business.categories.toString().replace(',', ", ")
      )
      this.distance = getDistanceFromLatLngInMiles(this.business.loc_x, this.business.loc_y, this.lat, this.lng)

    } else
      console.log("getHeaderBannerAdCallback", resp)

  }


  public openAd(): void{
    
    this.rewardMenuOpen = true
    //this.router.navigate([`/business-menu/${this.business.qr_code_link}`])

  }

  ngOnInit(): void {
    this.getHeaderBanner()
  }

}
