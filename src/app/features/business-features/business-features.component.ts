import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import * as calendly from '../../helpers/calendly/calendlyHelper'

@Component({
  selector: 'app-business-features',
  templateUrl: './business-features.component.html',
  styleUrls: ['../features.component.css', './business-features.component.css']
})
export class BusinessFeaturesComponent implements OnInit {
  
  @Output() spawnCategoriesEvt = new EventEmitter()
  @Output() signUpEvent = new EventEmitter()

  @ViewChild('awardLoyaltyPointsToCustomers') awardLoyaltyPointsToCustomers: ElementRef
  @ViewChild('attractNewCustomers') attractNewCustomers: ElementRef
  @ViewChild('retainCustomers') retainCustomers: ElementRef
  @ViewChild('engageYourAudience') engageYourAudience: ElementRef
  @ViewChild('scheduleDemo') scheduleDemo: ElementRef
  
  public calendlyUp: boolean = false

  public loading: boolean = false

  public business: boolean = false

  constructor(private router: Router) { }

  public calendly(){
        
    this.loading = true
    this.calendlyUp = !this.calendlyUp

    if(this.calendlyUp) 
        calendly.spawnCalendly('', '', () => { this.loading = false } )
    else
        this.loading = false

  }

  public signUp(){
    this.signUpEvent.emit()
  }

  public spawnCategories(category: string){

    this.spawnCategoriesEvt.emit({ category: category })

  }

  public openBlog(){
    window.open("https://blog.spotbie.com/","_blank")
  } 

  public openIg(){
    if(this.business){
      window.open("https://www.instagram.com/spotbie.business/","_blank")
    } else {
      window.open("https://www.instagram.com/spotbie.loyalty.points/","_blank")   
    }    
  }

  public openYoutube(){
    window.open("https://www.youtube.com/channel/UCtxkgw0SYiihwR7O8f-xIYA","_blank")     
  }

  public openTwitter(){
      window.open("https://twitter.com/SpotBie","_blank")
  }

  ngOnInit(): void {

    this.router.url === '/business' ? this.business = true : this.business = false

  }

  ngAfterViewInit(){
    
    switch(this.router.url)
    {
      case '/business#awardLoyaltyPointsToCustomers':
        this.awardLoyaltyPointsToCustomers.nativeElement.scrollIntoView()
        break

      case '/business#attractNewCustomers':
        this.attractNewCustomers.nativeElement.scrollIntoView()
        break

      case '/business#engageYourAudience':
        this.engageYourAudience.nativeElement.scrollIntoView()
        break 

      case '/business#retainCustomers':
        this.retainCustomers.nativeElement.scrollIntoView()
        break       
        
      case '/business#scheduleDemo':
        this.scheduleDemo.nativeElement.scrollIntoView()
        break  

    }

  }

}
