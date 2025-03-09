import {Component, ViewChild} from '@angular/core';
import {MenuLoggedOutComponent} from '../spotbie/spotbie-logged-out/menu-logged-out.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  arrowOn = false;

  @ViewChild('appMenuLoggedOut') appMenuLoggedOut: MenuLoggedOutComponent;

  constructor() {}

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
