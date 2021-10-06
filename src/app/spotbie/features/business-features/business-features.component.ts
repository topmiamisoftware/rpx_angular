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

  constructor() { }

  public signUp(){
    this.signUpEvent.emit()
  }

  ngOnInit(): void {

  }

}
