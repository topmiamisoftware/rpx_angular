import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from 'src/app/helpers/error-helper';
import * as spotbieGlobals from '../../../globals'

const GET_PLACES_LOGGED_IN_API = `${spotbieGlobals.API}my-places`
const SAVE_PLACES_API = `${spotbieGlobals.API}my-places/save-place`
const REMOVE_PLACES_API = `${spotbieGlobals.API}my-places/remove-place`

@Injectable({
  providedIn: 'root'
})
export class MyPlacesService {

  constructor(private http: HttpClient) { }

  public getPLacesLoggedIn(page: number): Observable<any>{

    const getPlacesLoggedInApi = `${GET_PLACES_LOGGED_IN_API}?page=${page}`

    return this.http.get(getPlacesLoggedInApi).pipe(
      catchError(handleError("getFavoritesLoggedIn"))
    )

  }

  public getPlacesLoggedOut(){

    return JSON.parse(localStorage.getItem('spotbie_currentPlaces'))

  }

  public addPlace(placeObj: any): Observable<any>{

    const savePlacesApi = `${SAVE_PLACES_API}`

    return this.http.post(savePlacesApi, placeObj).pipe(
      catchError(handleError("addPlace"))
    )

  }

  public addPlaceLoggedOut(placeObj: any): void{

    let currentPlaces: Array<any> = this.getPlacesLoggedOut()

    if(currentPlaces === null) currentPlaces = []
      
    currentPlaces.push(placeObj)

    localStorage.setItem('spotbie_currentPlaces', JSON.stringify(currentPlaces))

  }

  public removePlace(id: string): Observable<any>{

    const removePlaceApi = `${REMOVE_PLACES_API}`

    const removeFavoriteObj = {
      _method: 'DELETE',
      id: id
    }

    return this.http.post(removePlaceApi, removeFavoriteObj).pipe(
      catchError(handleError("removeFavorite"))
    )

  }

  public removePlaceLoggedOut(id: string){

    let currentPlaces = this.getPlacesLoggedOut()

    let indextoSplice

    currentPlaces.find( (place, index) => {

      if(place.id == id) indextoSplice = index

    });

    currentPlaces.splice(indextoSplice, 1)
    localStorage.setItem('spotbie_currentPlaces', JSON.stringify(currentPlaces))
    return

  }

  public isInMyFavoritesLoggedOut(objId: string): boolean{

    let currentPlaces: Array<any> = this.getPlacesLoggedOut()
    let found = false

    if(currentPlaces == null) return false

    currentPlaces.find( (favorite, index) => {
      if(favorite.third_party_id === objId) found = true
    })

    return found

  }

}
