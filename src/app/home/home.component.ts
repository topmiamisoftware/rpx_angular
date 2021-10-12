import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MapComponent } from '../spotbie/map/map.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public arrowOn: boolean = false;

  @ViewChild('app_map') app_map: MapComponent

  constructor(private router: Router) { }

  public spawnCategories(category: string): void{
    
    let evt: any = { category: category }

    this.app_map.spawnCategories(evt)
    //this.scrollTop()
  
  }

  public openWelcome(){
  
    this.app_map.openWelcome()
    //this.scrollTop()
  
  }

  async ngOnInit() {

    const isLoggedIn = localStorage.getItem("spotbie_loggedIn")
  
    if (isLoggedIn == '1') this.router.navigate(['/user-home'])
    
  }
  
}
