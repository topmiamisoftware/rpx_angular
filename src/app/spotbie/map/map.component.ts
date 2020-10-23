import { Component, OnInit, ViewChild } from '@angular/core'
import { LocationService } from '../../location-service/location.service'
import { HttpResponse } from '../../models/http-reponse'
import { DeviceDetectorService } from 'ngx-device-detector'
import { AgmMap, AgmInfoWindow } from '@agm/core'
import * as mobile_js_i from '../../../assets/scripts/mobile_interface.js'
import { Router } from '@angular/router'
import { MapObjectIconPipe } from '../../pipes/map-object-icon.pipe'
import * as map_extras from './map_extras/map_extras'
import { ToastRequest } from 'src/app/helpers/toast-helper/toast-models/toast-request'
import { DateFormatPipe, TimeFormatPipe } from 'src/app/pipes/date-format.pipe'
import { MatSliderChange } from '@angular/material/slider'
import { Subscription } from 'rxjs'
import { ColorsService } from '../spotbie-logged-in/background-color/colors.service'

const YELP_BUSINESS_SEARCH_API = 'https://api.yelp.com/v3/businesses/search'

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

  public searchCategorySorter: string

  public loading: boolean = false

  private searchResultsOriginal: Array<any> = []

  public no_results = false

  public search_api_url

  public is_android: boolean

  public is_iphone: boolean
  
  public coming_soon_ov: boolean = false

  public coming_soon_ov_title: string = ""
  public coming_soon_ov_text: string = ""

  public infoObject

  public infoObjectWindow = { open: false}

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

  constructor(private locationService: LocationService,
              private deviceService: DeviceDetectorService,
              private router: Router,
              private webOptionsService: ColorsService,
              private mapIconPipe: MapObjectIconPipe) { }

  public spotMe() {

    this.closeSearchResults()

    this.displaySurroundingObjectList = true
    this.n2_x = 0
    this.n3_x = 7
    this.rad_1 = this.rad_11
    this.surrounding_object_list = []

    if (window.navigator.geolocation) { window.navigator.geolocation.getCurrentPosition(this.showPosition.bind(this)) }

  }
  
  private peopleSearch() {
    this.surrounding_object_list = []
    if (window.navigator.geolocation) { window.navigator.geolocation.getCurrentPosition(this.showPosition.bind(this)) }
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

      let results = this.searchResultsOriginal.filter((search_result) => {
        return search_result.distance < this.maxDistance
      })
  
      this.loaded_totalResults = results.length
  
      this.searchResults = results

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

      let classifications: any = httpResponse.data._embedded.classifications
      
      classifications.forEach(classification => {

        if(classification.type && classification.type.name && classification.type.name !== "Undefined"){

          classification.name = classification.type.name        

        } else if(classification.segment && classification.segment.name && classification.segment.name !== "Undefined"){

          classification.name = classification.segment.name

          classification.segment._embedded.genres.forEach(genre => {
            genre.show_sub_sub = false
          });          

        }

        if(classification.name !== undefined){
          classification.show_sub = false
          this.event_categories.push(classification)
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
    let search_action: string
    let search_obj: any

    switch(this.search_category){
      case 'events':
        api_url = 'size=20&latlong=' + this.lat + ',' + this.lng + '&classificationName=' + keyword + '&radius=45'      
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

    this.search_category = category
    
    switch (category) {
      case 'food':
        this.search_api_url = YELP_BUSINESS_SEARCH_API
        this.type_of_info_object = "yelp_business"
        this.categories = this.food_categories        
        this.search_categories_placeholder = 'Search Food Spots...'
        this.maxDistanceCap = 25
        this.itemsPerPage = 50
        break
      case 'shopping':
        this.search_api_url = YELP_BUSINESS_SEARCH_API
        this.type_of_info_object = "yelp_business"        
        this.categories = this.shopping_categories
        this.search_categories_placeholder = 'Search Shop Spots...'
        this.maxDistanceCap = 25
        this.itemsPerPage = 50
        break
      case 'events':
        this.type_of_info_object = "ticketmaster_events"
        this.search_categories_placeholder = 'Search Events Nearby...'
        this.event_categories = []
        this.categories = this.event_categories
        this.maxDistanceCap = 45
        this.itemsPerPage = 20
        this.classificationSearch()
        return
    }

    this.catsUp = true
    this.loading = false

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
      let search_action: string

      if (this.search_category == 'events') {
        api_url = 'size=20&latlong=' + this.lat + ',' + this.lng + '&keyword=' + search_term + '&radius=45'
        search_action = 'ticketMasterEventSearch'
      } else {
        api_url = this.search_api_url + '?latitude=' + this.lat + '&longitude=' + this.lng + '&term=' + search_term +
        '&categories=' + this.search_category + '&radius=40000&sort_by=distance&limit=50&offset=' + this.current_offset
        search_action = 'yelpBusinessSearch'
      }

      const search_obj = {
        config_url: api_url
      }
 
      this.locationService.getBusinesses(search_obj).subscribe(
        resp => {
          this.getBusinessesSearchCallback(resp)
        }
      )

    }.bind(this, search_term), 1000)

  }

  public loadMoreResults(action: number){

    switch(action){
      case 0:

        //previous
        if(this.around_me_search_page == 1){
          this.around_me_search_page = Math.floor(this.totalResults / this.itemsPerPage)          
        } else {
          this.around_me_search_page--
        }
        
        break

      case 1:

        //next
        if(this.around_me_search_page == Math.floor(this.totalResults / this.itemsPerPage)){
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

  public metersToMiles(m) {
    const miles: number = 0.00062137 * m
    const miles_fixed = miles.toPrecision(2)
    return miles_fixed
  }

  public setYelpRatingImage(rating: number) {

    let rating_image

    if (rating == 0) {
      rating_image = 'regular_0.png'
    } else if (rating == 1) {
      rating_image = 'regular_1.png'
    } else if (rating == 1.5) {
      rating_image = 'regular_1_half.png'
    } else if (rating == 2) {
      rating_image = 'regular_2.png'
    } else if (rating == 2.5) {
      rating_image = 'regular_2_half.png'
    } else if (rating == 3) {
      rating_image = 'regular_3.png'
    } else if (rating == 3.5) {
      rating_image = 'regular_3_half.png'
    } else if (rating == 4) {
      rating_image = 'regular_4.png'
    } else if (rating == 4.5) {
      rating_image = 'regular_4_half.png'
    } else {
      rating_image = 'regular_5.png'
    }

    return '../assets/images/yelp/yelp_stars/' + rating_image

  }

  public openSearchResult(search_result){
    //console.log('Open Reuslt ', search_result)
  }

  public dismissToast(evt: Event){
    this.toastHelper = false
  }

  public getEventsSearchCallback (httpResponse: any): void {
    
    if(httpResponse.success){
      
      window.scrollTo(0,0)
      
      let event_object = httpResponse.responseObject
      
      //console.log("event_object", event_object)

      if(event_object._embedded === undefined){
        this.toastHelper = true
        this.loading = false
        return
      }

      this.showSearchResults = true
      this.catsUp = false  
      this.loading = false
  
      let event_object_list = event_object._embedded.events

      //console.log("Object List", event_object_list)

      this.totalResults = event_object_list.length

      this.allPages = Math.floor(this.totalResults / this.itemsPerPage)

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

    window.scrollTo(0,0)

    this.loading = false
    this.showSearchResults = true
    this.catsUp = false
    
    this.totalResults = httpResponse.data.total

    this.allPages = Math.floor(this.totalResults / this.itemsPerPage)

    if(this.allPages == 0) this.allPages = 1

    if(this.totalResults > 1000){ 
      this.totalResults = 1000
      this.allPages = 20
    }

    if (httpResponse.success) {

      let places_results = httpResponse.data.businesses

      this.populateYelpResults(places_results)

      if(this.totalResults > (this.around_me_search_page * this.itemsPerPage)){
        this.show_next_page_button = true        
      }

      this.spotbie_user_marker_info_window.open()

      this.searchCategorySorter = this.search_category

      this.displaySurroundingObjectList = false

      this.show_search_box = true

    } else
      console.log('Place Search Error: ', httpResponse)

  }

  private populateYelpResults(results): void{

    results.forEach(business => {

      business.rating_image = this.setYelpRatingImage(business.rating)
      business.type_of_info_object = this.type_of_info_object

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

      business.distance = this.metersToMiles(business.distance)

      business.icon = business.image_url
      
      //console.log("Businnes: ", business)

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

  public viewProfile(exe_username: string): void {
    if(exe_username == 'User is a Ghost') return
    this.router.navigate(['/user-profile/' + exe_username])
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

        surrounding_object_list[k].default_picture = "../assets/images/ghost_white.jpg"
        surrounding_object_list[k].username = "User is a Ghost"
        surrounding_object_list[k].description = "This user is a ghost. Ghost Users are not able to be befriended and their profiles remain hidden. Who is this person then? Well... maybe you'll get to find out if they befriend you. Ghost Users normally have less friends than non-Ghost Users due to their profile's low visibility."

      } else {

        surrounding_object_list[k].description = unescape(surrounding_object_list[k].description)

      }

      surrounding_object_list[k].map_icon = this.mapIconPipe.transform(surrounding_object_list[k].default_picture)

    }

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

  public placeSearch(action) {
    //this.host.mediaPlayerWindow.open = true
    this.coming_soon_ov = true

    this.coming_soon_ov_title = "SpotBie Place Search Coming Soon"
    this.coming_soon_ov_text = "SpotBie Place Search will allow users to find places locally. (Parks, Malls, Attractions, Etc.)"    
  }

  public closeSearchResults(){
    this.closeCategories()
    this.displaySurroundingObjectList = true
    this.show_search_box = false
  }

  public myFavorites(): void{
    
    this.myFavoritesWindow.open = true

  }

  ngOnInit() {

    if (this.deviceService.isDesktop || this.deviceService.isTablet)
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
      this.user_default_image = 'user.png'
      this.spotbie_username = 'Guest'      
      this.bg_color = '#353535'
    }
    
    this.is_android = mobile_js_i.android_i
    this.is_iphone = mobile_js_i.iphone_i
    
    if(this.is_android){
      mobile_js_i.accesLocationAndroid()
    }

    if (window.navigator.geolocation) { window.navigator.geolocation.getCurrentPosition(this.showPosition.bind(this)) }

    this.web_options_subscriber = this.webOptionsService.getWebOptions().subscribe(web_options =>{

      if(web_options.bg_color){
        this.bg_color = web_options.bg_color
      }

    })


  }
}
