import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { handleError } from 'src/app/helpers/error-helper'
import * as spotbieGlobals from 'src/app/globals'

const ADS_API = spotbieGlobals.API+'in-house'

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  constructor(private http: HttpClient) { }

  public getSingleAdBanner(): Observable<any>{

    const getAd = `${ADS_API}/header-banner`

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
