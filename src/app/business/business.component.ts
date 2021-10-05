import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../spotbie/map/map.component';
import * as $ from 'jquery';
import { MenuLoggedOutComponent } from '../spotbie/spotbie-logged-out/menu-logged-out.component';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {

  public arrowOn: boolean = false;

  @ViewChild('app_map') app_map: MapComponent

  @ViewChild('appMenuLoggedOut') appMenuLoggedOut: MenuLoggedOutComponent

  constructor(private router: Router, private route: ActivatedRoute) { }

  public spawnCategories(category: string): void{
    this.app_map.spawnCategories(category)
    this.scrollTop()
  }

  public openWelcome(){
    this.app_map.openWelcome()
    this.scrollTop()
  }

  public signUp(){
    this.appMenuLoggedOut.signUp()
  }

  scrollTop() {
    $('html, body').animate({ scrollTop: 0 }, 'slow')    
  }

  async ngOnInit() {

    const isLoggedIn = localStorage.getItem("spotbie_loggedIn")
  
    if (isLoggedIn == '1') this.router.navigate(['/user-home'])
    
  }

}
