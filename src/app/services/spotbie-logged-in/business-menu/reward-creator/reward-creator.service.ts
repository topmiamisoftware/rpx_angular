import {Injectable} from '@angular/core';
import * as spotbieGlobals from '../../../../globals';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Reward} from '../../../../models/reward';
import {handleError} from '../../../../helpers/error-helper';

const REWARD_API = `${spotbieGlobals.API}reward`;

@Injectable({
  providedIn: 'root',
})
export class RewardCreatorService {
  constructor(private http: HttpClient) {}

  saveReward(reward: Reward): Observable<any> {
    const placeToEatRewardApi = `${REWARD_API}/create`;

    return this.http
      .post<any>(placeToEatRewardApi, reward)
      .pipe(catchError(handleError('saveReward')));
  }

  updateReward(reward: Reward): Observable<any> {
    const placeToEatRewardApi = `${REWARD_API}/update`;
    return this.http
      .post<any>(placeToEatRewardApi, reward)
      .pipe(catchError(handleError('updateReward')));
  }

  deleteMe(itemObj: Reward): Observable<any> {
    const placeToEatRewardApi = `${REWARD_API}/delete`;
    const itemObjToSave = {
      id: itemObj.id,
    };

    return this.http
      .post<any>(placeToEatRewardApi, itemObjToSave)
      .pipe(catchError(handleError('completeReset')));
  }

  claimReward(businessLoyaltyPointsObj: any): any {
    const apiUrl = `${REWARD_API}/claim`;

    return this.http
      .post<any>(apiUrl, businessLoyaltyPointsObj)
      .pipe(catchError(handleError('claimReward')));
  }
}
