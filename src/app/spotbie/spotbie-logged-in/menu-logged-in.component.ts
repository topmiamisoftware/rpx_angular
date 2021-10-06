import { Component, OnInit, Input, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { UserauthService } from 'src/app/services/userauth.service'
import { Subscription } from 'rxjs'
import { MapComponent } from '../map/map.component'
import { DeviceDetectorService } from 'ngx-device-detector'
import { externalBrowserOpen } from 'src/app/helpers/cordova/web-intent'
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service'

@Component({
  selector: 'app-menu-logged-in',
  templateUrl: './menu-logged-in.component.html',
  styleUrls: ['../menu.component.css', './menu-logged-in.component.css']
})
export class MenuLoggedInComponent implements OnInit {

  @Output() userBackgroundEvent = new EventEmitter()

  @ViewChild('spotbieMainMenu') spotbieMainMenu: ElementRef
  
  @ViewChild('spotbieMap') spotbieMap: MapComponent  
  
  public spotbieBackgroundImage: string

  
  public foodWindow = { open : false }

  public mapApp = { open : false }
  public LoyaltyPointsApp = { open : false }
  
  public businessMenuApp = { open: false }

  public settingsWindow =  { open : false }
  public chooseAccountTypeWindow = { open: false } 

  public home_route: boolean = true

  public apps_overlay: boolean = false
  public hovered_app

  public prevScrollpos

  public bg_image_ready: boolean = false

  public web_options_subscriber: Subscription

  public spotbie_app_list = new Array(
    { app_name : 'Settings', icon_class : 'fa fa-cog', app_window : this.settingsWindow}
  )
  
  public menuActive: boolean = false
  
  public spotType: string
  
  public isMobile: boolean
  public isDesktop: boolean
  public isTablet: boolean

  public userType: string

  public userLoyaltyPoints: number = 0

  public userName: string = null

  public qrCode: boolean = false

  constructor(private router : Router,
              private location : Location,
              private userAuthService : UserauthService,
              private deviceService: DeviceDetectorService,
              private loyaltyPointsService: LoyaltyPointsService) {}

  public toggleLoyaltyPoints(){
    
    this.LoyaltyPointsApp.open = !this.LoyaltyPointsApp.open

  }

  public toggleQRScanner(){
    this.qrCode = !this.qrCode
  }

  home(){
    this.spotbieMap.closeCategories()
    this.spotbieMap.openWelcome()
  }

  slideMenu(){    

    if(this.settingsWindow.open)
      this.settingsWindow.open = false
    else
      this.menuActive = !this.menuActive
  }

  getMenuStyle(){
    if(this.menuActive == false){
      return {'background-color' : 'transparent'};
    }
  }

  public openWindow(window : any) : void {
    window.open = !window.open
  }

  public closeWindow(window : any) : void {
    window.open = false
  }

  public scrollTo(el : string): void {
    const element = document.getElementById(el)
    element.scrollIntoView()
  }

  public openApps(): void {
    this.apps_overlay = true
  }

  public closeApps(): void {
    this.apps_overlay = false
  }

  public toggleHelp(): void{
    
  }

  public logOut() : void {

    this.userAuthService.logOut().subscribe(
      resp => {
        this.logOutCallback(resp)
    })

  }
  
  private logOutCallback(logOutResponse : any): void{

    if(logOutResponse.success){
      window.document.body.style.backgroundColor = 'unset'
      this.router.navigate(['/home'])
    } else
      console.log("Log Out Error : ", logOutResponse)

  }

  openAppFromList(window) {
    window.open = true
  }

  public spawnCategories(category: string): void{

    if(!this.isDesktop) this.slideMenu()
    this.spotbieMap.spawnCategories(category)

  }

  goToBlog(){
    externalBrowserOpen("https://blog.spotbie.com/")
  }

  usersAroundYou(){
    this.spotbieMap.mobileStartLocation()
  }

  public async getLoyaltyPointBalance(){

    let resp = await this.loyaltyPointsService.getLoyaltyPointBalance()

  }

  public openBusinessMenu(){
    this.businessMenuApp.open = true
  }

  public closeBusinessMenu(){
    this.businessMenuApp.open = false
  } 

  public getPointsWrapperStyle(){

    if(this.isMobile){
      return { 'width:' : '85%', 'text-align' : 'right' }
    } else {
      return { 'width' : '45%' }
    }
    
  }

  ngOnInit() : void {
    

     this.loyaltyPointsService.userLoyaltyPoints$.subscribe(

      loyaltyPointsBalance =>{
        this.userLoyaltyPoints = loyaltyPointsBalance.balance
      }

    )

    this.isMobile = this.deviceService.isMobile()
    this.isDesktop = this.deviceService.isDesktop()
    this.isTablet = this.deviceService.isTablet()

    let pickedColor : string

    const activatedRoute = this.location.path()

    this.userType = localStorage.getItem('spotbie_userType')

    this.userName = localStorage.getItem('spotbie_userLogin')

    this.getLoyaltyPointBalance()

  }

  ngAfterViewInit(){
    this.mapApp.open = true 
  }
  
}