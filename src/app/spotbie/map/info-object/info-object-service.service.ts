import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { handleError } from 'src/app/helpers/error-helper'
import { Observable, of } from 'rxjs'
import * as spotbieGlobals from 'src/app/globals'
import { catchError, map } from 'rxjs/operators'

const PULL_INFO_API = `${spotbieGlobals.API}pull-info-object`
const PULL_INFO_EVENT_API = `${spotbieGlobals.API}get-event`


@Injectable({
  providedIn: 'root'
})
export class InfoObjectServiceService {

  constructor(private http: HttpClient) { }

  public pullInfoObject(infoObjRequest: any): Observable<any> {

    return this.http.post<any>(PULL_INFO_API, infoObjRequest).pipe(
      catchError(handleError("pullInfoObject"))     
    )

  }

  public pullEventObject(infoObjRequest: any): Observable<any> {

    return this.http.post<any>(PULL_INFO_EVENT_API, infoObjRequest).pipe(
      catchError(handleError("pullEventObject")) 
    )

  }

}
