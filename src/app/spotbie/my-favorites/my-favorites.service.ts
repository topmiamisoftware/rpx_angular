import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from 'src/app/helpers/error-helper';
import * as spotbieGlobals from '../../globals'

const GET_FAVORITES_LOGGED_IN_API = `${spotbieGlobals.API}my-favorites`
const SAVE_FAVORITES_API = `${spotbieGlobals.API}my-favorites/save-favorite`
const REMOVE_FAVORITES_API = `${spotbieGlobals.API}my-favorites/remove-favorite`
const IS_A_FAVORITE_API = `${spotbieGlobals.API}my-favorites/is-a-favorite`

@Injectable({
  providedIn: 'root'
})
export class MyFavoritesService {

  constructor(private http: HttpClient) { }

  public getFavoritesLoggedIn(page: number): Observable<any>{

    return this.http.post(GET_FAVORITES_LOGGED_IN_API, page).pipe(
      catchError(handleError("getFavoritesLoggedIn"))
    )

  }

  public getFavoritesLoggedOut(){

    let myFavoriteItems = JSON.parse(localStorage.getItem('spotbie_currentFavorites'))
    return myFavoriteItems

  }

  public addFavorite(favoriteObj: any): Observable<any>{

    const saveFavoritesApi = `${SAVE_FAVORITES_API}`

    return this.http.post(saveFavoritesApi, favoriteObj).pipe(
      catchError(handleError("addFavorite"))
    )

  }

  public addFavoriteLoggedOut(favoriteObj: any): void{

    let currentFavorites: Array<any> = JSON.parse(localStorage.getItem('spotbie_currentFavorites'))

    if(currentFavorites === null) currentFavorites = []
      
    currentFavorites.push(favoriteObj)

    localStorage.setItem('spotbie_currentFavorites', JSON.stringify(currentFavorites))

  }

  public removeFavorite(id: string): Observable<any>{

    const saveFavoritesApi = `${REMOVE_FAVORITES_API}`

    const removeFavoriteObj = {
      _method: 'DELETE',
      id: id
    }

    return this.http.post(saveFavoritesApi, removeFavoriteObj).pipe(
      catchError(handleError("addFavorite"))
    )

  }

  public removeFavoriteLoggedOut(id: string){

    let currentFavorites = this.getFavoritesLoggedOut()

    let indextoSplice

    currentFavorites.find( (favorite, index) => {

      if(favorite.third_party_id == id) indextoSplice = index

    });

    currentFavorites.splice(indextoSplice, 1)
    localStorage.setItem('spotbie_currentFavorites', JSON.stringify(currentFavorites))
    return

  }

  public isInMyFavorites(objId: string, objType: string){
  
    const isInMyFavoritesObj = {
      obj_type: objType,
      third_party_id: objId
    }

    return this.http.post<any>(IS_A_FAVORITE_API, isInMyFavoritesObj).pipe(
      catchError(handleError("pullInfoObject"))
    )
  
  }

  public isInMyFavoritesLoggedOut(objId: string): boolean{

    let currentFavorites: Array<any> = this.getFavoritesLoggedOut()
    let found = false

    if(currentFavorites == null) return false

    currentFavorites.find( (favorite, index) => {
      if(favorite.third_party_id === objId) found = true
    })

    return found

  }

}
