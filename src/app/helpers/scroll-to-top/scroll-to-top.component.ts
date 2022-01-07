import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery'

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.css']
})
export class ScrollToTopComponent implements OnInit {

  @Input('inputWindow') inputWindow: ElementRef

  @ViewChild('scrollArrow') scrollArrow: ElementRef

  public arrowOn: boolean

  constructor() { }

  scrollTop() {
    $('#spotbieMainSpotBieScroll').animate({ scrollTop: 0 }, 'slow')
  }

  addScrollEvent() {

  }

  ngOnInit(): void {

    this.addScrollEvent()

  }

  ngAfterViewInit(){

    $('#spotbieMainSpotBieScroll').on('scroll', function() {
      // do your things like logging the Y-axis
      
      const scrollTop = $('#spotbieMainSpotBieScroll').scrollTop()

      if (scrollTop < 50) {
        
        this.scrollArrow.nativeElement.className = 'spotbie-scroll-top spotbie-arrow-transparent'
        this.arrowOn = false

      } else if (this.arrowOn == false) {
        
        this.arrowOn = true
        this.scrollArrow.nativeElement.className = 'spotbie-scroll-top'

      }

    }.bind(this))

    const scrollTop = $('#spotbieMainSpotBieScroll').scrollTop()

    if (scrollTop > 50) {

      this.scrollArrow.nativeElement.className = 'spotbie-scroll-top'
      this.arrowOn = true

    }

  }

}
