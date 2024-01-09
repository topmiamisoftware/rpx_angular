import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-user-features',
  templateUrl: './user-features.component.html',
  styleUrls: ['../features.component.css', './user-features.component.css'],
})
export class UserFeaturesComponent implements OnInit {
  @Output() spawnCategoriesEvt = new EventEmitter();
  @Output() signUpEvent = new EventEmitter();

  @ViewChild('earnLoyaltyPoints') earnLoyaltyPoints: ElementRef;
  @ViewChild('earnPlacesToEat') earnPlacesToEat: ElementRef;
  @ViewChild('earnNearby') earnNearby: ElementRef;
  @ViewChild('earnRewards') earnRewards: ElementRef;

  isMobile = true;
  business = false;

  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private router: Router
  ) {}

  spawnCategories(category: number) {
    this.spawnCategoriesEvt.emit(category);
  }

  openBlog() {
    window.open('https://blog.spotbie.com/', '_blank');
  }

  openIg() {
    if (this.business) {
      window.open('https://www.instagram.com/spotbie.business/', '_blank');
    } else {
      window.open(
        'https://www.instagram.com/spotbie.loyalty.points/',
        '_blank'
      );
    }
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

    this.router.url === '/business'
      ? (this.business = true)
      : (this.business = false);
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
    this.signUpEvent.emit();
  }
}
