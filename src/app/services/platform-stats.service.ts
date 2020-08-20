import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import * as spotbieGlobals from '../globals'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { handleError } from '../helpers/error-helper'

const PUBLIC_STATS_API = spotbieGlobals.API + 'public_stats/total_users'

@Injectable({
  providedIn: 'root'
})
export class PlatformStatsService {

  constructor(private http: HttpClient) { }

  public publicStatsApi(): Observable<any>{
    
    return this.http.get<any>(PUBLIC_STATS_API).pipe(
      catchError(handleError("Get Chat Info Error"))
    )

  }

}
