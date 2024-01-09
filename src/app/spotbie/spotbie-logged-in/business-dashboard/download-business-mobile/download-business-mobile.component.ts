import {Component, OnInit} from '@angular/core';
import {DeviceDetectorService, OS} from 'ngx-device-detector';
import {Router} from '@angular/router';

const ANDROID_LINK =
  'https://play.google.com/store/apps/details?id=com.spotbie.business.spotmee';
const IOS_LINK = 'https://apps.apple.com/us/app/sb-business/id1598189950';

@Component({
  selector: 'app-download-business-mobile',
  templateUrl: './download-business-mobile.component.html',
  styleUrls: ['./download-business-mobile.component.css'],
})
export class DownloadBusinessMobileComponent implements OnInit {
  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private router: Router
  ) {}

  downloadNow() {
    let url = IOS_LINK;
    if (this.deviceDetectorService.os === OS.ANDROID) {
      url = ANDROID_LINK;
    }
    window.open(url, '_blank');
  }

  ngOnInit(): void {}
}
