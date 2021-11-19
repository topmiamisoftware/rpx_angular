import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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

  constructor(private router: Router) { }

  public signUp(){
    this.signUpEvent.emit()
  }

  public spawnCategories(category: string){

    this.spawnCategoriesEvt.emit({ category: category })

  }

  public scheduleDemo(){
    
    let frontEnd = environment.baseUrl

    window.open(`${frontEnd}/schedule-demo`, "_blank")

  }

  ngOnInit(): void {

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
    }

  }

}
