import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public arrowOn : boolean = false;

  @ViewChild('scrollArrow') scrollArrow: ElementRef;

  constructor(private router : Router) { }

  scrollTop() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
  }

  addScrollEvent() {
    const _this = this;
    $(window).on('scroll', function() {
      // do your things like logging the Y-axis
      const scrollTop = $(window).scrollTop();
      if (scrollTop < 50) {
        _this.scrollArrow.nativeElement.className = 'spotbie-scroll-top spotbie-arrow-transparent';
        _this.arrowOn = false;
      } else if (_this.arrowOn == false) {
        _this.arrowOn = true;
        _this.scrollArrow.nativeElement.className = 'spotbie-scroll-top';
      }
    });
  }

  @HostListener('window:load', [])
  onWindowLoaded() {
      this.addScrollEvent();
  }

  async ngOnInit() {
    const isLoggedIn = localStorage.getItem("spotbie_loggedIn")
    if (isLoggedIn == '1') this.router.navigate(['/user_home'])
  }
}
