import { Injectable } from '@angular/core';
import { HttpResponse } from '../models/http-reponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { displayError, handleError } from '../helpers/error-helper';
import * as spotbieGlobals from '../globals';
import { catchError } from 'rxjs/operators';

const USER_LOCATION_API = spotbieGlobals.API + 'user_location';

const SEARCH_BUSINESS_API = 'https://www.spotbie.com/api/yelp.php';

const SEARCH_EVENTS_API = 'https://www.spotbie.com/api/yelp.php';

const HTTP_OPTIONS_2 = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }
  
  public getClassifications(search_obj, callback){

    let chosen_api
    
    const search_obj2 = JSON.stringify(search_obj)

    chosen_api = SEARCH_EVENTS_API

    this.http.post<HttpResponse>(chosen_api, search_obj2, HTTP_OPTIONS_2)
    .subscribe( resp => {
            //console.log('getEvents Response : ', resp)
            const httpResponse = new HttpResponse ({
              status : resp.status,
              message : resp.message,
              full_message : resp.full_message,
              responseObject : resp.responseObject
            });
            callback(httpResponse)
          },
            error => {
              displayError(error);
    });
    
  }

  public getEvents(search_obj, callback) {

    let chosen_api
    
    const search_obj2 = JSON.stringify(search_obj)

    chosen_api = SEARCH_EVENTS_API

    this.http.post<HttpResponse>(chosen_api, search_obj2, HTTP_OPTIONS_2)
    .subscribe( resp => {
            //console.log('getEvents Response : ', resp)
            const httpResponse = new HttpResponse ({
              status : resp.status,
              message : resp.message,
              full_message : resp.full_message,
              responseObject : resp.responseObject
            });
            callback(httpResponse)
          },
            error => {
              displayError(error);
    });

  }

  public getBusinesses(search_obj, callback) {

    let chosen_api
    
    const search_obj2 = JSON.stringify(search_obj)

    chosen_api = SEARCH_BUSINESS_API

    this.http.post<HttpResponse>(chosen_api, search_obj2, HTTP_OPTIONS_2)
    .subscribe( resp => {
            //console.log('getBusinesses Response : ', resp)
            const httpResponse = new HttpResponse ({
              status : resp.status,
              message : resp.message,
              full_message : resp.full_message,
              responseObject : resp.responseObject
            });
            callback(httpResponse)
          },
            error => {
              displayError(error);
    });

  }

  public saveCurrentLocation(save_location_obj: any) {

    let location_api = USER_LOCATION_API + '/save_current_location';

    return this.http.post<any>(location_api, save_location_obj).pipe(
      catchError(handleError("saveCurrentLocation Error"))
    )

  }


  public retrieveSurroudings(retrieve_surroundings_obj: any){

    let location_api = USER_LOCATION_API + '/retrieve_surroundings';

    return this.http.post<any>(location_api, retrieve_surroundings_obj).pipe(
      catchError(handleError("retrieveSurroudings Error"))
    )  

  }

}
