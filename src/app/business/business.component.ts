import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MapComponent} from '../spotbie/map/map.component';
import {MenuLoggedOutComponent} from '../spotbie/spotbie-logged-out/menu-logged-out.component';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css'],
})
export class BusinessComponent implements OnInit {
  scheduleBusinessDemo = true;

  @ViewChild('app_map') app_map: MapComponent;
  @ViewChild('appMenuLoggedOut') appMenuLoggedOut: MenuLoggedOutComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  spawnCategories(category: number): void {
    this.app_map.spawnCategories(category);
  }

  openHome() {
    this.app_map.openWelcome();
  }

  myFavorites() {
    this.app_map.myFavorites();
  }

  signUp() {
    window.location.assign('https://business.spotbie.com/');
  }

  async ngOnInit() {
    const isLoggedIn = localStorage.getItem('spotbie_loggedIn');

    if (isLoggedIn === '1') {
      this.router.navigate(['/user-home']);
    }
  }
}
