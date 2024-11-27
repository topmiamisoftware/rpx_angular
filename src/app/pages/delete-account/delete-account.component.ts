import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: [
    './delete-account.component.css',
    '../../features/features.component.css',
    '../../spotbie/menu.component.css',
  ],
})
export class DeleteAccountComponent implements OnInit {
  constructor(private route: Router) {}

  ngOnInit(): void {}

  goHome() {
    this.route.navigate(['business']);
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
