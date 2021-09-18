import { Injectable } from '@angular/core';
import * as spotbieGlobals from 'src/app/globals'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { handleError } from 'src/app/helpers/error-helper';
import { catchError, tap } from 'rxjs/operators';

const PLACE_TO_EAT_REWARD_API = `${spotbieGlobals.API}place-to-eat-item`

@Injectable({
  providedIn: 'root'
})
export class BusinessMenuServiceService {

  constructor(private http: HttpClient) {}

  public fetchRewards(fetchRewardsReq: any = null): Observable<any>{

    const placeToEatApi = `${PLACE_TO_EAT_REWARD_API}/index`

    return this.http.post<any>(placeToEatApi, fetchRewardsReq).pipe(
      catchError(handleError("fetchRewards"))
    ) 

  }

}
