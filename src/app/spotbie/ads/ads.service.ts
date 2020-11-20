import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { handleError } from 'src/app/helpers/error-helper'
import { environment } from 'src/environments/environment'

const ADS_API = `${environment.apiEndpoint}ads`

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  constructor(private http: HttpClient) { }

  public getSingleAdBanner(): Observable<any>{
    
    let rand = Math.floor(Math.random() * 100001);

    const getAd = `${ADS_API}/get-single-ad-banner?h=${rand}`

    return this.http.post(getAd, null).pipe(
      catchError(handleError("getSingleAdBanner"))
    )

  }

}
