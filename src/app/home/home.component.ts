import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MapComponent} from '../spotbie/map/map.component';
import {MenuLoggedOutComponent} from '../spotbie/spotbie-logged-out/menu-logged-out.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  arrowOn = false;

  @ViewChild('appMenuLoggedOut') appMenuLoggedOut: MenuLoggedOutComponent;
  @ViewChild('app_map') app_map: MapComponent;

  constructor(private router: Router) {}

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
    window.location.assign('https://home.spotbie.com/');
  }

  async ngOnInit() {
    const isLoggedIn = localStorage.getItem('spotbie_loggedIn');

    if (isLoggedIn === '1') this.router.navigate(['/user-home']);
  }
}
