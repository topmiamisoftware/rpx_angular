import { Component, Input, OnInit } from '@angular/core';
import { getDistanceFromLatLngInMiles } from 'src/app/helpers/measure-units.helper';
import { Ad } from 'src/app/models/ad';
import { Business } from 'src/app/models/business';
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

  public getSingleAdListCb(resp: any){

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
    this.getSingleAdList()
  }

}
