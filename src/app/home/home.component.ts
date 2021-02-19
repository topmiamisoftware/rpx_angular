import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../spotbie/map/map.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public arrowOn: boolean = false;

  @ViewChild('app_map') app_map: MapComponent

  constructor(private router: Router, private route: ActivatedRoute) { }

  public spawnCategories(category: string): void{
    this.app_map.spawnCategories(category)
    this.scrollTop()
  }

  scrollTop() {
    $('html, body').animate({ scrollTop: 0 }, 'slow')    
  }

  async ngOnInit() {

    const isLoggedIn = localStorage.getItem("spotbie_loggedIn")
  
    if (isLoggedIn == '1') this.router.navigate(['/user-home'])
    
  }
  
}
