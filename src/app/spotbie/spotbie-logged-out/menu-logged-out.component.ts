import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core'
import { Location } from '@angular/common'

import { externalBrowserOpen } from 'src/app/helpers/cordova/web-intent'
import { DeviceDetectorService } from 'ngx-device-detector'
import { Router } from '@angular/router'

@Component({
  selector: 'app-menu-logged-out',
  templateUrl: './menu-logged-out.component.html',
  styleUrls: ['../menu.component.css']
})
export class MenuLoggedOutComponent implements OnInit {

  @Output() myFavoritesEvt = new EventEmitter()
  @Output() spawnCategoriesOut = new EventEmitter()
  @Output() openHome = new EventEmitter()

  @ViewChild('spotbieMainMenu') spotbieMainMenu: ElementRef

  public logInWindow = { open: false }
  public signUpWindow = { open: false }

  public prevScrollpos
  
  public menuActive: boolean = false

  public isMobile: boolean
  public isDesktop: boolean
  public isTablet: boolean

  public business: boolean = false

  constructor(private location: Location,
              private deviceService: DeviceDetectorService,
              private router: Router) { }

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
  
  public myFavorites(){

    this.menuActive = false
    this.myFavoritesEvt.emit()
    
  }

  goToBusiness(){
    this.router.navigate(['/business'])
  }

  home(){
    this.menuActive = false

    this.signUpWindow.open = false
    this.logInWindow.open = false
    this.openHome.emit()
  }

  ngOnInit(): void { 
    const activatedRoute = this.location.path()

    this.isMobile = this.deviceService.isMobile()
    this.isDesktop = this.deviceService.isDesktop()
    this.isTablet = this.deviceService.isTablet()
    
    // check if we need to auto log-in
    const cookiedRememberMe = localStorage.getItem('spotbie_rememberMe')
    const logged_in = localStorage.getItem('spotbie_rememberMe')

    if(activatedRoute.indexOf('/business') > -1) this.business = true
    
    if (cookiedRememberMe == '1' 
        && activatedRoute.indexOf('/home') > -1
        && logged_in !== '1'){
      this.logInWindow.open = true
    }
  }

  ngAfterViewInit(): void {    
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(()=>{
      this.spotbieMainMenu.nativeElement.style.display = 'table'
    }, 750) 
  }
}