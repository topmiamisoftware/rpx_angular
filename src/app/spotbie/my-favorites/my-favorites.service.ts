import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from 'src/app/helpers/error-helper';
import * as spotbieGlobals from '../../globals'

const GET_FAVORITES_LOGGED_IN_API = `${spotbieGlobals.API}my-favorites`
const SAVE_FAVORITES_API = `${spotbieGlobals.API}save-favorite`
const REMOVE_FAVORITES_API = `${spotbieGlobals.API}remove-favorite`

@Injectable({
  providedIn: 'root'
})
export class MyFavoritesService {

  constructor(private http: HttpClient) { }

  public getFavoritesLoggedIn(page: number): Observable<any>{

    const getFavoritesLoggedInApi = `${GET_FAVORITES_LOGGED_IN_API}?page=${page}`

    return this.http.get(getFavoritesLoggedInApi).pipe(
      catchError(handleError("getFavoritesLoggedIn"))
    )

  }

  public getFavoritesLoggedOut(){

    let myFavoriteItems = localStorage.getItem('spotbie_favoriteItems')
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

  public removeFavoriteLoggedOut(id: string): void{

    let currentFavorites: Array<any> = JSON.parse(localStorage.getItem('spotbie_currentFavorites'))
    let newCurrentFavorites: Array<any>

    currentFavorites.find(function(favorite, index) {

      if(favorite.id == id)
        newCurrentFavorites = currentFavorites.splice(index, -1)

    });

    localStorage.setItem('spotbie_currentFavorites', JSON.stringify(newCurrentFavorites))

  }

}
