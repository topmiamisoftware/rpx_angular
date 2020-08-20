import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import * as spotbieGlobals from '../../globals'

const USER_LOCATION_API = spotbieGlobals.API + 'api/map.service.php'

const SEARCH_BUSINESS_API = 'https://www.spotbie.com/api/yelp.php'

const SEARCH_EVENTS_API = 'https://www.spotbie.com/api/yelp.php'

const HTTP_OPTIONS = {
  withCredentials : true,
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

const HTTP_OPTIONS_2 = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }
  
  public getClassifications(search_obj, callback){

    let chosen_api
    
    const search_obj2 = JSON.stringify(search_obj)

    chosen_api = SEARCH_EVENTS_API

    this.http.post<HttpResponse<any>>(chosen_api, search_obj2, HTTP_OPTIONS_2)
    .subscribe( resp => {
        callback(resp)
    },
    error => {
        console.log("Get Classifications Error", error)
    })
    
  }

  public getEvents(search_obj, callback) {

    let chosen_api
    
    const search_obj2 = JSON.stringify(search_obj)

    chosen_api = SEARCH_EVENTS_API

    this.http.post<HttpResponse<any>>(chosen_api, search_obj2, HTTP_OPTIONS_2)
    .subscribe( resp => {
      callback(resp)
    },
    error => {
      console.log("Get Events Error", error)
    })

  }

  public getBusinesses(search_obj, callback) {

    let chosen_api
    
    const search_obj2 = JSON.stringify(search_obj)

    chosen_api = SEARCH_BUSINESS_API

    this.http.post<HttpResponse<any>>(chosen_api, search_obj2, HTTP_OPTIONS_2)
    .subscribe( resp => {
      callback(resp)
    },
    error => {
        console.log("Get Business Error", error)
    })

  }

  saveCurrentLocation(save_location_obj : any, callback : Function) {

    let location_api = USER_LOCATION_API

    this.http.post<HttpResponse<any>>(location_api, save_location_obj, HTTP_OPTIONS)
    .subscribe( resp => {
      callback(resp)
    },
    error => {
      console.log("Save Current Location Error", error)
    })

  }

}
