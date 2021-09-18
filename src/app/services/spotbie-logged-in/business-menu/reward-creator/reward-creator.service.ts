import { Injectable } from '@angular/core';
import * as spotbieGlobals from 'src/app/globals'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { handleError } from 'src/app/helpers/error-helper';
import { catchError, tap } from 'rxjs/operators';
import { PlaceToEatItem } from 'src/app/models/place-to-eat-item';

const PLACE_TO_EAT_REWARD_API = `${spotbieGlobals.API}place-to-eat-item` 

@Injectable({
  providedIn: 'root'
})
export class RewardCreatorService {

  constructor(private http: HttpClient) {}

  public saveItem(itemObj: PlaceToEatItem): Observable<any>{

    const placeToEatRewardApi = `${PLACE_TO_EAT_REWARD_API}/create`

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

  public updateItem(itemObj: PlaceToEatItem): Observable<any>{

    const placeToEatRewardApi = `${PLACE_TO_EAT_REWARD_API}/update`

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

  public deleteMe(itemObj: PlaceToEatItem): Observable<any>{

    const placeToEatRewardApi = `${PLACE_TO_EAT_REWARD_API}/delete`

    const itemObjToSave = {
      id: itemObj.id
    }

    return this.http.post<any>(placeToEatRewardApi, itemObjToSave).pipe(
      catchError(handleError("completeReset"))
    ) 
  }


}
