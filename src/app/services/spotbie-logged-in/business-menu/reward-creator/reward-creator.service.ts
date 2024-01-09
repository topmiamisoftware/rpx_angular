import {Injectable} from '@angular/core';
import * as spotbieGlobals from '../../../../globals';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {Reward} from '../../../../models/reward';
import {handleError} from '../../../../helpers/error-helper';
import {setValue} from '../../../../spotbie/spotbie-logged-in/loyalty-points/loyalty-points.actions';

const REWARD_API = `${spotbieGlobals.API}reward`;

@Injectable({
  providedIn: 'root',
})
export class RewardCreatorService {
  constructor(
    private http: HttpClient,
    private store: Store<{loyaltyPoints}>
  ) {}

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

  claimReward(businessLoyaltyPointsObj: any, callback): any {
    const apiUrl = `${REWARD_API}/claim`;

    this.http
      .post<any>(apiUrl, businessLoyaltyPointsObj)
      .pipe(catchError(handleError('claimReward')))
      .subscribe(resp => {
        if (resp.success) {
          const loyaltyPointBalance: number = resp.loyalty_points;
          this.store.dispatch(setValue({loyaltyPointBalance}));
        }
        callback(resp);
      });
  }
}
