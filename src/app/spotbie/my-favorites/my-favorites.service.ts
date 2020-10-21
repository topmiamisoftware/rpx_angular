import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from 'src/app/helpers/error-helper';
import * as spotbieGlobals from '../../globals'

const GET_FAVORITES_LOGGED_IN_API = spotbieGlobals.API + 'profile_header'

@Injectable({
  providedIn: 'root'
})
export class MyFavoritesService {

  constructor(private http: HttpClient) { 
    
  }

  public getFavoritesLoggedIn(): Observable<any>{

    const getFavoritesLoggedInApi = `${GET_FAVORITES_LOGGED_IN_API}`

    return this.http.get(getFavoritesLoggedInApi).pipe(
      catchError(handleError("getFavoritesLoggedIn"))
    )

  }

  public getFavoritesLoggedOut(){

    let myFavoriteItems = localStorage.getItem('spotbie_favoriteItems')
    return myFavoriteItems

  }

}
