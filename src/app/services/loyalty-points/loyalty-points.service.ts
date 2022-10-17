import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { handleError } from 'src/app/helpers/error-helper'
import { Store } from '@ngrx/store'
import { setValue } from 'src/app/spotbie/spotbie-logged-in/loyalty-points/loyalty-points.actions'
import { LoyaltyPointBalance } from 'src/app/models/loyalty-point-balance'
import * as spotbieGlobals from 'src/app/globals'

const LOYATLY_POINTS_API = spotbieGlobals.API+'loyalty-points'
const REDEEMABLE_API = spotbieGlobals.API+'redeemable'

@Injectable({
  providedIn: 'root'
})
export class LoyaltyPointsService {

  userLoyaltyPoints$: Observable<LoyaltyPointBalance[]> = this.store.select('loyaltyPoints')
  loyaltyPointBalance: LoyaltyPointBalance

  constructor(private http: HttpClient,
              private store: Store<{ loyaltyPoints }>) {
  }

  getLedger(request: any): Observable<any>{
    const apiUrl = `${REDEEMABLE_API}/ledger?page=${request.page}`

    return this.http.get<any>(apiUrl, request).pipe(
      catchError(handleError( 'getLedger'))
    )
  }

  getBalanceList(request: any): Observable<any>{
    const apiUrl = `${REDEEMABLE_API}/balance-list?page=${request.page}`

    return this.http.get<any>(apiUrl, request).pipe(
      catchError(handleError( 'getBalanceList'))
    )
  }

  getRedeemed(request: any): Observable<any>{
    const apiUrl = `${REDEEMABLE_API}/lp-redeemed?page=${request.page}`

    return this.http.get<any>(apiUrl, request).pipe(
      catchError(handleError('getRedeemed'))
    )
  }

  getRewards(request: any): Observable<any>{
    const apiUrl = `${REDEEMABLE_API}/index?page=${request.page}`

    return this.http.get<any>(apiUrl, request).pipe(
      catchError(handleError( 'getRewards'))
    )
  }

  getLoyaltyPointBalance(): any{
    const apiUrl = `${LOYATLY_POINTS_API}/show`

    this.http.post<any>(apiUrl, null).pipe(
      catchError(handleError('getLoyaltyPointBalance'))
    ).subscribe(resp => {
          if(resp.success){
            const loyaltyPointBalance: LoyaltyPointBalance[] = resp.loyalty_points
            this.store.dispatch( setValue({loyaltyPointBalance}) )
          }
        })
  }

  saveLoyaltyPoint(businessLoyaltyPointsObj: any): Observable<any>{
    const apiUrl = `${LOYATLY_POINTS_API}/store`

    return this.http.post<any>(apiUrl, businessLoyaltyPointsObj).pipe(
      catchError(handleError('saveLoyaltyPoint'))
    )
  }

  addLoyaltyPoints(businessLoyaltyPointsObj: any, callback): any{
    const apiUrl = `${REDEEMABLE_API}/redeem`

    this.http.post<any>(apiUrl, businessLoyaltyPointsObj).pipe(
      catchError(handleError('saveLoyaltyPoint'))
    ).subscribe(resp => {
        if(resp.success){
          const loyaltyPointBalance: LoyaltyPointBalance[] = resp.loyalty_points
          this.store.dispatch( setValue({loyaltyPointBalance}) )
        }
        callback(resp)
      })
  }

  public createRedeemable(createRedeemableObj: any): Observable<any>{
    const apiUrl = `${REDEEMABLE_API}/create`

    return this.http.post<any>(apiUrl, createRedeemableObj).pipe(
      catchError(handleError('createRedeemable'))
    )
  }

  public resetMyBalance(): any{
    const apiUrl = `${LOYATLY_POINTS_API}/reset`

    this.http.post<any>(apiUrl, null).pipe(
      catchError(handleError('resetMyBalance'))
    ).subscribe(resp => {
        if(resp.success){
          const loyaltyPointBalance: LoyaltyPointBalance[] = resp.loyalty_points
          this.store.dispatch( setValue({loyaltyPointBalance}) )
        }
      })
  }
}
