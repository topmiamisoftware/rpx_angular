import { Component, OnInit, Input, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { UserauthService } from 'src/app/services/userauth.service'
import { Subscription } from 'rxjs'
import { ColorsService } from './background-color/colors.service'

@Component({
  selector: 'app-menu-logged-in',
  templateUrl: './menu-logged-in.component.html',
  styleUrls: ['../menu.component.css', './menu-logged-in.component.css']
})
export class MenuLoggedInComponent implements OnInit {

  @Input() public_profile_info: any

  @Input() album_id: string
  @Input() album_media_id: string

  public public_profile: boolean = false

  @Output() userBackgroundEvent = new EventEmitter()
  
  @ViewChild('spotbieMainMenu') spotbieMainMenu: ElementRef
  
  public spotbieFontColor: string = 'white'
  public spotbieBackgroundColor: string = ''
  public spotbieBackgroundImage: string
  public privateSpotbieBackgroundColor: string = ''

  public backgroundColorWindow = { open : false }
  public drivingWindow = { open : false }
  
  public foodWindow = { open : false }
  public friendsWindow = { open : false }
  public groupWindow =  { open : false }
  public locationPairingWindow =  { open : false }
  public locationSaverWindow =  { open : false }
  public matcherWindow =  { open : false }
  public mapApp = { open : false }
  public memosWindow =  { open : false }
  public mediaPlayerWindow = { open : false }
  public messagingWindow =  { open : false }
  public missingWindow = { open : false }
  public myPlacesWindow = { open : false }
  public pairingWindow =  { open : false }
  public settingsWindow =  { open : false }

  public home_route: boolean = true

  public apps_overlay: boolean = false
  public hovered_app

  public prevScrollpos

  public bg_image_ready: boolean = false

  public web_options_subscriber: Subscription

  public spotbie_app_list = new Array(
    { app_name : 'Messages', icon_class : 'fa fa-envelope', app_window : this.messagingWindow},
    { app_name : 'Friends', icon_class : 'fa fa-user', app_window : this.friendsWindow},
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

  constructor(private router : Router,
              private location : Location,
              private userAuthService : UserauthService,
              private webOptionsService : ColorsService) { 

    this.web_options_subscriber = this.webOptionsService.getWebOptions().subscribe(web_options =>{

      if(web_options){
        this.spotbieBackgroundColor = web_options.bg_color      
        this.spotbieBackgroundImage = web_options.spotmee_bg
        this.mapApp.open = true 
      }

    })

  }

  private setWebOptions(http_response: any) : void{

      document.getElementsByTagName('body')[0].style.backgroundColor =  this.spotbieBackgroundColor
      this.userBackgroundEvent.emit({ user_bg :  this.spotbieBackgroundImage })
      this.bg_image_ready = true      

  }

  public openWindow(window : any) : void {
    window.open = true
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

  public logOut() : void {

    this.userAuthService.logOut().subscribe(
      resp => {
        this.logOutCallback(resp)
    })

  }
  
  private logOutCallback(logOutResponse : any): void{

    if(logOutResponse.success){
      window.location.reload()
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

  ngOnInit() : void {
    
    let pickedColor : string

    //console.log("The public menu is : ", this.public_profile_info)
    const activatedRoute = this.location.path()

    if(activatedRoute == '/user-home'){

      this.webOptionsService.callWebOptionsApi().subscribe(
        resp =>{
          this.setWebOptions(resp)
        }
      )

    }

    if (this.public_profile_info !== undefined) {
      this.public_profile = true
      pickedColor = this.public_profile_info.web_options.bg_color
      this.spotbieBackgroundImage = this.public_profile_info.web_options.spotmee_bg
      this.bg_image_ready = true
    } else
      pickedColor = this.spotbieBackgroundColor
  
    if (pickedColor != '') {
      this.spotbieBackgroundColor = pickedColor
    } else {
      this.spotbieBackgroundColor = '#181818'
    }
    
    //this.prevScrollpos = window.pageYOffset
    //window.addEventListener('scroll', this.scroll, true)
    
  }
  /*ngOnDestroy(){
    window.removeEventListener('scroll', this.scroll, true)
  }*/
}