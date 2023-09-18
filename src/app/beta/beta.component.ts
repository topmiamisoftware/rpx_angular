import { Component, OnInit } from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Router} from '@angular/router';
import * as calendly from '../../app/helpers/calendly/calendlyHelper';

@Component({
  selector: 'app-beta',
  templateUrl: './beta.component.html',
  styleUrls: ['./beta.component.css', '../features/features.component.css', '../spotbie/menu.component.css']
})
export class BetaComponent implements OnInit {

  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean = true;
  calendlyUp: boolean = false;
  loading: boolean = false;

  constructor(private deviceService: DeviceDetectorService,
              private route: Router) { }

  ngOnInit(): void {
    this.isDesktop = this.deviceService.isDesktop()
    this.isTablet = this.deviceService.isTablet()
    this.isMobile = this.deviceService.isMobile()
  }

  goHome() {
    this.route.navigate(['business']);
  }

  calendly(){
    this.loading = true
    this.calendlyUp = !this.calendlyUp

    if(this.calendlyUp) {
      calendly.spawnCalendly('', '', () => { this.loading = false } )
    } else {
      this.loading = false
    }
  }

  openBlog(){
    window.open('https://blog.spotbie.com/','_blank')
  }

  openIg(){
    window.open('https://www.instagram.com/spotbie.business/','_blank')
  }

  openYoutube(){
    window.open('https://www.youtube.com/channel/UCtxkgw0SYiihwR7O8f-xIYA','_blank')
  }

  openTwitter(){
    window.open('https://twitter.com/SpotBie','_blank')
  }

  getMapPromptMobileClass(){
    if(this.isMobile)
      return 'map-prompt-mobile align-items-center justify-content-center'
    else
      return 'map-prompt-mobile align-items-center'
  }


  getMapPromptMobileInnerWrapperClassOne(){
    if(this.isMobile) return 'map-prompt-v-align mt-2'
  }
}
