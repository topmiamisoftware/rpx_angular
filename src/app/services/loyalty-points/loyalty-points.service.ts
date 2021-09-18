import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { catchError, tap } from 'rxjs/operators'

import * as spotbieGlobals from 'src/app/globals'
import { Observable } from 'rxjs';
import { handleError } from 'src/app/helpers/error-helper';

const LOYATLY_POINTS_API = spotbieGlobals.API+'loyalty-points'

@Injectable({
  providedIn: 'root'
})
export class LoyaltyPointsService {

  constructor(private http: HttpClient,
              private router: Router) { }


  public fetchLoyaltyPoints(): Observable<any>{

    let apiUrl = `${LOYATLY_POINTS_API}/show`

    return this.http.post<any>(apiUrl, null).pipe(
      catchError(handleError("fetchLoyaltyPoints"))
    ) 

  }      
  
  public saveLoyaltyPoint(businessLoyaltyPointsObj: any): Observable<any>{

    let apiUrl = `${LOYATLY_POINTS_API}/store`

    return this.http.post<any>(apiUrl, businessLoyaltyPointsObj).pipe(
      catchError(handleError("saveLoyaltyPoint"))
    ) 

  }

  public addLoyaltyPoints(businessLoyaltyPointsObj: any): Observable<any>{

    let apiUrl = `${LOYATLY_POINTS_API}/add`

    return this.http.post<any>(apiUrl, businessLoyaltyPointsObj).pipe(
      catchError(handleError("saveLoyaltyPoint"))
    ) 

  }

}
