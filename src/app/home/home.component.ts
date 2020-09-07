import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { MapComponent } from '../spotbie/map/map.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public arrowOn: boolean = false;

  @ViewChild('scrollArrow') scrollArrow: ElementRef;

  @ViewChild('app_map') app_map: MapComponent

  constructor(private router: Router) { }

  public spawnCategories(category: string): void{
    this.app_map.spawnCategories(category)
    this.scrollTop()
  }

  scrollTop() {
    $('html, body').animate({ scrollTop: 0 }, 'slow')    
  }

  addScrollEvent() {

    $(window).on('scroll', function() {

      const scrollTop = $(window).scrollTop()

      if (scrollTop < 50) {
        this.scrollArrow.nativeElement.className = 'spotbie-scroll-top spotbie-arrow-transparent'
        this.arrowOn = false
      } else if (this.arrowOn == false) {
        this.arrowOn = true
        this.scrollArrow.nativeElement.className = 'spotbie-scroll-top'
      }

    }.bind(this));

  }

  async ngOnInit() {
    const isLoggedIn = localStorage.getItem("spotbie_loggedIn")
    if (isLoggedIn == '1') this.router.navigate(['/user_home'])
  }

  ngAfterViewInit(){

    this.addScrollEvent();
    document.getElementsByTagName('body')[0].style.backgroundColor = 'transparent !important'

  }

}
