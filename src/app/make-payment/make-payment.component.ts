import { Component, OnInit, ViewChild } from '@angular/core'

import { StripeCard, StripeScriptTag } from 'stripe-angular'
import { ActivatedRoute } from '@angular/router'
import { Ad } from '../models/ad'
import { AdsService } from '../spotbie/ads/ads.service'
import { Business } from '../models/business'
import { BottomAdBannerComponent } from '../spotbie/ads/bottom-ad-banner/bottom-ad-banner.component'
import { NearbyFeaturedAdComponent } from '../spotbie/ads/nearby-featured-ad/nearby-featured-ad.component'
import { HeaderAdBannerComponent } from '../spotbie/ads/header-ad-banner/header-ad-banner.component'

@Component({
  selector: 'app-make-payment',
  templateUrl: 'make-payment.component.html',
  styleUrls: ['make-payment.component.css']
})
export class MakePaymentComponent implements OnInit {

  @ViewChild('stripeCard') stripeCard: StripeCard

  @ViewChild('adPreviewApp') adPreviewApp: BottomAdBannerComponent | NearbyFeaturedAdComponent | HeaderAdBannerComponent = null

  public invalidError: any = null

  public cardCaptureReady: boolean = false

  public cardDetailsFilledOut: boolean = false

  public uuid: string = ''
  public paymentType: string = ''

  public ad: Ad = new Ad()
  public business: Business = new Business()

  public loading: boolean = false

  public adPaidFor: boolean = false

  constructor(
    private stripeScriptTag: StripeScriptTag,
    private activatedRoute: ActivatedRoute,
    private adsService: AdsService
  ) {
    
    if (!this.stripeScriptTag.StripeInstance) {
      this.stripeScriptTag.setPublishableKey('pk_test_51JrUwnGFcsifY4UhCCJp023Q1dWwv5AabBTsMDwiJ7RycEVLyP1EBpwbXRsfn07qpw5lovv9CGfvfhQ82Zt3Be8U00aH3hD9pj');
    }

  }

  onStripeInvalid( error: Error ){
    this.loading = false
  }

  onStripeError( error: Error ){
    this.loading = false
  }

  setPaymentMethod( token: stripe.paymentMethod.PaymentMethod ){
    
    let subscriptionRequestItem = {
      payment_method: token,
      ad: this.ad,
      business: this.business
    }

    //Store the payment method on Stripe and Spotbie 
    this.adsService.saveAdPayment(subscriptionRequestItem).subscribe(
      resp => {
        
        let newAd = resp.newAd
        
        if(newAd.is_live == 1)
          this.adPaidFor = true
        
        this.loading = false

      }
    )

  }

  stripeCreatePaymentMethod(){
    this.loading = true
    this.stripeCard.createPaymentMethod({})    
  }

  setStripeToken( token: stripe.Token ){
  }

  setStripeSource( source: stripe.Source ){

  }

  onCardCaptureReady(){
    
    this.cardCaptureReady = true
    this.stripeCard.ElementRef.nativeElement.style.display = 'block'

  }

  public getAdFromUuid(){

    let adByUuidReq = {
      uuid: this.uuid
    }

    this.adsService.getAdByUUID(adByUuidReq).subscribe(
      resp => {

        this.ad = resp.ad

        if(this.ad.is_live) this.adPaidFor = true

        this.business = resp.business     
        this.loading = false 
      
      }
    )
    
  }

  ngOnInit(): void {
    
    this.paymentType = this.activatedRoute.snapshot.paramMap.get('paymentType')
    this.uuid = this.activatedRoute.snapshot.paramMap.get('uuid')

    switch(this.paymentType){
      case 'in-house':
        this.getAdFromUuid()
        break;
      case 'business-membership':
        break;
    }
    

  }

}
