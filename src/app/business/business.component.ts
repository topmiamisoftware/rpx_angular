import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../spotbie/map/map.component';
import { MenuLoggedOutComponent } from '../spotbie/spotbie-logged-out/menu-logged-out.component';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {

  scheduleBusinessDemo: boolean = true

  @ViewChild('app_map') app_map: MapComponent
  @ViewChild('appMenuLoggedOut') appMenuLoggedOut: MenuLoggedOutComponent

  constructor(private router: Router, private route: ActivatedRoute) { }

  public spawnCategories(category: string): void{
    this.app_map.spawnCategories( { category } )
  }

  public openHome(){
    this.app_map.openWelcome()
  }

  public myFavorites(){
    this.app_map.myFavorites()
  }

  public signUp(){
    this.appMenuLoggedOut.signUp()
  }

  async ngOnInit() {
    const isLoggedIn = localStorage.getItem("spotbie_loggedIn")

    if (isLoggedIn === '1') this.router.navigate(['/user-home'])
  }
}
