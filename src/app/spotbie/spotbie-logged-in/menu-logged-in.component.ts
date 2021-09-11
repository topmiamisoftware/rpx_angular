import { Component, OnInit, Input, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { UserauthService } from 'src/app/services/userauth.service'
import { Subscription } from 'rxjs'
import { ColorsService } from './UNUSED_background-color/colors.service'
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

  //@Input() public_profile_info: any

  //@Input() album_id: string
  //@Input() album_media_id: string

  //public public_profile: boolean = false

  @Output() userBackgroundEvent = new EventEmitter()

  @ViewChild('spotbieMainMenu') spotbieMainMenu: ElementRef
  
  @ViewChild('spotbieMap') spotbieMap: MapComponent  
  
  //public spotbieFontColor: string = 'white'
  //public spotbieBackgroundColor: string = ''
  public spotbieBackgroundImage: string
  //public privateSpotbieBackgroundColor: string = ''

  //public backgroundColorWindow = { open : false }
  //public drivingWindow = { open : false }
  
  public foodWindow = { open : false }
  //public friendsWindow = { open : false }
  //public groupWindow =  { open : false }
  //public locationPairingWindow =  { open : false }
  //public locationSaverWindow =  { open : false }
  //public matcherWindow =  { open : false }
  public mapApp = { open : false }
  public LoyaltyPointsApp = { open : false }
  //public memosWindow =  { open : false }
  //public mediaPlayerWindow = { open : false }
  //public messagingWindow =  { open : false }
  //public missingWindow = { open : false }
  //public myPlacesWindow = { open : false }
  //public pairingWindow =  { open : false }
  public settingsWindow =  { open : false }
  public chooseAccountTypeWindow = { open: false } 

  public home_route: boolean = true

  public apps_overlay: boolean = false
  public hovered_app

  public prevScrollpos

  public bg_image_ready: boolean = false

  public web_options_subscriber: Subscription

  public spotbie_app_list = new Array(
    //{ app_name : 'Messages', icon_class : 'fa fa-envelope', app_window : this.messagingWindow},
    //{ app_name : 'Friends', icon_class : 'fa fa-user', app_window : this.friendsWindow},
    { app_name : 'Settings', icon_class : 'fa fa-cog', app_window : this.settingsWindow},
    // { app_name : "Groups", icon_class : "../../assets/images/groups.png", app_window : this.groupWindow},
    //{ app_name : 'Location Pairing', icon_class : 'fa fa-street-view', app_window : this.locationPairingWindow},
    // { app_name : "Media", icon_class : "../../assets/images/multimedia.png", app_window : this.mediaPlayerWindow},
    //{ app_name : 'Location Saver', icon_class : 'fa fa-map-pin', app_window : this.locationSaverWindow},
    // { app_name : "Memos", icon_class : "../../assets/images/memo.png", app_window : this.memosWindow},
    //{ app_name : 'Matcher', icon_class : 'fa fa-heartbeat', app_window : this.matcherWindow},
    //{ app_name : 'Drive Mode', icon_class : 'fa fa-car', app_window : this.drivingWindow},
    //{ app_name : 'Missing People', icon_class : 'fa fa-exclamation-triangle', app_window : this.missingWindow}
    // { app_name : "Food", icon_image : "../../assets/images/food.png", app_window : this.foodWindow}
  )
  
  public menuActive: boolean = false
  
  public spotType: string
  
  public isMobile: boolean
  public isDesktop: boolean
  public isTablet: boolean

  public userType: string

  public userLoyaltyPoints: number = 0

  public userName: string = null

  constructor(private router : Router,
              private location : Location,
              private userAuthService : UserauthService,
              private deviceService: DeviceDetectorService,
              private loyaltyPointsService: LoyaltyPointsService) {}

  public toggleLoyaltyPoints(){
    
    this.LoyaltyPointsApp.open = !this.LoyaltyPointsApp.open

  }

  public openQRScanner(){

  }

  home(){
    this.spotbieMap.openWelcome()
  }

  slideMenu(){    

    if(this.settingsWindow.open)
      this.settingsWindow.open = false
    //else if(this.friendsWindow.open)
      //this.friendsWindow.open = false
    //else if(this.myPlacesWindow.open)    
      //this.myPlacesWindow.open = false
    else
      this.menuActive = !this.menuActive
  }

  getMenuStyle(){
    if(this.menuActive == false){
      return {'background-color' : 'transparent'};
    }
  }

  private setWebOptions(http_response: any) : void{

      //document.getElementsByTagName('body')[0].style.backgroundColor =  this.spotbieBackgroundColor
      this.userBackgroundEvent.emit({ user_bg :  this.spotbieBackgroundImage })
      this.bg_image_ready = true      

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

  public fetchLoyaltyPoints(): void{

    this.loyaltyPointsService.fetchLoyaltyPoints().subscribe(
      resp => {
        if(resp.message == 'success'){
          this.userLoyaltyPoints = resp.total_loyalty_points
        }
      }
    )

  }

  ngOnInit() : void {
    
    this.isMobile = this.deviceService.isMobile()
    this.isDesktop = this.deviceService.isDesktop()
    this.isTablet = this.deviceService.isTablet()

    let pickedColor : string

    //console.log("The public menu is : ", this.public_profile_info)
    const activatedRoute = this.location.path()

    let userType = localStorage.getItem('spotbie_userType')
    this.userType = userType

    if(this.isMobile || this.isTablet) this.slideMenu()

    if(activatedRoute == '/user-home'){

      //Check if the user type is set and open the chooseAccountType window if not.
      if(userType == '0') this.settingsWindow.open = true

    }

    this.userName = localStorage.getItem('spotbie_userLogin')

    /*if (this.public_profile_info !== undefined) {
      this.public_profile = true
      this.spotbieBackgroundImage = this.public_profile_info.web_options.spotmee_bg
      this.bg_image_ready = true
    }*/


    this.fetchLoyaltyPoints()

    //this.prevScrollpos = window.pageYOffset
    //window.addEventListener('scroll', this.scroll, true)
    
  }

  ngAfterViewInit(){
    this.mapApp.open = true 
  }

  /*ngOnDestroy(){
    window.removeEventListener('scroll', this.scroll, true)
  }*/
}