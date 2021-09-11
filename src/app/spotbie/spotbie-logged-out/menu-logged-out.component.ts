import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core'
import { Location } from '@angular/common'
import { Router } from '@angular/router'

import { externalBrowserOpen } from 'src/app/helpers/cordova/web-intent'
import { DeviceDetectorService } from 'ngx-device-detector'

@Component({
  selector: 'app-menu-logged-out',
  templateUrl: './menu-logged-out.component.html',
  styleUrls: ['../menu.component.css']
})
export class MenuLoggedOutComponent implements OnInit {

  @Input() public_profile_info: any

  @Input() album_id: string
  @Input() album_media_id: string

  @ViewChild('spotbieMainMenu') spotbieMainMenu

  @Output() spawnCategoriesOut = new EventEmitter()
  @Output() openWelcome = new EventEmitter()

  public spotbieFontColor = 'white'
  public spotbieBackgroundColor = ''
  public spotbieBackgroundImage: string

  public public_profile: boolean = false

  public logInWindow = { open: false }
  public signUpWindow = { open: false }

  public featuresWindow = { open: false }

  public home_route: boolean = false

  public prevScrollpos
  
  public menuActive: boolean = false

  public isMobile: boolean
  public isDesktop: boolean
  public isTablet: boolean

  constructor(private location: Location,
              private router: Router,
              private deviceService: DeviceDetectorService) { }

  public spawnCategories(type: any, slideMenu: boolean = true): void{
    if(slideMenu) this.slideMenu()
    this.spawnCategoriesOut.emit(type)
  }

  goToBlog(){
    externalBrowserOpen("https://blog.spotbie.com/")
  }

  openWindow(window: any) {
    window.open = !window.open
  }

  closeWindow(window) {
    window.open = false
  }

  signUp(){
    this.logInWindow.open = false
    this.signUpWindow.open = !this.signUpWindow.open    
  }

  logIn(){
    this.signUpWindow.open = false
    this.logInWindow.open = !this.logInWindow.open 
  }

  slideMenu(){    

    if(this.logInWindow.open)
      this.logInWindow.open = false
    else if(this.signUpWindow.open)
      this.signUpWindow.open = false
    else if(this.featuresWindow.open)    
      this.featuresWindow.open = false
    else
      this.menuActive = !this.menuActive

  }

  getMenuStyle(){

    if(this.menuActive == false)
      return {'background-color' : 'transparent'}

  }

  scrollTo(el: string) {
    const element = document.getElementById(el)
    element.scrollIntoView()
  }

  home(){
    this.openWelcome.emit()
  }

  /*scroll = (event): void => {
    let prevScrollpos =  this.prevScrollpos
    let currentScrollPos = window.pageYOffset
    if (prevScrollpos > currentScrollPos) {
      this.spotbieMainMenu.nativeElement.style.top = "0px"
    } else {
      this.spotbieMainMenu.nativeElement.style.top = '-' + this.spotbieMainMenu.nativeElement.offsetHeight + 'px'
    }
    this.prevScrollpos = currentScrollPos    
  }*/

  ngOnInit(): void {
    
    const activatedRoute = this.location.path()

    if(activatedRoute.indexOf('/home') > -1)
      this.home_route = true
    else
      this.home_route = false
    
    // check if we need to auto log-in
    const cookiedRememberMe = localStorage.getItem('spotbie_rememberMe')
    const logged_in = localStorage.getItem('spotbie_rememberMe')

    if (cookiedRememberMe == '1' 
        && activatedRoute.indexOf('/home') > -1
        && logged_in !== '1'){
      this.logInWindow.open = true
    }
    
    if(this.public_profile_info !== undefined) this.public_profile = true
    
    this.prevScrollpos = window.pageYOffset
    
    this.isMobile = this.deviceService.isMobile()
    this.isDesktop = this.deviceService.isDesktop()
    this.isTablet = this.deviceService.isTablet()
    
    //window.addEventListener('scroll', this.scroll, true)

  }
  /*ngOnDestroy(){
    window.removeEventListener('scroll', this.scroll, true)
  }*/
}