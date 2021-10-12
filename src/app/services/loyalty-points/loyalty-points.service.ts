import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError } from 'rxjs/operators'

import * as spotbieGlobals from 'src/app/globals'
import { Observable } from 'rxjs'
import { handleError } from 'src/app/helpers/error-helper'
import { Store } from '@ngrx/store'
import { setValue } from 'src/app/spotbie/spotbie-logged-in/loyalty-points/loyalty-points.actions'
import { LoyaltyPointBalance } from 'src/app/models/loyalty-point-balance'

const LOYATLY_POINTS_API = spotbieGlobals.API+'loyalty-points'

@Injectable({
  providedIn: 'root'
})
export class LoyaltyPointsService {

  userLoyaltyPoints$: Observable<LoyaltyPointBalance> = this.store.select('loyaltyPoints')

  loyaltyPointBalance: LoyaltyPointBalance

  constructor(private http: HttpClient,
              private store: Store<{ loyaltyPoints }>) {
  }


  getLoyaltyPointBalance(): any{

    let apiUrl = `${LOYATLY_POINTS_API}/show`

    this.http.post<any>(apiUrl, null).pipe(
      catchError(handleError("getLoyaltyPointBalance"))
    ).subscribe(

        resp => {

          if(resp.success){            
            let loyaltyPointBalance: LoyaltyPointBalance = resp.loyalty_points
            this.store.dispatch( setValue({loyaltyPointBalance}) )               
          }       
          
        }

    )

  }      
  
  saveLoyaltyPoint(businessLoyaltyPointsObj: any): Observable<any>{

    let apiUrl = `${LOYATLY_POINTS_API}/store`

    return this.http.post<any>(apiUrl, businessLoyaltyPointsObj).pipe(
      catchError(handleError("saveLoyaltyPoint"))
    ) 

  }

  addLoyaltyPoints(businessLoyaltyPointsObj: any): any{

    let apiUrl = `${LOYATLY_POINTS_API}/add`

    this.http.post<any>(apiUrl, businessLoyaltyPointsObj).pipe(
      catchError(handleError("saveLoyaltyPoint"))
    ).subscribe(
      resp => {
        if(resp.success){
          this.store.dispatch(setValue(resp.balance))
          return resp
        }
      }
    )

  }

  public resetMyBalance(): any{

    let apiUrl = `${LOYATLY_POINTS_API}/reset`

    this.http.post<any>(apiUrl, null).pipe(
      catchError(handleError("resetMyBalance"))
    ).subscribe(

      resp => {

        if(resp.success){
          let loyaltyPointBalance: LoyaltyPointBalance = resp.loyalty_points
          this.store.dispatch( setValue({loyaltyPointBalance}) )     
        }

      }
      
    ) 

  }

}
