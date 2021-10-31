import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild }      from '@angular/core'
import { MatSliderChange }                   from '@angular/material/slider'

import { AgmMap, AgmInfoWindow }             from '@agm/core'

import { metersToMiles, setYelpRatingImage } from 'src/app/helpers/info-object-helper'

import { DateFormatPipe, TimeFormatPipe }    from 'src/app/pipes/date-format.pipe'
import { MapObjectIconPipe }                 from 'src/app/pipes/map-object-icon.pipe'

import { DeviceDetectorService }             from 'ngx-device-detector'

import { LocationService }                   from '../../services/location-service/location.service'

import * as map_extras                       from './map_extras/map_extras'
import * as sorterHelpers                    from 'src/app/helpers/results-sorter.helper'
import { BusinessDashboardComponent } from '../spotbie-logged-in/business-dashboard/business-dashboard.component'
import { UserDashboardComponent } from '../spotbie-logged-in/user-dashboard/user-dashboard.component'
import { SortOrderPipe } from 'src/app/pipes/sort-order.pipe'
import { Business } from 'src/app/models/business'
import { BusinessMenuServiceService } from 'src/app/services/spotbie-logged-in/business-menu/business-menu-service.service'
import { AdsService } from '../ads/ads.service'
import { BottomAdBannerComponent } from '../ads/bottom-ad-banner/bottom-ad-banner.component'
import { SingleAdComponent } from '../ads/single-ad/single-ad.component'

const YELP_BUSINESS_SEARCH_API = 'https://api.yelp.com/v3/businesses/search'

const BANNED_YELP_IDS = map_extras.BANNED_YELP_IDS

@Component({
  selector:    'app-map',
  templateUrl: './map.component.html',
  styleUrls:   ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() business: boolean = false

  @Input() spotType: any

  @Output() signUpEvt = new EventEmitter()

  @Output('openBusinessSettingsEvt') openBusinessSettingsEvt = new EventEmitter

  @ViewChild('spotbie_map') spotbie_map: AgmMap

  @ViewChild('spotbie_user_marker_info_window') spotbie_user_marker_info_window: AgmInfoWindow

  @ViewChild('homeDashboard') homeDashboard: BusinessDashboardComponent | UserDashboardComponent

  @ViewChild('featureWrapper') featureWrapper: ElementRef

  @ViewChild('scrollMapAppAnchor') scrollMapAppAnchor: ElementRef

  @ViewChild('bottomAdBanner') bottomAdBanner: BottomAdBannerComponent
  @ViewChild('singleAdApp') singleAdApp: SingleAdComponent

  public isLoggedIn: string
  public iconUrl:  string
  public spotbie_username: string
  public bg_color: string
  public user_default_image: string

  public searchResultsSubtitle: string
  public searchCategoriesPlaceHolder: string

  public sort_by_txt: string = 'Distance'
  public sorting_order: string = 'asc'
  public sortAc: number = 0
  public totalResults: number = 0
  public current_offset: number = 0
  public itemsPerPage: number = 20 
  public around_me_search_page: number = 1  
  public loadedTotalResults: number = 0
  public allPages: number = 0

  public maxDistanceCap: number = 45
  public maxDistance: number = 10 

  public searchCategory: string
  public previousSeachCategory: string
  public searchCategorySorter: string
  public search_keyword: string
  public type_of_info_object: string
  private showOpenedParam: string
  public eventDateParam: string
  public sortEventDate: string = 'none'
  public showingOpenedStatus: string = 'Showing Opened & Closed'
  public searchApiUrl: string
  
  public lat:   number
  public lng:   number
  public ogLat: number
  public ogLng: number

  private n2_x = 0
  private n3_x = 7
  private rad_11 = null
  private rad_1 = null

  public fitBounds: boolean = false
  public zoom: number = 18
  public map: boolean = false

  public showSearchResults: boolean
  public show_search_box: boolean
  
  public locationFound: boolean = false
  public sliderRight: boolean = false
  public catsUp: boolean = false
  public loading: boolean = false
  public toastHelper: boolean = false
  public displaySurroundingObjectList: boolean = false
  public showNoResultsBox: boolean = false
  public showMobilePrompt: boolean = true
  public showMobilePrompt2: boolean = false
  public firstTimeShowingMap: boolean = true
  public showOpened: boolean = false
  public no_results: boolean = false

  public current_search_type = '0'
  
  public surroundingObjectList = new Array()
  public searchResults = new Array()
  private searchResultsOriginal: Array<any> = []

  public event_categories
  public food_categories = map_extras.FOOD_CATEGORIES
  public shopping_categories = map_extras.SHOPPING_CATEGORIES

  public map_styles = map_extras.MAP_STYLES

  public infoObject: any
  public infoObjectWindow: any = { open: false }
  public currentMarker: any
  public categories: any
  public myFavoritesWindow = { open : false }
  public update_distance_timeout: any
  private finderSearchTimeout: any

  public subCategory: any = {
    food_sub: { open: false},
    media_sub: { open: false},
    artist_sub: { open: false},
    place_sub: { open: false}
  }

  public placesToEat: boolean = false
  public eventsNearYou: boolean = false
  public reatailShop: boolean = false
  public usersAroundYou: boolean = false

  public isDesktop: boolean = false
  public isTablet: boolean = false
  public isMobile: boolean = false

  public loadingText: string = null

  public displayLocationEnablingInstructions: boolean = false

  public bannedYelpIDs = BANNED_YELP_IDS

  public communityMemberList: Array<Business> = []

  constructor(private locationService: LocationService,
              private deviceService: DeviceDetectorService,
              private mapIconPipe: MapObjectIconPipe) { }

  /** 
   * Will close current search results, save the current user's location, and draw the user's position
   * in the map.
   */
  public spotMe() {

    this.closeSearchResults()

    this.displaySurroundingObjectList = true
    this.n2_x = 0
    this.n3_x = 7
    this.rad_1 = this.rad_11
    this.surroundingObjectList = []

    this.drawPosition()

  }

  public togglePlacesToEatInfo(){
    this.placesToEat = !this.placesToEat
  }

  public toggleEventsInfo(){
    this.eventsNearYou = !this.eventsNearYou
  }

  public toggleReailShopsInfo(){
    this.reatailShop = !this.reatailShop
  }

  public toggleUsersAroundYouInfo(){
    this.usersAroundYou = !this.usersAroundYou
  }

  public priceSortDesc(a, b) {
    a = a.price
    b = b.price

    if (a === undefined) { return 1 } else if (b === undefined) { return -1 }
    return a.length > b.length ? -1: b.length > a.length ? 1: 0
  }

  public deliverySort() {
    this.searchResults = this.searchResults.filter((search_result) => {
      return search_result.transactions.indexOf('delivery') > -1
    })
  }

  public pickUpSort() {
    this.searchResults = this.searchResults.filter((search_result) => {
      return search_result.transactions.indexOf('pickup') > -1
    })
  }

  public reservationSort() {
    this.searchResults = this.searchResults.filter((search_result) => {
      return search_result.transactions.indexOf('restaurant_reservation') > -1
    })
  }

  public eventsToday() {
    
    this.sortEventDate = 'today'

    let startTime = new Date().toISOString().slice(0, 11)
    startTime = `${startTime}00:00:00Z` 
    
    let endTime = new Date()
    endTime.setDate(endTime.getDate() + 1)

    let newEndTime = endTime.toISOString().slice(0, 11)
    newEndTime = `${newEndTime}00:00:00Z`
    
    this.eventDateParam = `startEndDateTime=${startTime},${newEndTime}`
    this.apiSearch(this.search_keyword)
    
  }

  public eventsThisWeekend() {

    this.sortEventDate = 'weekend'

    let startTime = this.nextWeekdayDate(new Date(), 5)

    let newStartTime = startTime.toISOString().slice(0, 11)
    newStartTime = `${newStartTime}00:00:00Z`
    
    let endTime = this.nextWeekdayDate(new Date(), 1)

    let newEndTime = endTime.toISOString().slice(0, 11)
    newEndTime = `${newEndTime}00:00:00Z`
    
    this.eventDateParam = `startEndDateTime=${newStartTime},${newEndTime}`

    this.apiSearch(this.search_keyword)

  }

  public nextWeekdayDate(date, dayInWeek) {
    let ret = new Date(date||new Date())
    ret.setDate(ret.getDate() + (dayInWeek - 1 - ret.getDay() + 7) % 7 + 1)
    return ret
  }

  public showOpen(){

    this.showOpened = !this.showOpened

    if(!this.showOpened){
      this.showingOpenedStatus = 'Show Opened and Closed' 
      this.showOpenedParam = `open_now=true`  
    } else {
      this.showingOpenedStatus = 'Show Opened' 
      let unixTime = Math.floor(Date.now() / 1000)
      this.showOpenedParam = `open_at=${unixTime}`  
    }

    this.apiSearch(this.search_keyword)

  }

  public updateDistance(evt: MatSliderChange): void{
    
    clearTimeout(this.update_distance_timeout)

    this.update_distance_timeout = setTimeout( () => {

      this.maxDistance = evt.value

      if(this.showNoResultsBox){

        this.apiSearch(this.search_keyword)

      } else {

        let results = this.searchResultsOriginal.filter((search_result) => {
          return search_result.distance < this.maxDistance
        })
    
        this.loadedTotalResults = results.length
    
        this.searchResults = results

        this.sortBy(this.sortAc)

      }

    }, 500)

  }

  public sortBy(ac: number) {

    this.sortAc = ac

    switch(ac){
      case 0:
        this.sort_by_txt = "Distance"
        break
      case 1:
        this.sort_by_txt = "Rating"
        break
      case 2:
        this.sort_by_txt = "Reviews"
        break
      case 3:
        this.sort_by_txt = "Price"
        break
      case 4:
        this.sort_by_txt = "Delivery"
        break
      case 5:
        this.sort_by_txt = "Pick-up"
        break 
      case 6:
        this.sort_by_txt = "Reservations"
        break
      case 7:
        this.sort_by_txt = "Events Today"
        break 
      case 8:
        this.sort_by_txt = "Events This Weekend"
        break                                                                    
    }

    if (ac != 4 && ac != 5 && ac != 6 && ac != 7 && ac != 8) {

      if (this.sorting_order == 'desc')
        this.sorting_order = 'asc'
      else
        this.sorting_order = 'desc'

    }
    
    switch (ac) {

      case 0:
        
        //sort by distance
        if (this.sorting_order == 'desc')
          this.searchResults = this.searchResults.sort(sorterHelpers.distanceSortDesc)
        else 
          this.searchResults = this.searchResults.sort(sorterHelpers.distanceSortAsc)
        
          break

      case 1:
        
        //sort by rating
        if (this.sorting_order == 'desc') 
          this.searchResults = this.searchResults.sort(sorterHelpers.ratingSortDesc)
        else 
          this.searchResults = this.searchResults.sort(sorterHelpers.ratingSortAsc)

        break

      case 2:

        //sort by reviews
        if (this.sorting_order == 'desc')
          this.searchResults = this.searchResults.sort(sorterHelpers.reviewsSortDesc)
        else
          this.searchResults = this.searchResults.sort(sorterHelpers.reviewsSortAsc)

        break

      case 3:

        //sort by price
        if (this.sorting_order == 'desc')
          this.searchResults = this.searchResults.sort(this.priceSortDesc)
        else
          this.searchResults = this.searchResults.sort(sorterHelpers.priceSortAsc)
        
        break

      case 4:

        //sort by delivery
        this.deliverySort()
        break

      case 5:

        //sort by pick up
        this.pickUpSort()
        break

      case 6:

        //sort by reservation
        this.reservationSort()
        break

      case 7:

        //sort events by today
        this.eventsToday()
        break

      case 8:

        //sort by this weekend
        this.eventsThisWeekend()
        break       

    }

  }

  public classificationSearch(): void{

    this.loading = true
    
    this.locationService.getClassifications().subscribe(
      resp => {
        this.classificationSearchCallback(resp)        
      }
    )

  }

  public classificationSearchCallback(httpResponse: any){

    this.loading = false

    if(httpResponse.success){

      let classifications: Array<any> = httpResponse.data._embedded.classifications
      
      classifications.forEach(classification => {

        if(classification.type && classification.type.name && classification.type.name !== "Undefined"){

          classification.name = classification.type.name        

        } else if(classification.segment && classification.segment.name && classification.segment.name !== "Undefined"){

          classification.name = classification.segment.name

          classification.segment._embedded.genres.forEach(genre => {

            genre.show_sub_sub = false

            if(genre.name === "Chanson Francaise" ||
              genre.name === "Medieval/Renaissance" ||
              genre.name === "Religious" ||
              genre.name === "Undefined" ||
              genre.name === "World"){

                classification.segment._embedded.genres.splice(classification.segment._embedded.genres.indexOf(genre), 1)

            }

          });          

        }

        if(classification.name !== undefined){

          classification.show_sub = false

          if(classification.name !== 'Donation' &&
          classification.name !== 'Parking' &&
          classification.name !== 'Transportation' &&
          classification.name !== 'Upsell' &&
          classification.name !== 'Venue Based' &&
          classification.name !== 'Event Style' &&
          classification.name !== 'Individual' &&
          classification.name !== 'Merchandise' &&
          classification.name !== 'Group'){
          
            this.event_categories.push(classification)
          
          }

        }

      })

      this.event_categories = this.event_categories.reverse()

      this.catsUp = true

    } else
      console.log("getClassifications Error ", httpResponse)

    this.loading = false
    
  }

  public showEventSubCategory(subCat: any){
    
    if( subCat._embedded.subtypes !== undefined &&
        subCat._embedded.subtypes.length == 1){
        
        this.apiSearch(subCat.name)
        return

    } else if( subCat._embedded.subgenres !== undefined &&
               subCat._embedded.subgenres.length == 1){

        this.apiSearch(subCat.name)
        return

    }

    subCat.show_sub_sub = !subCat.show_sub_sub

  }

  public showEventSub(classification: any){

    classification.show_sub = !classification.show_sub 

  }

  public apiSearch(keyword: string, resetEventSorter: boolean = false) {

    this.loading = true
    this.search_keyword = keyword

    keyword = encodeURIComponent(keyword)

    this.communityMemberList = []

    if(this.search_keyword !== keyword){

      this.totalResults = 0
      this.allPages = 0
      this.current_offset = 0
      this.around_me_search_page = 1
      this.searchResults = []

    }

    if(resetEventSorter){

      this.eventDateParam = undefined
      this.sortEventDate = 'none'

    }
    
    let apiUrl: string

    switch(this.searchCategory){

      case 'events':
        apiUrl = `size=2&latlong=${this.lat},${this.lng}&classificationName=${keyword}&radius=45&${this.eventDateParam}`      
        break

      case 'food':
      case 'shopping':
        apiUrl = `${this.searchApiUrl}?latitude=${this.lat}&longitude=${this.lng}&term=${keyword}&categories=${keyword}&${this.showOpenedParam}&radius=40000&sort_by=rating&limit=20&offset=${this.current_offset}` 

    }

    const searchObj = {
      config_url: apiUrl
    }
    
    const searchObjSb = {
      loc_x: this.lat,
      loc_y: this.lng,
      categories: keyword
    }

    switch(this.searchCategory){

      case 'events':

        //Retrieve the SpotBie Community Member Results
        this.locationService.getEvents(searchObj).subscribe(
          resp => {
            this.getEventsSearchCallback(resp)
          }
        )

        //Retrieve the SpotBie Community Member Results
        this.locationService.getSpotBieCommunityMemberList(searchObjSb).subscribe(
          resp => {
            this.getSpotBieCommunityMemberListCb(resp)
          }
        )

        break

      case 'food':
      case 'shopping':
        
        //Retrieve the thirst party API Yelp Results
        this.locationService.getBusinesses(searchObj).subscribe(
          resp => {
            this.getBusinessesSearchCallback(resp)
          }
        )    
        
        //Retrieve the SpotBie Community Member Results
        this.locationService.getSpotBieCommunityMemberList(searchObjSb).subscribe(
          resp => {
            this.getSpotBieCommunityMemberListCb(resp)
          }
        )

        break

    }

  }

  public openWelcome(){

    this.catsUp = false
    this.show_search_box = false 
    this.infoObject = null
    this.infoObjectWindow.open = false
    this.featureWrapper.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })

  }

  public sortingOrderClass(sorting_order: string){

    return new SortOrderPipe().transform(sorting_order)
    
  }

  public spawnCategories(obj: any): void {

    let category

    if(obj.category == undefined)
      category = obj
    else
      category = obj.category

    this.scrollMapAppAnchor.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })

    if(!this.locationFound){
      
      if(this.mobileStartLocation() == false) return

    } else if(this.showMobilePrompt)
      this.showMobilePrompt = false
    
    this.show_search_box = true

    this.zoom = 18 
    this.fitBounds = false
    
    this.map = true    

    if(this.searchResults.length == 0) this.showSearchResults = false

    if(category == this.searchCategory){

      this.catsUp = true
      return

    }    

    if(this.searchCategory !== undefined) this.previousSeachCategory = this.searchCategory

    this.searchCategory = category

    switch (category) {

      case 'food':

        this.searchApiUrl = YELP_BUSINESS_SEARCH_API
        this.searchCategoriesPlaceHolder = 'Search Places to Eat...'
        this.categories = this.food_categories
        break

      case 'shopping':

        this.searchApiUrl = YELP_BUSINESS_SEARCH_API
        this.searchCategoriesPlaceHolder = 'Search Shopping...'
        this.categories = this.shopping_categories
        break

      case 'events':

        this.event_categories = []
        this.searchCategoriesPlaceHolder = 'Search Events...' 
        this.categories = this.event_categories
        this.classificationSearch()
        return

    }

    this.catsUp = true

  }

  public cleanCategory(){

    if(this.searchCategory !== this.previousSeachCategory){

      this.searchResults = []

      switch (this.searchCategory) {

        case 'food':
        case 'shopping':

          this.type_of_info_object = "yelp_business"                          
          this.maxDistanceCap = 25
          break

        case 'events':

          this.type_of_info_object = "ticketmaster_events"                   
          this.maxDistanceCap = 45
          return

      }
      
    }

  }

  public goToQrCode(){
    //scroll to qr Code
    this.closeCategories()
    this.homeDashboard.scrollToQrAppAnchor()
  }

  public goToLp(){
    //scroll to loyalty points
    this.closeCategories()
    this.homeDashboard.scrollToLpAppAnchor()
  }

  public goToRewardMenu(){
    //scroll to reward menu
    this.closeCategories()
    this.homeDashboard.scrollToRewardMenuAppAnchor()
  }

  public closeCategories(): void {
    this.catsUp = false
  }

  public searchSpotBie(evt: any): void {

    this.search_keyword = evt.target.value

    const search_term = encodeURIComponent(evt.target.value)

    clearTimeout(this.finderSearchTimeout)

    this.finderSearchTimeout = setTimeout(function() {

      this.loading = true

      let api_url: string

      if (this.searchCategory == 'events') {
        
        //Used for loading events from ticketmaster API

        api_url = `size=20&latlong=${this.lat},${this.lng}&keyword=${search_term}&radius=45`       
        
        const search_obj = {
          config_url: api_url
        }
  
        this.locationService.getEvents(search_obj).subscribe(
          resp => {
            this.getEventsSearchCallback(resp)
          }
        )

      } else {

        //Used for loading places to eat and shopping from yelp
        api_url = `${this.searchApiUrl}
          ?latitude=${this.lat}
          &longitude=${this.lng}
          &term=${search_term}
          &${this.showOpenedParam}
          &radius=40000
          &sort_by=best_match
          &limit=20
          &offset=${this.current_offset}`

        const search_obj = {
          config_url: api_url
        }
  
        this.locationService.getBusinesses(search_obj).subscribe(
          resp => {
            this.getBusinessesSearchCallback(resp)
          }
        )

        const searchObjSb = {
          loc_x: this.lat,
          loc_y: this.lng,
          categories: this.search_keyword
        }    

        //Retrieve the SpotBie Community Member Results
        this.locationService.getSpotBieCommunityMemberList(searchObjSb).subscribe(
          resp => {
            this.getSpotBieCommunityMemberListCb(resp)
          }
        )

      }

    }.bind(this, search_term), 1500)

  }

  public displayPageNext(page: number){

    if( page < this.allPages )
      return {}
    else
      return { 'display' : 'none' }  

  }

  public displayPage(page: number){

    if( page > 0 )
      return {}
    else
      return { 'display' : 'none' }     

  }

  public goToPage(page: number){

    this.around_me_search_page = page

    this.current_offset = (this.around_me_search_page * this.itemsPerPage) - this.itemsPerPage

    this.apiSearch(this.search_keyword)

  }

  public loadMoreResults(action: number){

    switch(action){
      case 0:

        //previous
        if(this.around_me_search_page == 1)
          this.around_me_search_page = Math.ceil(this.totalResults / this.itemsPerPage)          
        else
          this.around_me_search_page--
        
        break

      case 1:

        //next
        if(this.around_me_search_page == Math.ceil(this.totalResults / this.itemsPerPage)){
          this.around_me_search_page = 1
          this.current_offset = 0
        } else          
          this.around_me_search_page++    
        
        break

    }

    this.current_offset = (this.around_me_search_page * this.itemsPerPage) - this.itemsPerPage

    this.apiSearch(this.search_keyword)

  }

  public hideSearchResults(): void {

    this.showSearchResults = !this.showSearchResults

  }

  public formatPhoneNumber(phoneNumberString) {

    const cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)

    if (match) {
      const intlCode = (match[1] ? '+1 ': '')
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
    }
    
    return null

  }

  public openSearchResult(search_result){
    //console.log('Open Reuslt ', search_result)
  }

  public dismissToast(evt: Event){
    this.toastHelper = false
  }

  public getMapWrapperClass(){
    
    if(this.showSearchResults)
      return 'spotbie-map sb-map-results-open'
    else
      return 'spotbie-map'

  }

  public getMapClass(){
    
    if(this.showSearchResults)
      return 'spotbie-agm-map sb-map-results-open'
    else{
      if(this.isMobile) return 'spotbie-agm-map sb-map-results-open'
      return 'spotbie-agm-map'    
    }
    
  }

  public getEventsSearchCallback (httpResponse: any): void {
    
    this.loading = false

    //console.log("TicketMaster Events", httpResponse)

    if(httpResponse.success){      

      this.totalResults = httpResponse.data.page.totalElements

      let event_object = httpResponse.data

      if(this.totalResults == 0 || event_object._embedded === undefined){

        this.showNoResultsBox = true
        this.loading = false
        this.searchResults = []
        return  

      } else {
      
        this.showNoResultsBox = false
        this.sortEventDate = 'none'
      
      }

      this.cleanCategory()

      window.scrollTo(0,0)
      
      this.showSearchResults = true
      this.catsUp = false  
      this.loading = false
  
      let event_object_list = event_object._embedded.events

      this.totalResults = event_object_list.length

      this.allPages = Math.ceil(this.totalResults / this.itemsPerPage)

      if(this.allPages == 0) this.allPages = 1

      for(let i = 0; i < event_object_list.length; i++){
        
        event_object_list[i].coordinates = {
          latitude: '',
          longitude: ''
        }

        event_object_list[i].coordinates.latitude = parseFloat(event_object_list[i]._embedded.venues[0].location.latitude)
        event_object_list[i].coordinates.longitude = parseFloat(event_object_list[i]._embedded.venues[0].location.longitude)

        event_object_list[i].icon = event_object_list[i].images[0].url

        event_object_list[i].image_url = this.ticketMasterLargestImage(event_object_list[i].images)

        event_object_list[i].type_of_info_object = "ticketmaster_event"

        let dt_obj = new Date(event_object_list[i].dates.start.localDate)

        let time_date = new DateFormatPipe().transform(dt_obj)
        let time_hr = new TimeFormatPipe().transform(event_object_list[i].dates.start.localTime)

        event_object_list[i].dates.start.spotbieDate = time_date
        event_object_list[i].dates.start.spotbieHour = time_hr
        
        this.searchResults.push(event_object_list[i])

      }

      this.sorting_order = 'desc'
      this.sortBy(0)

      this.searchCategorySorter = this.searchCategory

      this.searchResultsSubtitle = 'Events'
   
      this.searchResultsOriginal = this.searchResults
      
      this.showSearchResults = true

      this.spotbie_user_marker_info_window.open()

      this.displaySurroundingObjectList = false

      this.show_search_box = true

      this.loadedTotalResults = this.searchResults.length

      this.maxDistance = 45

    } else
      console.log("getEventsSearchCallback Error: ", httpResponse)

    this.loading = false

  }

  public ticketMasterLargestImage(imageList: any){

    let largestDimension = Math.max.apply(Math, imageList.map( 
      (image) => { return image.width; }
    ))
    
    let largestImage = imageList.find(
      (image) => { return image.width == largestDimension }
    )

    return largestImage.url

  }

  public getSpotBieCommunityMemberListCb(httpResponse: any){

    if(httpResponse.success){

      let communityMemberList: Array<Business> = httpResponse.data.data
      
      communityMemberList.forEach(business => {        

        business.type_of_info_object = 'spotbie_community'
        business.is_community_member = true

        if(business.photo == ''){

          switch(this.searchCategory){
            case 'food':
              business.photo = 'assets/images/home_imgs/find-places-to-eat.svg'
              break
      
            case 'shopping':
              business.photo = 'assets/images/home_imgs/find-places-for-shopping.svg'
              break
    
            case 'events':
              business.photo = 'assets/images/home_imgs/find-events.svg'
              
          }

        }

        business.categories = JSON.parse(
          business.categories.toString().replace(',', ', ')
        )

        business.rewardRate = (business.loyalty_point_dollar_percent_value / 100)

        this.communityMemberList.push(business)    

      })
      
      this.bottomAdBanner.switchAd()
      this.singleAdApp.switchAd()

    }

  }

  public getBusinessesSearchCallback(httpResponse: any): void {    

    this.loading = false
    this.maxDistanceCap = 25
    this.fitBounds = true

    if(httpResponse.success){

      this.totalResults = httpResponse.data.total

      if(this.totalResults == 0){
        this.showNoResultsBox = true
        return  
      } else
        this.showNoResultsBox = false

      window.scrollTo(0,0)

      this.cleanCategory()

      this.showSearchResults = true
      this.catsUp = false      

      let places_results = httpResponse.data

      this.populateYelpResults(places_results)

      this.spotbie_user_marker_info_window.open()

      this.searchCategorySorter = this.searchCategory

      this.displaySurroundingObjectList = false

      this.show_search_box = true

    } else
      console.log('Place Search Error: ', httpResponse)

  }

  private async populateYelpResults(data: any) {

    let results = data.businesses

    let i = 0
    let resultsToRemove = []

    results.forEach(business => {
      
      //Remove some banned yelp results.
      if(this.bannedYelpIDs.indexOf(business.id) > -1) resultsToRemove.push(i)

      business.rating_image = setYelpRatingImage(business.rating)

      business.type_of_info_object = this.type_of_info_object
      business.type_of_info_object_category = this.searchCategory
      
      business.is_community_member = false

      if (business.is_closed)
        business.is_closed_msg = 'Closed'
      else
        business.is_closed_msg = 'Open'

      if (business.price) business.price_on = '1'

      if (business.image_url == '') business.image_url = '0'

      let friendly_transaction = 'This place offers '

      business.transactions = business.transactions.sort()

      switch (business.transactions.length) {
        case 0:
          // console.log("single business Transaction ",  business.transactions)
          friendly_transaction = ''
          business.transactions_on = '0'
          break
        case 1:
        case 2:
        case 3:
          business.transactions_on = '1'            
          business.transactions = [business.transactions.slice(0, -1).join(', '), business.transactions.slice(-1)[0]].join(business.transactions.length < 2 ? '': ', and ')

          friendly_transaction = business.transactions.replace('restaurant_reservation', 'restaurant reservations')

          friendly_transaction = "This place offers " + friendly_transaction + '.'
          
          break
      }

      business.friendly_transactions = friendly_transaction

      business.distance = metersToMiles(business.distance)

      business.icon = business.image_url

      i++

    })

    for(let y = 0; y < resultsToRemove.length; y++){
      results.splice(resultsToRemove[y], 1)      
    }

    this.searchResultsOriginal = results

    results = results.filter((searchResult) => {
      return searchResult.distance < this.maxDistance
    })
    
    this.searchResults = results 

    if(this.sorting_order == 'desc') 
      this.sorting_order = 'asc' 
    else 
      this.sorting_order = 'desc'
    
    this.sortBy(this.sortAc)

    switch(this.searchCategory){
      case 'food':
        this.searchResultsSubtitle = 'Spots'
        break
      case 'shopping':
        this.searchResultsSubtitle = 'Shopping Spots'
        break     
    }

    this.loadedTotalResults = this.searchResults.length
    
    this.allPages = Math.ceil(this.totalResults / this.itemsPerPage)

    if(this.allPages == 0) this.allPages = 1

    if(this.loadedTotalResults > 1000){ 
      this.totalResults = 1000
      this.loadedTotalResults = 1000
      this.allPages = 20
    }    
    
  }

  public pullSearchMarker(infoObject: any): void {

    this.infoObjectWindow.open = true
    this.infoObject = infoObject

  }

  /**
   * Fucntion gets called when the navigator's GPS system has found the user's location.
   * @param position
   */
  public showPosition(position: any): void {
    
    this.locationFound = true
    this.displayLocationEnablingInstructions = false

    this.lat = position.coords.latitude
    this.lng = position.coords.longitude
    this.ogLat = position.coords.latitude
    this.ogLng = position.coords.longitude

    this.spotbie_map.triggerResize(true)

    if(this.firstTimeShowingMap){
      this.firstTimeShowingMap = false
      this.drawPosition()
    }

    this.showMobilePrompt2 = false
    //this.loading = false

  }

  public drawPosition(){
    this.iconUrl = this.user_default_image
    this.saveUserLocation()
  }

  public pullMarker(mapObject: any): void {

    this.currentMarker = mapObject
    this.sliderRight = true

  }

  public getSingleCatClass(i){
    if(i % 2 == 0)
      return 'spotbie-single-cat'
    else 
      return 'spotbie-single-cat single-cat-light'
  }

  public selfMarker(): void {

    this.currentMarker = { 
      user_web_options: { bg_color:  this.bg_color },
      user_info: { 
        exe_username: this.spotbie_username, 
        exe_user_default_picture: localStorage.getItem('spotbie_userDefaultImage')
      } 
    }

    this.sliderRight = true

  }

  public closeMarkerOverlay(): void {

    this.sliderRight = false

  }
  
  public saveUserLocation(): void {

    const save_location_obj = { 
      loc_x: this.lat,
      loc_y: this.lng
    }

    if(this.isLoggedIn === '1'){

      this.locationService.saveCurrentLocation(save_location_obj).subscribe(
        resp => {
          this.saveCurrentLocationCallback(resp) 
        },
        error =>{
          console.log("saveAndRetrieve Error", error)
        }
      )

    } else 
      this.retrieveSurroudings()

  }

  public saveCurrentLocationCallback(resp: any): void {

    if(resp.message == 'success')
      this.retrieveSurroudings()
    else 
      console.log("saveCurrentLocationCallback Error", resp)

  }

  public retrieveSurroudings(){

    const retrieveSurroundingsObj = { 
      loc_x: this.lat,
      loc_y: this.lng,
      search_type: this.current_search_type 
    }

    this.locationService.retrieveSurroudings(retrieveSurroundingsObj).subscribe(

      resp => {
        this.retrieveSurroudingsCallback(resp) 
      },
      error =>{
        console.log("saveAndRetrieve Error", error)
      }

    )

  }

  public retrieveSurroudingsCallback(resp: any){
    
    const surroundingObjectList = resp.surrounding_object_list

    const totalObjects = surroundingObjectList.length

    if (totalObjects === undefined) return

    let i = 0
    
    for (let k = 0; k < totalObjects; k++) {

      i++

      const coords = this.getNewCoords(surroundingObjectList[k].loc_x, surroundingObjectList[k].loc_y, i, totalObjects)

      surroundingObjectList[k].loc_x = coords.lat
      surroundingObjectList[k].loc_y = coords.lng
      
      if(surroundingObjectList[k].ghost_mode == 1){

        surroundingObjectList[k].default_picture = "assets/images/ghost_white.jpg"
        surroundingObjectList[k].username = "User is a Ghost"
        surroundingObjectList[k].description = "This user is a ghost. Ghost Users are not able to be befriended and their profiles remain hidden."

      } else
        surroundingObjectList[k].description = unescape(surroundingObjectList[k].description)

      surroundingObjectList[k].map_icon = this.mapIconPipe.transform(surroundingObjectList[k].default_picture)

    }

    this.loading = false
    this.showMobilePrompt2 = false
    this.createObjectMarker(surroundingObjectList)

  }

  public getMapPromptMobileClass(){

    if(this.isMobile)
      return 'map-prompt-mobile align-items-center justify-content-center'
    else
      return 'map-prompt-mobile align-items-center'

  }

  public getMapPromptMobileInnerWrapperClassOne(){
    
    if(this.isMobile) return 'map-prompt-v-align mt-2'
    
  }

  public createObjectMarker(surroundingObjectList): void {
    this.surroundingObjectList = surroundingObjectList
  }

  public getNewCoords(x, y, i, f): any {

    // Gives the current position an alternate coordina
    // i is the current item
    // f is the total items

    let radius = null

    if (this.n2_x - this.n3_x == 0) {

      radius = this.rad_1 + this.rad_11
      this.rad_1 = radius
      this.n2_x = 0
      this.n3_x = this.n3_x + 7

    } else
      radius = this.rad_1

    this.n2_x = this.n2_x + 1

    const angle = (i / this.n3_x) * Math.PI * 2
    x = this.lat + Math.cos(angle) * radius
    y = this.lng + Math.sin(angle) * radius

    const p = { lat: x , lng: y }
    return p

  }

  public closeSearchResults(){

    this.closeCategories()
    this.showSearchResults = false
    this.displaySurroundingObjectList = true
    this.show_search_box = false
    this.map = false

  }

  public myFavorites(): void{
    this.myFavoritesWindow.open = true
  }

  public closeFavorites():  void{
    this.myFavoritesWindow.open = false
  }

  public promptForLocation(){

    if(this.isDesktop) 
      this.acceptLocationPrompt()

  }

  public openBusinessSettings(){

    this.openBusinessSettingsEvt.emit()

  }

  public acceptLocationPrompt(){

    localStorage.setItem('spotbie_locationPrompted', '0')
    this.startLocation()

  }
  
  public showMapError(){
    this.displayLocationEnablingInstructions = true
    this.map = false
    this.loading = false
    this.closeCategories()
    this.cleanCategory()
  }

  public mobileStartLocation(): boolean{
    
    this.loading = true 

    if (window.navigator.geolocation){

      window.navigator.geolocation.getCurrentPosition(
        this.showPosition.bind(this), 
        (err) =>{
          console.log("map err", err)
          this.showMapError()
          return false
        }
      )

    } else {
      this.showMapError()
      return false
    }

    this.showMobilePrompt = false
    this.showMobilePrompt2 = true
    
    return true

  }

  public startLocation(){
    
    if(this.isLoggedIn == '1' && !this.business)
      this.spawnCategories( { category: 'food' } )     
  
  }

  public signUp(){
    this.signUpEvt.emit()
  }

  ngOnInit() {

    this.isDesktop = this.deviceService.isDesktop()
    this.isTablet = this.deviceService.isTablet()
    this.isMobile = this.deviceService.isMobile()

    if (this.isDesktop || this.isTablet)
      this.rad_11 =  0.00002
    else
      this.rad_11 =  0.000014
    
    this.rad_1 = this.rad_11    

  }

  ngAfterViewInit() {
    
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn')
    this.bg_color = localStorage.getItem('spotbie_backgroundColor')
    this.user_default_image = localStorage.getItem('spotbie_userDefaultImage')
    this.spotbie_username = localStorage.getItem('spotbie_userLogin')    

    if(this.isLoggedIn !== '1'){
      this.user_default_image = 'assets/images/guest-spotbie-user-01.svg'
      this.spotbie_username = 'Guest'      
      this.bg_color = '#353535'
    }
    
    this.promptForLocation()

  }
}
