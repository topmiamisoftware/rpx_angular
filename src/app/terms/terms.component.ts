import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  @ViewChild('scrollArrow') scrollArrow: ElementRef;

  public arrowOn = false;

  constructor() { }

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

  ngOnInit() {
    this.addScrollEvent();
  }

}
