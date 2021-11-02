import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AllowedAccountTypes } from 'src/app/helpers/enum/account-type.enum'
import { LoyaltyPointBalance } from 'src/app/models/loyalty-point-balance'
import { Business } from 'src/app/models/business'
import { Ad } from 'src/app/models/ad'
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service'
import { AdCreatorComponent } from './ad-creator/ad-creator.component'
import { AdsService } from '../../ads/ads.service'

@Component({
  selector: 'app-ad-manager-menu',
  templateUrl: './ad-manager-menu.component.html',
  styleUrls: ['./ad-manager-menu.component.css']
})
export class AdManagerMenuComponent implements OnInit {

  @ViewChild('adCreator') adCreator: AdCreatorComponent

  @Input() fullScreenWindow: boolean = true

  @Input() loyaltyPoints: string

  @Output() closeWindowEvt = new EventEmitter()

  @Output() notEnoughLpEvt = new EventEmitter()

  public eAllowedAccountTypes = AllowedAccountTypes

  public menuItemList: Array<any>

  public itemCreator: boolean = false

  public userLoyaltyPoints
  public userResetBalance
  public userPointToDollarRatio

  public adList: Array<Ad> = []
  public ad: Ad

  public qrCodeLink: string = null
  public userHash: string = null

  public userType: string = null

  public loyaltyPointsBalance: LoyaltyPointBalance

  constructor(private loyaltyPointsService: LoyaltyPointsService,
              private adCreatorService: AdsService,
              private router: Router,
              route: ActivatedRoute){

      if(this.router.url.indexOf('business-menu') > -1){     

        this.qrCodeLink = route.snapshot.params.qrCode
        this.userHash   = route.snapshot.params.userHash

      }        

  }

  public getWindowClass(){

    if(this.fullScreenWindow)
      return 'spotbie-overlay-window'
    else
      return ''

  }

  public getLoyaltyPointBalance(){    

    this.loyaltyPointsService.userLoyaltyPoints$.subscribe(

      loyaltyPointsBalance => {
        this.loyaltyPointsBalance = loyaltyPointsBalance
      }

    )
    
  }
  
  public fetchAds(){

    this.adCreatorService.getAds().subscribe(

      resp => {
        this.fetchAdsCb(resp)
      }

    )

  }

  private fetchAdsCb(resp){

    if(resp.success){

      this.adList = resp.adList

    } else
      console.log("fetchAdsCb", resp)
    
  }

  public addAd(){        
    this.itemCreator = !this.itemCreator  
  }

  public closeWindow(){
    this.closeWindowEvt.emit()
  }

  public openAd(ad: Ad){

    this.ad = ad
    this.itemCreator = true
    
    this.adCreator

  }

  public closeAdCreator(){
    this.ad = null
    this.itemCreator = false
  }

  public closeAdCreatorAndRefetchAdList(){

    this.closeAdCreator()
    this.fetchAds()

  }

  public adTileStyling(ad: Ad){
    return  { 'background': 'url(' + ad.images + ')' }  
  }

  ngOnInit(): void {

    this.getLoyaltyPointBalance()
    this.fetchAds()

  }

}
