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

  constructor(private deviceDetectorService: DeviceDetectorService, private router: Router) { }

  public spawnCategories(category: string){

    this.spawnCategoriesEvt.emit({ category: category })

  }

  ngOnInit(): void { 
    
    this.isMobile = this.deviceDetectorService.isMobile()
  
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
