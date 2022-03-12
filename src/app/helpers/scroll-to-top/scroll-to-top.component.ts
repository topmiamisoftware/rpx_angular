import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery'

const MY_NEWS_LINK = "https://help.rescue.org/donate/ukraine-acq?ms=gs_ppc_fy22_ukraine_mmus_feb&initialms=gs_ppc_fy22_ukraine_mmus_feb&gclid=CjwKCAiAg6yRBhBNEiwAeVyL0OZ3fFQMEO9dXqlmjgq1bGD-Xa8uKKQm-H-NiJeC_ag1juzzAX26XRoColMQAvD_BwE"

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.css']
})
export class ScrollToTopComponent implements OnInit {

  @Input('inputWindow') inputWindow: ElementRef

  @ViewChild('scrollArrow') scrollArrow: ElementRef
  @ViewChild('ourNews') ourNews: ElementRef
  
  public arrowOn: boolean

  public myNewsLink = MY_NEWS_LINK

  constructor() { }

  scrollTop() {
    $('#spotbieMainSpotBieScroll').animate({ scrollTop: 0 }, 'slow')
  }

  addScrollEvent() {

  }

  goToNews() {
    window.open(this.myNewsLink, "_blank")
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
        this.ourNews.nativeElement.className = 'sb-your-news'
        this.arrowOn = false
      } else if (this.arrowOn == false) {        
        this.arrowOn = true
        this.scrollArrow.nativeElement.className = 'spotbie-scroll-top'
        this.ourNews.nativeElement.className = 'sb-your-news marginLeft'
      }

    }.bind(this))

    const scrollTop = $('#spotbieMainSpotBieScroll').scrollTop()

    if (scrollTop > 50) {

      this.scrollArrow.nativeElement.className = 'spotbie-scroll-top'
      this.arrowOn = true

    }

  }

}
