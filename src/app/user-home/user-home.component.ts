import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'

import * as $ from 'jquery'
import { UserauthService } from '../services/userauth.service'

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  public arrow_on: boolean = false

  public bg_image: string

  public userId: string

  @ViewChild('scrollArrow') scrollArrow: ElementRef

  public loggedIn: boolean = false

  constructor(private userAuthService: UserauthService) { }

  scrollTop() {
    $('html, body').animate({ scrollTop: 0 }, 'slow')
  }

  addScrollEvent() {
    $(window).on('scroll', function() {
      // do your things like logging the Y-axis
      const scrollTop = $(window).scrollTop()
      if (scrollTop < 50) {
        this.scrollArrow.nativeElement.className = 'spotbie-scroll-top spotbie-arrow-transparent'
        this.arrow_on = false
      } else if (this.arrow_on == false) {
        this.arrow_on = true
        this.scrollArrow.nativeElement.className = 'spotbie-scroll-top'
      }
    }.bind(this))
  }

  setcurrentUserBgImage(evt: any) {
    this.bg_image = evt.user_bg
  }

  async ngOnInit(){
    const response = await this.userAuthService.checkIfLoggedIn()
    this.userId = response.user_id 
  }

  ngAfterViewInit() {
    this.addScrollEvent()
  }
}
