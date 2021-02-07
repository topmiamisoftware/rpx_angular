import { Component, OnInit, ViewChild } from '@angular/core'
import { LocationService } from '../../location-service/location.service'
import { DeviceDetectorService } from 'ngx-device-detector'
import { AgmMap, AgmInfoWindow } from '@agm/core'
import * as mobile_js_i from '../../../assets/scripts/mobile_interface.js'
import * as cordovaFunctions from '../../helpers/cordova/cordova-variables.js'
import { MapObjectIconPipe } from '../../pipes/map-object-icon.pipe'
import * as map_extras from './map_extras/map_extras'
import { ToastRequest } from 'src/app/helpers/toast-helper/toast-models/toast-request'
import { DateFormatPipe, TimeFormatPipe } from 'src/app/pipes/date-format.pipe'
import { MatSliderChange } from '@angular/material/slider'
import { Subscription } from 'rxjs'
import { ColorsService } from '../spotbie-logged-in/background-color/colors.service'
import { metersToMiles, setYelpRatingImage } from 'src/app/helpers/info-object-helper'
import { SwiperOptions } from 'swiper'

const YELP_BUSINESS_SEARCH_API = 'https://api.yelp.com/v3/businesses/search'

const SLIDE_SHOW_SOURCES = [
  "assets/spotbie-the-new-social-network.jpg",
  "assets/images/home_imgs/png/providing-you-places-to-eat-around-you.jpg",
  "assets/images/home_imgs/jpg/find_events_around.jpg",
  "assets/images/home_imgs/png/providing-you-places-to-shop-around-you.jpg",
  "assets/images/home_imgs/png/find-and-make-new-friends.jpg",
];

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @ViewChild('spotbie_map') spotbie_map: AgmMap

  @ViewChild('spotbie_user_marker_info_window') spotbie_user_marker_info_window: AgmInfoWindow

  public isLoggedIn: string

  public map_zoom = 32
  public lat: number
  public lng: number
  public ogLat: number
  public ogLng: number
  public iconUrl:  string
  public user_default_image: string

  public locationFound: boolean = false

  public current_search_type= '0'

  private n2_x = 0
  private n3_x = 7
  private rad_11 = null
  private rad_1 = null
  
  public surrounding_object_list = new Array()

  public sliderRight: boolean = false

  public currentMarker: any

  public spotbie_username: string

  public bg_color: string

  public searchResults = new Array()

  public categories

  public searchResultsSubtitle: string

  public sort_by_txt: string = "Rating"

  public catsUp = false

  public show_next_page_button: boolean = false 

  public subCategory = {
    food_sub: { open: false},
    media_sub: { open: false},
    artist_sub: { open: false},
    place_sub: { open: false}
  }

  public showSearchResults: boolean

  public show_search_box: boolean

  public search_categories_placeholder: string

  public sorting_order: string = 'asc'

  private finder_search_timeout

  public search_category: string
 
  public previousSeachCategory: string

  public searchCategorySorter: string

  public loading: boolean = false

  private searchResultsOriginal: Array<any> = []

  public no_results = false

  public search_api_url

  public isAndroid: boolean = false

  public isIphone: boolean = false
  
  public coming_soon_ov: boolean = false

  public coming_soon_ov_title: string = ""
  public coming_soon_ov_text: string = ""

  public infoObject

  public infoObjectWindow = { open: false }

  public type_of_info_object: string

  public event_categories
  public food_categories = map_extras.FOOD_CATEGORIES
  public shopping_categories = map_extras.SHOPPING_CATEGORIES
  public map_styles = map_extras.MAP_STYLES

  public search_keyword: string

  public around_me_search_page: number = 1

  public toastHelper: boolean = false

  public loadedTotalResults: number = 0

  public allPages: number = 0

  public maxDistanceCap: number = 45

  public displaySurroundingObjectList: boolean = true

  public toastHelperConfig: ToastRequest = {
    type: "acknowledge",
    text: {
      info_text: "There are no events in this category.",
      confirm: null,
      decline: null,
    },
    actions: {
      confirm: null,
      decline: null,
      acknowledge: this.dismissToast.bind(this)
    }
  }

  public maxDistance: number = 10

  public totalResults: number = 0

  public current_offset: number = 0

  public update_distance_timeout: any

  public itemsPerPage: number = 0

  public web_options_subscriber: Subscription

  public myFavoritesWindow = { open : false }

  public myPlacesWindow = { open : false }

  public locationPrompt: boolean = false

  public showNoResultsBox: boolean = false

  public isCordova: string

  public showMobilePrompt: boolean = false
  public showMobilePrompt2: boolean = false

  public firstTimeShowingMap: boolean = true

  public slideShowSources = [
    { imageUrl: "assets/images/spotbie-the-new-social-network.jpg", text: "Start Exploring"},
    { imageUrl: "assets/images/home_imgs/png/providing-you-places-to-eat-around-you.jpg", text: "Places to Eat"},
    { imageUrl: "assets/images/home_imgs/jpg/find_events_around.jpg", text: "Events Near You"},
    { imageUrl: "assets/images/home_imgs/png/providing-you-places-to-shop-around-you.jpg", text: "Retail Shops"},
    { imageUrl: "assets/images/home_imgs/png/find-and-make-new-friends.jpg", text: "Users Around You"}
  ];

  public swiperConfig: SwiperOptions = {
    pagination: { el: '.swiper-pagination', clickable: true },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    spaceBetween: 0
  }

  constructor(private locationService: LocationService,
              private deviceService: DeviceDetectorService,
              private webOptionsService: ColorsService,
              private mapIconPipe: MapObjectIconPipe) { }

  public spotMe() {

    this.closeSearchResults()

    this.displaySurroundingObjectList = true
    this.n2_x = 0
    this.n3_x = 7
    this.rad_1 = this.rad_11
    this.surrounding_object_list = []

    this.drawPosition()

  }
  
  private peopleSearch() {
    this.surrounding_object_list = []
    this.drawPosition()
  }

  public distanceSortAsc(a, b) {
    a = parseFloat(a.distance)
    b = parseFloat(b.distance)
    return a > b ? 1: b > a ? -1: 0
  }

  public distanceSortDesc(a, b) {
    a = parseFloat(a.distance)
    b = parseFloat(b.distance)
    return a > b ? -1: b > a ? 1: 0
  }

  public ratingSortAsc(a, b) {
    a = a.rating
    b = b.rating
    return a > b ? 1: b > a ? -1: 0
  }

  public ratingSortDesc(a, b) {
    a = a.rating
    b = b.rating
    return a > b ? -1: b > a ? 1: 0
  }

  public reviewsSortAsc(a, b) {
    a = a.review_count
    b = b.review_count
    return a > b ? 1: b > a ? -1: 0
  }

  public reviewsSortDesc(a, b) {
    a = a.review_count
    b = b.review_count
    return a > b ? -1: b > a ? 1: 0
  }

  public priceSortAsc(a, b) {
    a = a.price
    b = b.price

    if (a === undefined) { return -1 } else if (b === undefined) { return 1 }
    return a.length > b.length ? 1: b.length > a.length ? -1: 0
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

  public updateDistance(evt: MatSliderChange): void{
    
    clearTimeout(this.update_distance_timeout)

    this.update_distance_timeout = setTimeout(function(){

      this.maxDistance = evt.value

      if(this.showNoResultsBox){
        this.apiSearch(this.search_keyword)
      } else {
        let results = this.searchResultsOriginal.filter((search_result) => {
          return search_result.distance < this.maxDistance
        })
    
        this.loadedTotalResults = results.length
    
        this.searchResults = results
      }

    }.bind(this), 500)

  }

  public sortBy(ac: number) {

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
    }

    if (ac != 4 && ac != 5 && ac != 6) {

      if (this.sorting_order == 'desc') {
        this.sorting_order = 'asc'
      } else {
        this.sorting_order = 'desc'
      }

    }
    
    //console.log("Search Results ", this.searchResults)

    switch (ac) {
      case 0:
        // sort by distance
        if (this.sorting_order == 'desc') { this.searchResults = this.searchResults.sort(this.distanceSortDesc) } else { this.searchResults = this.searchResults.sort(this.distanceSortAsc) }
        break
      case 1:
        // sort by rating
        if (this.sorting_order == 'desc') { this.searchResults = this.searchResults.sort(this.ratingSortDesc) } else { this.searchResults = this.searchResults.sort(this.ratingSortAsc) }
        break
      case 2:
        // sort by reviews
        if (this.sorting_order == 'desc') { this.searchResults = this.searchResults.sort(this.reviewsSortDesc) } else { this.searchResults = this.searchResults.sort(this.reviewsSortAsc) }
        break
      case 3:
        // sort by price
        if (this.sorting_order == 'desc') { this.searchResults = this.searchResults.sort(this.priceSortDesc) } else { this.searchResults = this.searchResults.sort(this.priceSortAsc) }
        break
      case 4:
        // sort by delivery
        this.deliverySort()
        break
      case 5:
        // sort by pick up
        this.pickUpSort()
        break
      case 6:
        // sort by reservation
        this.reservationSort()
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

    //console.log("Classification Seach Response", httpResponse)
    this.loading = false
    
  }

  public showEventSubCategory(subCat: any){
    
    //console.log("Sub Cat ", subCat)

    if(subCat._embedded.subtypes !== undefined &&
      subCat._embedded.subtypes.length == 1){
        
        this.apiSearch(subCat.name)
        return

    } else if(subCat._embedded.subgenres !== undefined &&
      subCat._embedded.subgenres.length == 1){

        this.apiSearch(subCat.name)
        return

    }

    subCat.show_sub_sub = !subCat.show_sub_sub

  }

  public showEventSub(classification: any){
    classification.show_sub = !classification.show_sub 
  }

  public apiSearch(keyword: string) {

    // console.log("category ", category)

    this.loading = true
    this.search_keyword = keyword
    keyword = encodeURIComponent(keyword)

    if(this.search_keyword !== keyword){
      this.totalResults = 0
      this.allPages = 0
      this.current_offset = 0
      this.around_me_search_page = 1
      this.searchResults = []
    }

    let api_url: string
    let search_obj: any

    switch(this.search_category){
      case 'events':
        api_url = 'size=2&latlong=' + this.lat + ',' + this.lng + '&classificationName=' + keyword + '&radius=45'      
        break
      case 'food':
      case 'shopping':
        api_url = this.search_api_url + '?latitude=' + this.lat + '&longitude=' + this.lng + '&term=' + keyword + '&categories=' + keyword + 
        '&radius=40000&sort_by=rating&limit=50&offset=' + this.current_offset 
    }

    search_obj = {
      config_url: api_url
    }
    
    switch(this.search_category){
      case "events":
        this.locationService.getEvents(search_obj).subscribe(
          resp => {
            this.getEventsSearchCallback(resp)
          }
        )
        break
      case "food":
      case "shopping":
        this.locationService.getBusinesses(search_obj).subscribe(
          resp => {
            this.getBusinessesSearchCallback(resp)
          }
        )        
        break
    }

  }

  public spawnCategories(category: string): void {

    this.show_search_box = true

    if(category == this.search_category){
      this.catsUp = true
      return
    }

    this.loading = true

    if(this.search_category !== undefined) this.previousSeachCategory = this.search_category

    this.search_category = category

    switch (category) {
      case 'food':
        this.search_api_url = YELP_BUSINESS_SEARCH_API
        this.search_categories_placeholder = 'Search Food Spots...'
        this.categories = this.food_categories   
        break
      case 'shopping':
        this.search_api_url = YELP_BUSINESS_SEARCH_API
        this.search_categories_placeholder = 'Search Shop Spots...'
        this.categories = this.shopping_categories
        break
      case 'events':
        this.event_categories = []
        this.search_categories_placeholder = 'Search Events Nearby...' 
        this.categories = this.event_categories
        this.classificationSearch()
        return
    }

    this.catsUp = true
    this.loading = false

  }

  public cleanCategory(){

    if(this.search_category !== this.previousSeachCategory){

      this.searchResults = []

      switch (this.search_category) {
        case 'food':
          this.type_of_info_object = "yelp_business"             
          this.maxDistanceCap = 25
          this.itemsPerPage = 50
          break
        case 'shopping':
          this.type_of_info_object = "yelp_business"                          
          this.maxDistanceCap = 25
          this.itemsPerPage = 50
          break
        case 'events':
          this.type_of_info_object = "ticketmaster_events"                   
          this.maxDistanceCap = 45
          this.itemsPerPage = 20
          return
      }
      
    }

  }

  public closeCmS(): void{
    this.coming_soon_ov_title = ''
    this.coming_soon_ov_text = ''
    this.coming_soon_ov = false
  }

  public closeCategories(): void {
    this.catsUp = false
  }

  public searchSpotBie(evt: any): void {
    
    // console.log("category ", category)

    this.search_keyword = evt.target.value

    const search_term = encodeURIComponent(evt.target.value)

    clearTimeout(this.finder_search_timeout)

    this.finder_search_timeout = setTimeout(function() {

      this.loading = true

      let api_url: string

      if (this.search_category == 'events') {
        
        api_url = `size=20&latlong=${this.lat},${this.lng}&keyword=${search_term}&radius=45`

        const search_obj = {
          config_url: api_url
        }
  
        this.locationService.getEvents(search_obj).subscribe(
          resp => {
            this.getEvents.getEventsSearchCallback(resp)
          }
        )

      } else {

        api_url = `${this.search_api_url}?latitude=${this.lat}&longitude=${this.lng}&term=${search_term}&categories=${this.search_category}&radius=40000&sort_by=distance&limit=50&offset=${this.current_offset}`

        const search_obj = {
          config_url: api_url
        }
  
        this.locationService.getBusinesses(search_obj).subscribe(
          resp => {
            this.getBusinessesSearchCallback(resp)
          }
        )

      }

    }.bind(this, search_term), 3000)


  }

  public loadMoreResults(action: number){

    switch(action){
      case 0:

        //previous
        if(this.around_me_search_page == 1){
          this.around_me_search_page = Math.ceil(this.totalResults / this.itemsPerPage)          
        } else {
          this.around_me_search_page--
        }
        
        break

      case 1:

        //next
        if(this.around_me_search_page == Math.ceil(this.totalResults / this.itemsPerPage)){
          this.around_me_search_page = 1
          this.current_offset = 0
        } else {          
          this.around_me_search_page++          
        }
        
        break

    }

    this.current_offset = (this.around_me_search_page * this.itemsPerPage) - this.itemsPerPage

    //console.log("current offset", this.current_offset)
    //console.log("search page", this.around_me_search_page)

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

  public getEventsSearchCallback (httpResponse: any): void {
    
    this.loading = false

    if(httpResponse.success){      

      this.totalResults = httpResponse.data.page.totalElements

      if(this.totalResults == 0){
        this.showNoResultsBox = true
        return  
      } else {
        this.showNoResultsBox = false
      }

      this.cleanCategory()

      window.scrollTo(0,0)
      
      let event_object = httpResponse.data
      
      if(event_object._embedded === undefined){
        this.toastHelper = true
        this.loading = false
        return
      }

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

        event_object_list[i].image_url = event_object_list[i].images[8].url
        
        event_object_list[i].type_of_info_object = "ticketmaster_event"

        let dt_obj = new Date(event_object_list[i].dates.start.localDate)

        let time_date = new DateFormatPipe().transform(dt_obj)
        let time_hr = new TimeFormatPipe().transform(event_object_list[i].dates.start.localTime)

        event_object_list[i].dates.start.spotbieDate = time_date
        event_object_list[i].dates.start.spotbieHour = time_hr
        
        this.searchResults.push(event_object_list[i])

      }

      this.searchCategorySorter = this.search_category

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

  public getBusinessesSearchCallback(httpResponse: any): void {    

    this.loading = false
    this.maxDistanceCap = 25

    if(httpResponse.success){

      this.totalResults = httpResponse.data.total

      if(this.totalResults == 0){
        this.showNoResultsBox = true
        return  
      } else {
        this.showNoResultsBox = false
      }

      window.scrollTo(0,0)

      this.cleanCategory()

      this.showSearchResults = true
      this.catsUp = false      

      let places_results = httpResponse.data

      this.populateYelpResults(places_results)

      this.spotbie_user_marker_info_window.open()

      this.searchCategorySorter = this.search_category

      this.displaySurroundingObjectList = false

      this.show_search_box = true

    } else
      console.log('Place Search Error: ', httpResponse)

  }

  private populateYelpResults(data: any): void{

    let results = data.businesses
    
    results.forEach(business => {

      business.rating_image = setYelpRatingImage(business.rating)
      business.type_of_info_object = this.type_of_info_object
      business.type_of_info_object_category = this.search_category

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

    })

    this.searchResultsOriginal = results

    results = results.filter((searchResult) => {
      return searchResult.distance < this.maxDistance
    })

    switch(this.search_category){
      case 'food':
        this.searchResultsSubtitle = 'Spots'
        break
      case 'shopping':
        this.searchResultsSubtitle = 'Shopping Spots'
        break     
    }

    this.searchResults = results  
    this.loadedTotalResults = this.searchResults.length
    
    this.allPages = Math.ceil(this.totalResults / this.itemsPerPage)

    if(this.allPages == 0) this.allPages = 1

    if(this.loadedTotalResults > 1000){ 
      this.totalResults = 1000
      this.loadedTotalResults = 1000
      this.allPages = 20
    }

    if(this.loadedTotalResults > (this.around_me_search_page * this.itemsPerPage)){
      this.show_next_page_button = true        
    }

  }

  public pullSearchMarker(infoObject: any): void {
    this.infoObjectWindow.open = true
    this.infoObject = infoObject
  }

  public showPosition(position: any ): void {
    
    this.locationFound = true

    this.lat = position.coords.latitude
    this.lng = position.coords.longitude
    this.ogLat = position.coords.latitude
    this.ogLng = position.coords.longitude

    if(this.firstTimeShowingMap){
      this.firstTimeShowingMap = false
      this.drawPosition()
    }

  }

  public drawPosition(){
    this.iconUrl = this.mapIconPipe.transform(this.user_default_image)
    this.saveUserLocation()
  }

  public pullMarker(mapObject: any): void {
    this.currentMarker = mapObject
    this.sliderRight = true
  }

  public selfMarker(): void {

    this.currentMarker = { user_web_options: { bg_color:  this.bg_color },
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

    } else {

      this.retrieveSurroudings()

    }

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
    
    const surrounding_object_list = resp.surrounding_object_list

    const total_objects = surrounding_object_list.length

    if (total_objects === undefined) return

    let i = 0
    
    for (let k = 0; k < total_objects; k++) {

      i++

      const coords = this.getNewCoords(surrounding_object_list[k].loc_x, surrounding_object_list[k].loc_y, i, total_objects)
      surrounding_object_list[k].loc_x = coords.lat
      surrounding_object_list[k].loc_y = coords.lng
      
      if(surrounding_object_list[k].ghost_mode == 1){

        surrounding_object_list[k].default_picture = "assets/images/ghost_white.jpg"
        surrounding_object_list[k].username = "User is a Ghost"
        surrounding_object_list[k].description = "This user is a ghost. Ghost Users are not able to be befriended and their profiles remain hidden. Who is this person then? Well... maybe you'll get to find out if they befriend you. Ghost Users normally have less friends than non-Ghost Users due to their profile's low visibility."

      } else {

        surrounding_object_list[k].description = unescape(surrounding_object_list[k].description)

      }

      surrounding_object_list[k].map_icon = this.mapIconPipe.transform(surrounding_object_list[k].default_picture)

    }

    this.loading = false
    this.createObjectMarker(surrounding_object_list)
    //console.log("Sorrounding Objects: ", surrounding_object_list)

  }

  public createObjectMarker(surrounding_object_list): void {
    this.surrounding_object_list = surrounding_object_list
  }

  public getNewCoords(x, y, i, f): any {
      // Gives the current position a drivative
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

  public mediaSearch(action): void {
    //this.host.mediaPlayerWindow.open = true
    this.coming_soon_ov = true

    this.coming_soon_ov_title = "SpotBie Media Search Coming Soon"
    this.coming_soon_ov_text = "SpotBie Media Search will allow users to find uploaded media locally. (Songs, Videos, Books, Etc.)"    
  }

  public artistSearch(action) {
    //this.host.mediaPlayerWindow.open = true
    this.coming_soon_ov = true

    this.coming_soon_ov_title = "SpotBie Content Creator Search Coming Soon"
    this.coming_soon_ov_text = "SpotBie Content Creator Search will allow users to find content creators locally. (Artists, Producers, Bloggers, Etc.)"    
  }

  public placeSearch() {

    this.myPlacesWindow.open = true  

  }

  public closeSearchResults(){
    this.closeCategories()
    this.displaySurroundingObjectList = true
    this.show_search_box = false
  }

  public myFavorites(): void{
    
    this.myFavoritesWindow.open = true

  }

  public promptForLocation(){

    let locationPrompted = localStorage.getItem('spotbie_locationPrompted');

    if (locationPrompted == '1') {
      this.startLocation() 
     } else {
      this.locationPrompt = true
     } 

  }

  public acceptLocationPrompt(){

    this.locationPrompt = false
    localStorage.setItem('spotbie_locationPrompted', '1')
    this.startLocation()

  }

  public mobilePrompt2Toggle(){

    this.loading = true
    this.showMobilePrompt2 = false

  }

  public mobileStartLocation(){
    
    if (window.navigator.geolocation) window.navigator.geolocation.getCurrentPosition(this.showPosition.bind(this)) 
  
    this.showMobilePrompt = false
    this.showMobilePrompt2 = true
  
  }

  public androidMobileStartLocation(){

    cordovaFunctions.getGeolocation(
      this.showPosition.bind(this),
      function(){
        alert("SpotBie needs your location in to find what's around you.")
      }      
    )
    
    this.showMobilePrompt = false
    this.showMobilePrompt2 = false

  }
  
  public startLocation(){

    this.showMobilePrompt = true
    
    this.web_options_subscriber = this.webOptionsService.getWebOptions().subscribe(web_options =>{

      if(web_options.bg_color) this.bg_color = web_options.bg_color

    })

  }

  ngOnInit() {

    if (this.deviceService.isDesktop || this.deviceService.isTablet)
      this.rad_11 =  0.00002
    else
      this.rad_11 =  0.000014
    
    this.rad_1 = this.rad_11

  }

  ngAfterViewInit() {
    
    this.isCordova = localStorage.getItem('isCordova')
    
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn')
    this.bg_color = localStorage.getItem('spotbie_backgroundColor')
    this.user_default_image = localStorage.getItem('spotbie_userDefaultImage')
    this.spotbie_username = localStorage.getItem('spotbie_userLogin')

    if(this.isLoggedIn !== '1'){
      this.user_default_image = 'https://api.spotbie.com/defaults/user.png'
      this.spotbie_username = 'Guest'      
      this.bg_color = '#353535'
    }
    
    this.isAndroid = mobile_js_i.android_i
    this.isIphone = mobile_js_i.iphone_i
    
    this.promptForLocation()

  }
}
