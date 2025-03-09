import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {Router} from '@angular/router';
import {DeviceDetectorService, DeviceInfo} from 'ngx-device-detector';

@Component({
  selector: 'app-user-features',
  templateUrl: './user-features.component.html',
  styleUrls: ['../features.component.css', './user-features.component.css'],
})
export class UserFeaturesComponent implements OnInit {

  @ViewChild('earnLoyaltyPoints') earnLoyaltyPoints: ElementRef;
  @ViewChild('earnPlacesToEat') earnPlacesToEat: ElementRef;
  @ViewChild('earnNearby') earnNearby: ElementRef;
  @ViewChild('earnRewards') earnRewards: ElementRef;

  isMobile = true;
  plaform: DeviceInfo;

  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private router: Router
  ) {}

  openBlog() {
    window.open('https://blog.spotbie.com/', '_blank');
  }

  openIg() {
      window.open(
        'https://www.instagram.com/spotbie.loyalty.points/',
        '_blank'
      );
  }

  openYoutube() {
    window.open(
      'https://www.youtube.com/channel/UCtxkgw0SYiihwR7O8f-xIYA',
      '_blank'
    );
  }

  openTwitter() {
    window.open('https://twitter.com/SpotBie', '_blank');
  }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.plaform = this.deviceDetectorService.getDeviceInfo();
  }

  ngAfterViewInit() {
    switch (this.router.url) {
      case '/home#earnLoyaltyPoints':
        this.earnLoyaltyPoints.nativeElement.scrollIntoView();
        break;

      case '/home#earnPlacesToEat':
        this.earnPlacesToEat.nativeElement.scrollIntoView();
        break;

      case '/home#earnRewards':
        this.earnRewards.nativeElement.scrollIntoView();
        break;

      case '/home#earnNearby':
        this.earnNearby.nativeElement.scrollIntoView();
        break;
    }
  }

  signUp() {
    if (this.plaform.os === 'android ') {
      window.open('https://play.google.com/store/apps/details?id=com.spotbie.home', '_blank');
    } else {
      window.open('https://apps.apple.com/us/app/spotbie/id1439327004', '_blank');
    }
  }
}
