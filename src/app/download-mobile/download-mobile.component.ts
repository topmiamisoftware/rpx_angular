import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';

const ANDROID_LINK =
  'https://play.google.com/store/apps/details?id=com.exentriks.spotmee.spotmee&hl=en_US&gl=US';
const IOS_LINK =
  'https://apps.apple.com/us/app/spotbie/id1439327004?app=itunes&ign-mpt=uo%3D4';

const ANDROID_LINK_BUSINESS =
  'https://play.google.com/store/apps/details?id=com.spotbie.business.spotmee';
const IOS_LINK_BUSINESS =
  'https://apps.apple.com/us/app/sb-business/id1598189950';

@Component({
  selector: 'app-download-mobile',
  templateUrl: './download-mobile.component.html',
  styleUrls: ['./download-mobile.component.css'],
})
export class DownloadMobileComponent implements OnInit {
  @Input() buttonStyle = 0;
  @Input() business = false;

  os = '';
  isDesktop = false;

  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private router: Router
  ) {}

  downloadNow() {
    let url = IOS_LINK;

    if (this.business) {
      switch (this.os) {
        case 'Android':
          url = ANDROID_LINK_BUSINESS;
          break;
        case 'ios':
          url = IOS_LINK_BUSINESS;
          break;
      }
    } else {
      switch (this.os) {
        case 'Android':
          url = ANDROID_LINK;
          break;
        case 'ios':
          url = IOS_LINK;
          break;
      }
    }

    window.open(url, '_blank');
  }

  downloadNowGoogle() {
    if (this.business) {
      window.open(ANDROID_LINK_BUSINESS, '_blank');
    } else {
      window.open(ANDROID_LINK, '_blank');
    }
  }

  downloadNowiOs() {
    if (this.business) {
      window.open(IOS_LINK_BUSINESS, '_blank');
    } else {
      window.open(IOS_LINK, '_blank');
    }
  }

  ngOnInit(): void {
    this.os = this.deviceDetectorService.getDeviceInfo().os;
    this.isDesktop = this.deviceDetectorService.isDesktop();

    this.router.url === '/business'
      ? (this.business = true)
      : (this.business = false);
  }
}
