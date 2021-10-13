import { Component, OnInit, Input, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { UserauthService } from 'src/app/services/userauth.service'
import { Subscription } from 'rxjs'
import { MapComponent } from '../map/map.component'
import { DeviceDetectorService } from 'ngx-device-detector'
import { externalBrowserOpen } from 'src/app/helpers/cordova/web-intent'
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast'
import { AllowedAccountTypes } from 'src/app/helpers/enum/account-type.enum'
import { SettingsComponent } from './settings/settings.component'

@Component({
  selector: 'app-menu-logged-in',
  templateUrl: './menu-logged-in.component.html',
  styleUrls: ['../menu.component.css', './menu-logged-in.component.css']
})
export class MenuLoggedInComponent implements OnInit {

  @Output() userBackgroundEvent = new EventEmitter()

  @ViewChild('spotbieMainMenu') spotbieMainMenu: ElementRef
  
  @ViewChild('spotbieMap') spotbieMap: MapComponent  
  
  @ViewChild('spotbieSettings') spotbieSettings: SettingsComponent

  public spotbieBackgroundImage: string
  
  public foodWindow = { open : false }

  public mapApp = { open : false }

  public settingsWindow =  { open : false }

  public home_route: boolean = true

  public prevScrollpos

  public bg_image_ready: boolean = false

  public menuActive: boolean = false
  
  public spotType: string
  
  public isMobile: boolean
  public isDesktop: boolean
  public isTablet: boolean

  public userType: string

  public userLoyaltyPoints: number = 0

  public userName: string = null

  public qrCode: boolean = false

  public business: boolean = false

  constructor(private router : Router,
              private userAuthService : UserauthService,
              private deviceService: DeviceDetectorService,
              private loyaltyPointsService: LoyaltyPointsService) {}

  public toggleLoyaltyPoints(){
    this.spotbieMap.goToLp()
  }


  public toggleQRScanner(){
    this.spotbieMap.goToQrCode()
  }

  public toggleRewardMenu(){    
    this.spotbieMap.goToRewardMenu()
  }

  public spawnCategories(category: string): void{

    if(!this.isDesktop) this.slideMenu()

    let obj = {
      category: category
    }
    this.spotbieMap.spawnCategories(obj)

  }

  public home(){
    this.spotbieMap.closeCategories()
    this.spotbieMap.openWelcome()
  }

  public openBusinessSettings(){
    
    this.settingsWindow.open = true

    setTimeout(() => {
      this.spotbieSettings.changeAccType()
    }, 500)
    
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
    window.open = true
  }

  public closeWindow(window : any) : void {
    window.open = false
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

  usersAroundYou(){
    this.spotbieMap.mobileStartLocation()
  }

  public async getLoyaltyPointBalance(){

    await this.loyaltyPointsService.getLoyaltyPointBalance()

  }

  public getPointsWrapperStyle(){

    if(this.isMobile)
      return { 'width:' : '85%', 'text-align' : 'right' }
    else
      return { 'width' : '45%' }
    
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

    this.userType = localStorage.getItem('spotbie_userType')

    if(this.userType == AllowedAccountTypes.Personal)
      this.business = false
    else
      this.business = true

    this.userName = localStorage.getItem('spotbie_userLogin')

    this.getLoyaltyPointBalance()

  }

  ngAfterViewInit(){
    this.mapApp.open = true 
  }
  
}