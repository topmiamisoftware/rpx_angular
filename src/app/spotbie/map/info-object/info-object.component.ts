import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { InfoObjectServiceService } from './info-object-service.service'
import { MyFavoritesService } from '../../my-favorites/my-favorites.service'
import { ShareService } from '@ngx-share/core'
import { ActivatedRoute, Router } from '@angular/router'
import { DateFormatPipe, TimeFormatPipe } from 'src/app/pipes/date-format.pipe'
import { SpotbieMetaService } from 'src/app/services/meta/spotbie-meta.service'
import { setYelpRatingImage } from 'src/app/helpers/info-object-helper'
import { shareNative } from 'src/app/helpers/cordova/sharesheet'
import { isCordova } from 'src/app/helpers/cordova/cordova-variables'

const YELP_BUSINESS_DETAILS_API = "https://api.yelp.com/v3/businesses/"

@Component({
  selector: 'app-info-object',
  templateUrl: './info-object.component.html',
  styleUrls: [ './info-object-share/info-object-share.component.css', './info-object.component.css']
})
export class InfoObjectComponent implements OnInit {

  @Input() info_object

  @Output() closeWindow = new EventEmitter()
  @Output() removeFavoriteEvent = new EventEmitter()

  public bgColor: string

  public loading: boolean = false

  public urlApi: string

  public apiAction: string

  public infoObject: any = null

  public infoObjectImageUrl: string

  public showFavorites: boolean = true

  public isLoggedIn: string

  public infoObjectLink: string
  public infoObjectDescription: string
  public infoObjectTitle: string

  public successful_url_copy: boolean = false

  public objectCategories: string = ""

  public objectDisplayAddress: string

  public isCordova: boolean = false

  constructor(private infoObjectService: InfoObjectServiceService,
              private myFavoritesService: MyFavoritesService,
              public share: ShareService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private spotbieMetaService: SpotbieMetaService) { }

  public closeWindowX(): void {

    if(this.router.url.indexOf('event') > -1 || this.router.url.indexOf('place-to-eat') > -1 || this.router.url.indexOf('retail') > -1)
      this.router.navigate(['/home'])
    else
      this.closeWindow.emit(null)

  }

  private pullInfoObject(): void{

    if(this.router.url.indexOf('event') > -1){
      
      let infoObjectId = this.activatedRoute.snapshot.paramMap.get('id')
      this.urlApi = `id=${infoObjectId}`

    }
    
    const infoObjToPull = {
      config_url: this.urlApi
    }

    if(this.router.url.indexOf('event') > -1){

      this.infoObjectService.pullEventObject(infoObjToPull).subscribe(
        resp =>{
          this.getEventCallback(resp)
        }
      )

    } else {

      this.infoObjectService.pullInfoObject(infoObjToPull).subscribe(
        resp =>{
          this.pullInfoObjectCallback(resp)
        }
      )

    }

  }
  
  public linkCopy(input_element) {
    
    input_element.select();
    document.execCommand('copy');
    input_element.setSelectionRange(0, input_element.value.length);
    this.successful_url_copy = true;

    setTimeout(function() {
      this.successful_url_copy = false;
    }.bind(this), 2500);

  }

  private pullInfoObjectCallback(httpResponse: any): void{

    //console.log("pullInfoObjectCallback", httpResponse)

    //console.log("Info Object", this.info_object)

    if (httpResponse.success) {

      this.infoObject = httpResponse.data

      if(this.info_object === undefined)
        this.info_object = this.infoObject

      this.infoObjectImageUrl = this.info_object.image_url

      if(this.router.url.indexOf('place-to-eat') > -1 || this.info_object.type_of_info_object_category == 'food'){
        this.info_object.type_of_info_object = 'yelp_business'
        this.info_object.type_of_info_object_category = 'food'
        this.infoObjectLink = `https://spotbie.com/place-to-eat/${this.info_object.alias}/${this.infoObject.id}`
      }
      
      if(this.router.url.indexOf('retail') > -1 || this.info_object.type_of_info_object_category == 'shopping'){
        this.info_object.type_of_info_object = 'yelp_business'
        this.info_object.type_of_info_object_category = 'shopping'
        this.infoObjectLink = `https://spotbie.com/retail/${this.info_object.alias}/${this.infoObject.id}`
      }

      if(this.infoObject.hours !== undefined){

        this.infoObject.hours.forEach(hours => {
          
          if(hours.hours_type == "REGULAR")
            this.infoObject.isOpenNow = hours.is_open_now

        })

      }

      this.objectDisplayAddress = `${this.info_object.location.display_address[0]}, ${this.info_object.location.display_address[1]}`

      this.info_object.categories.forEach(category => {
        this.objectCategories = `${this.objectCategories}, ${category.title}`
      });

      this.objectCategories = this.objectCategories.substring(2, this.objectCategories.length)

      switch(this.info_object.type_of_info_object_category){
        case 'food':
          this.infoObjectDescription = `Let's go eat at ${this.info_object.name}. I know you'll enjoy some of these categories ${this.objectCategories}. They are located at ${this.objectDisplayAddress}.`
          break
        case 'shopping':
          this.infoObjectDescription = `I really recommend you go shopping at ${this.info_object.name}!`
          break
        case 'events':
          break          
      }

      this.info_object.rating_image = setYelpRatingImage(this.info_object.rating)

      this.spotbieMetaService.setTitle(`${this.info_object.name} - ${this.objectCategories} - ${this.objectDisplayAddress}`)
      this.spotbieMetaService.setDescription(this.infoObjectDescription)
      this.spotbieMetaService.setImage(this.infoObjectImageUrl)
      
      this.loading = false
      
      this.isInMyFavorites(this.infoObject.id, 'yelp')
      
    } else
      console.log('pullInfoObjectCallback', httpResponse)

  }

  private isInMyFavorites(objId: string, objType: string): void{

    if(this.isLoggedIn === '1'){

      this.myFavoritesService.isInMyFavorites(objId, objType).subscribe(
        resp =>{
          this.isInMyFavoritesCb(resp)
        }
      )

    } else {

      let isAFavorite = this.myFavoritesService.isInMyFavoritesLoggedOut(objId)

      if(isAFavorite)
        this.showFavorites = false
      else
        this.showFavorites = true 

    }

  }

  private isInMyFavoritesCb(httpResponse: any): void{

    if (httpResponse.success) {

      let isAFavorite = httpResponse.is_a_favorite

      if(isAFavorite)
        this.showFavorites = false
      else
        this.showFavorites = true      

    } else
      console.log('pullInfoObjectCallback', httpResponse)

    this.loading = false

  }

  public openWithGoogleMaps(): void {

    let confirmNav = confirm('We will try to open and navigate on your device\'s default navigation app.')
    
    let displayAddress = ''

    this.infoObject.location.display_address.forEach(element => {
      displayAddress = displayAddress + ' ' + element 
    });

    window.open(`http://www.google.com/maps/place/${displayAddress}`)
    
  }

  public switchPhoto(thumbnail): void{
    this.infoObjectImageUrl = thumbnail
  }

  public goToTicket(): void{
    window.open(this.info_object.url, "_blank")
  }

  public addFavorite(): void{

    this.loading = true

    const yelpId = this.infoObject.id
    const name = this.infoObject.name
    const locX = this.infoObject.coordinates.latitude
    const locY = this.infoObject.coordinates.longitude

    const favoriteObj = {
      third_party_id: yelpId,
      name: name,
      description: null,
      loc_x: locX,
      loc_y: locY
    }

    if(this.isLoggedIn == '1'){

      this.myFavoritesService.addFavorite(favoriteObj).subscribe(
        resp => {
          this.addFavoriteCb(resp)
        }
      )

    } else {
      this.myFavoritesService.addFavoriteLoggedOut(favoriteObj)
      this.showFavorites = false
      this.loading = false
    }

  }

  public addFavoriteCb(resp: any): void{

    if(resp.success)
      this.showFavorites = false
    else
      console.log("addFavoriteCb", resp)

    this.loading = false

  }

  public removeFavorite(){

    this.loading = true

    const yelpId = this.infoObject.id

    if(this.isLoggedIn == '1'){

      this.myFavoritesService.removeFavorite(yelpId).subscribe(
        resp => {
          this.removeFavoriteCb(resp, yelpId)
        }
      )

    } else {
      this.myFavoritesService.removeFavoriteLoggedOut(yelpId)
      this.removeFavoriteCb({success: true}, yelpId)
      this.loading = false
      this.showFavorites = true
    }

  }

  public removeFavoriteCb(resp, favoriteId: string){

    if(resp.success) {
      this.showFavorites = true
      this.removeFavoriteEvent.emit({ favoriteId: favoriteId })
    } else
      console.log("removeFavoriteCb", resp)

    this.loading = false

  }

  public getEventCallback (httpResponse: any): void {

    if(httpResponse.success){      
      
      if(httpResponse.data._embedded.events[0] === undefined){
        this.loading = false
        return
      }

      let event_object = httpResponse.data._embedded.events[0]

      event_object.coordinates = {
        latitude: '',
        longitude: ''
      }

      event_object.coordinates.latitude = parseFloat(event_object._embedded.venues[0].location.latitude)
      event_object.coordinates.longitude = parseFloat(event_object._embedded.venues[0].location.longitude)

      event_object.icon = event_object.images[0].url

      event_object.image_url = event_object.images[8].url
      this.infoObjectImageUrl = event_object.image_url

      event_object.type_of_info_object = "ticketmaster_event"

      this.infoObjectDescription = `Let's go to ${event_object.name}!`

      this.infoObjectLink = `https://spotbie.com/event/${this.activatedRoute.snapshot.paramMap.get('id')}`

      let dt_obj = new Date(event_object.dates.start.localDate)

      let time_date = new DateFormatPipe().transform(dt_obj)
      let time_hr = new TimeFormatPipe().transform(event_object.dates.start.localTime)

      event_object.dates.start.spotbieDate = time_date
      event_object.dates.start.spotbieHour = time_hr

      this.info_object = event_object
      
      console.log("InfoObject", this.info_object)

    } else
      console.log("getEventsSearchCallback Error: ", httpResponse)

    this.loading = false

  }

  public shareThisNative(){
    
    let message = this.infoObjectDescription
    let subject = `${this.info_object.name} - ${this.objectCategories} - ${this.objectDisplayAddress}`
    let url = this.infoObjectLink
    let chooserTitle = "Pick an App!"

    shareNative(message, subject, url, chooserTitle)

  }

  ngOnInit(){

    this.loading = true

    this.bgColor = localStorage.getItem('spotbie_backgroundColor')
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn')
    
    this.isCordova = isCordova()

    if(this.info_object !== undefined){
      
      this.infoObjectImageUrl = this.info_object.image_url

      switch(this.info_object.type_of_info_object){
        case 'yelp_business':
          this.urlApi = YELP_BUSINESS_DETAILS_API + this.info_object.id
          break
        case 'ticketmaster_event':
          this.loading = false
          this.infoObjectLink = `https://spotbie.com/event/${this.info_object.id}`
          return
      }

    } else {

      if(this.router.url.indexOf('retail') > -1 || this.router.url.indexOf('place-to-eat') > -1 ){
        
        let infoObjectId = this.activatedRoute.snapshot.paramMap.get('id')

        this.urlApi = YELP_BUSINESS_DETAILS_API + infoObjectId

      }

    }

    this.pullInfoObject()

  }

}