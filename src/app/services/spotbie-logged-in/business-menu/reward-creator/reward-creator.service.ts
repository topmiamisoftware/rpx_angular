import { Injectable } from '@angular/core'
import * as spotbieGlobals from 'src/app/globals'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { handleError } from 'src/app/helpers/error-helper'
import { catchError } from 'rxjs/operators'
import { Reward } from 'src/app/models/reward'

const REWARD_API = `${spotbieGlobals.API}reward` 

@Injectable({
  providedIn: 'root'
})
export class RewardCreatorService {

  constructor(private http: HttpClient) {}

  public saveItem(itemObj: Reward): Observable<any>{

    const placeToEatRewardApi = `${REWARD_API}/create`

    const itemObjToSave = {
      name: itemObj.name,    
      description: itemObj.description,
      images: itemObj.images,
      point_cost: itemObj.point_cost,
      type: itemObj.type
    }

    return this.http.post<any>(placeToEatRewardApi, itemObjToSave).pipe(
      catchError(handleError("completeReset"))
    ) 

  }

  public updateItem(itemObj: Reward): Observable<any>{

    const placeToEatRewardApi = `${REWARD_API}/update`

    const itemObjToSave = {
      name: itemObj.name,    
      description: itemObj.description,
      images: itemObj.images,
      point_cost: itemObj.point_cost,
      type: itemObj.type,
      id: itemObj.id
    }

    return this.http.post<any>(placeToEatRewardApi, itemObjToSave).pipe(
      catchError(handleError("completeReset"))
    ) 

  }

  public deleteMe(itemObj: Reward): Observable<any>{

    const placeToEatRewardApi = `${REWARD_API}/delete`

    const itemObjToSave = {
      id: itemObj.id
    }

    return this.http.post<any>(placeToEatRewardApi, itemObjToSave).pipe(
      catchError(handleError("completeReset"))
    ) 
  }


}
