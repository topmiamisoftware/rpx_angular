import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector'

@Component({
  selector: 'app-user-features',
  templateUrl: './user-features.component.html',
  styleUrls: ['../features.component.css', './user-features.component.css']
})
export class UserFeaturesComponent implements OnInit {

  @Output() spawnCategoriesEvt = new EventEmitter()

  public isDesktop: boolean = false
  public isTablet: boolean = false
  public isMobile: boolean = false

  constructor(private deviceService: DeviceDetectorService) { }

  public getWrapperClass(){

    if(this.isMobile){

      return { 'display': 'table-cell',
               'vertical-align': 'middle' }

    }

  }

  public spawnCategories(evt){
    this.spawnCategoriesEvt.emit(evt)
  }

  ngOnInit(): void {
    this.isDesktop = this.deviceService.isDesktop()
    this.isTablet = this.deviceService.isTablet()
    this.isMobile = this.deviceService.isMobile()    
  }

}
