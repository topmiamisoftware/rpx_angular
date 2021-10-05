import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-business-features',
  templateUrl: './business-features.component.html',
  styleUrls: ['../features.component.css', './business-features.component.css']
})
export class BusinessFeaturesComponent implements OnInit {

  @Output() signUpEvent = new EventEmitter()

  public isDesktop: boolean = false
  public isTablet: boolean = false
  public isMobile: boolean = false

  constructor(private deviceService: DeviceDetectorService) { }

  public signUp(){
    this.signUpEvent.emit()
  }

  public getWrapperClass(){

    if(this.isMobile){

      return { 'display': 'table-cell',
               'vertical-align': 'middle' }

    }

  }

  ngOnInit(): void {

    this.isDesktop = this.deviceService.isDesktop()
    this.isTablet = this.deviceService.isTablet()
    this.isMobile = this.deviceService.isMobile()

  }

}
