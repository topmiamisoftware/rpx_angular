import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { handleError } from 'src/app/helpers/error-helper'
import { Observable } from 'rxjs'
import * as spotbieGlobals from 'src/app/globals'
import { catchError } from 'rxjs/operators'

const PULL_INFO_API = `${spotbieGlobals.API}pull-info-object`

@Injectable({
  providedIn: 'root'
})
export class InfoObjectServiceService {

  constructor(private http: HttpClient) { }

  public pullInfoObject(yelpObj: any): Observable<any> {
    
    return this.http.post<any>(PULL_INFO_API, yelpObj).pipe(
      catchError(handleError("pullInfoObject"))
    )

  }

}
