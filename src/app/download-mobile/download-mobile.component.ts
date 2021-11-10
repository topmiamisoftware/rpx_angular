import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

const ANDROID_LINK = 'https://play.google.com/store/apps/details?id=com.exentriks.spotmee.spotmee&hl=en_US&gl=US'
const IOS_LINK = 'https://apps.apple.com/us/app/spotbie/id1439327004?app=itunes&ign-mpt=uo%3D4'

@Component({
  selector: 'app-download-mobile',
  templateUrl: './download-mobile.component.html',
  styleUrls: ['./download-mobile.component.css']
})
export class DownloadMobileComponent implements OnInit {

  @Input() buttonStyle: number = 0

  public os: string = ''

  constructor(private deviceDetectorService: DeviceDetectorService) { }

  downloadNow(){

    let url = IOS_LINK

    switch(this.os){
      case 'Android':
        url = ANDROID_LINK
        break
      case 'ios':
        url = IOS_LINK
        break
    }

    window.open(url, '_blank')

  }

  getPlatformIconClass(){

    switch(this.os){
      case 'Android':
        return 'fa fa-android'
        break
      case 'ios':
        return 'fa fa-app-store-ios'
        break
    }

  }

  ngOnInit(): void {

    this.os = this.deviceDetectorService.getDeviceInfo().os
    console.log("OS", this.os)

  }

}
