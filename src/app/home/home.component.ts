import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MapComponent } from '../spotbie/map/map.component';
import { MenuLoggedOutComponent } from '../spotbie/spotbie-logged-out/menu-logged-out.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public arrowOn: boolean = false;

  @ViewChild('appMenuLoggedOut') appMenuLoggedOut: MenuLoggedOutComponent
  @ViewChild('app_map') app_map: MapComponent

  constructor(private router: Router) { }

  public spawnCategories(category: string): void{
    
    let evt: any = { category: category }
    this.app_map.spawnCategories(evt)
  
  }

  public openHome(){  
    this.app_map.openWelcome()
  }

  public myFavorites(){
    this.app_map.myFavorites()
  }


  public signUp(){
    console.log('sugb yup')
    this.appMenuLoggedOut.signUp()
  }

  async ngOnInit() {

    const isLoggedIn = localStorage.getItem("spotbie_loggedIn")
  
    if (isLoggedIn == '1') this.router.navigate(['/user-home'])
    
  }
  
}
