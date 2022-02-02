import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { DeviceDetectorService } from 'ngx-device-detector'

@Component({
  selector: 'app-user-features',
  templateUrl: './user-features.component.html',
  styleUrls: ['../features.component.css', './user-features.component.css']
})
export class UserFeaturesComponent implements OnInit {

  @Output() spawnCategoriesEvt = new EventEmitter()

  @ViewChild('earnLoyaltyPoints') earnLoyaltyPoints: ElementRef
  @ViewChild('earnPlacesToEat') earnPlacesToEat: ElementRef
  @ViewChild('earnShopping') earnShopping: ElementRef
  @ViewChild('earnEvents') earnEvents: ElementRef
  
  public isMobile: boolean = true

  public business: boolean = false

  constructor(private deviceDetectorService: DeviceDetectorService, private router: Router) { }

  public spawnCategories(category: string){

    this.spawnCategoriesEvt.emit({ category: category })

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
    
    this.isMobile = this.deviceDetectorService.isMobile()
    
    this.router.url === '/business' ? this.business = true : this.business = false

  }

  ngAfterViewInit(){
    
    switch(this.router.url)
    {
      case '/home#earnLoyaltyPoints':
        this.earnLoyaltyPoints.nativeElement.scrollIntoView()
        break

      case '/home#earnPlacesToEat':
        this.earnPlacesToEat.nativeElement.scrollIntoView()
        break

      case '/home#earnShopping':
        this.earnShopping.nativeElement.scrollIntoView()
        break 
        
      case '/home#earnEvents':
        this.earnEvents.nativeElement.scrollIntoView()
        break                           
    }

  }

}
