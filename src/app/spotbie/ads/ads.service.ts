import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { handleError } from 'src/app/helpers/error-helper'
import * as spotbieGlobals from 'src/app/globals'

const ADS_API = spotbieGlobals.API+'ads'

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  constructor(private http: HttpClient) { }

  public getSingleAdBanner(): Observable<any>{
    
    let rand = Math.floor(Math.random() * 100001);

    const getAd = `${ADS_API}/get-single-ad-banner?h=${rand}`

    return this.http.post(getAd, null).pipe(
      catchError(
        handleError("getSingleAdBanner")
      )
    )

  }

  public getAds():  Observable<any>{
    
    const getAdsApi = `${ADS_API}/index`

    return this.http.post(getAdsApi, null).pipe(
      catchError(
        handleError("getAds")
      )
    )

  }

}
