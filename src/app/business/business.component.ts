import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuLoggedOutComponent} from '../spotbie/spotbie-logged-out/menu-logged-out.component';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css'],
})
export class BusinessComponent  {
  scheduleBusinessDemo = true;

  @ViewChild('appMenuLoggedOut') appMenuLoggedOut: MenuLoggedOutComponent;

  constructor(
    private router: Router,
  ) {}

  openHome() {
    this.router.navigate(['/home']);
  }

  openBlog() {
    window.open('https://blog.spotbie.com/', '_blank');
  }

  openIg() {
    window.open('https://www.instagram.com/spotbie.business/', '_blank');
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
}
