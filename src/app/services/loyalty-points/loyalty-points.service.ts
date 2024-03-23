import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import * as spotbieGlobals from '../../globals';
import {LoyaltyTier} from '../../models/loyalty-point-tier.balance';
import {LoyaltyPointBalance} from '../../models/loyalty-point-balance';
import {handleError} from '../../helpers/error-helper';
import {ERROR} from '@angular/compiler-cli/src/ngtsc/logging/src/console_logger';

const LOYALTY_POINTS_API = spotbieGlobals.API + 'loyalty-points';
const LOYALTY_POINTS_TIER_API = spotbieGlobals.API + 'lp-tiers';
const REDEEMABLE_API = spotbieGlobals.API + 'redeemable';
const FEEDBACK_API = spotbieGlobals.API + 'feedback';

@Injectable({
  providedIn: 'root',
})
export class LoyaltyPointsService {
  loyaltyPointBalance: LoyaltyPointBalance;
  existingTiers$ = new BehaviorSubject<LoyaltyTier[]>(null);

  constructor(private http: HttpClient) {}

  getLedger(request: any): Observable<any> {
    const apiUrl = `${REDEEMABLE_API}/ledger?page=${request.page}`;

    return this.http
      .get<any>(apiUrl, request)
      .pipe(catchError(handleError('getLedger')));
  }

  getBalanceList(request: any): Observable<any> {
    const apiUrl = `${REDEEMABLE_API}/balance-list?page=${request.page}`;

    return this.http
      .get<any>(apiUrl, request)
      .pipe(catchError(handleError('getBalanceList')));
  }

  getRedeemed(request: any): Observable<any> {
    const apiUrl = `${REDEEMABLE_API}/lp-redeemed?page=${request.page}`;

    return this.http
      .get<any>(apiUrl, request)
      .pipe(catchError(handleError('getRedeemed')));
  }

  getRewards(request: any): Observable<any> {
    const apiUrl = `${REDEEMABLE_API}/index?page=${request.page}`;

    return this.http
      .get<any>(apiUrl, request)
      .pipe(catchError(handleError('getRewards')));
  }

  getLoyaltyPointBalance(): any {
    const apiUrl = `${LOYALTY_POINTS_API}/show`;

    return this.http
      .post<any>(apiUrl, null)
      .pipe(catchError(handleError('getLoyaltyPointBalance')));
  }

  addLoyaltyPoints(businessLoyaltyPointsObj: any): Observable<any> {
    const apiUrl = `${REDEEMABLE_API}/redeem`;

    return this.http
      .post<any>(apiUrl, businessLoyaltyPointsObj)
      .pipe(catchError(handleError('saveLoyaltyPoint')));
  }

  createRedeemable(createRedeemableObj: any): Observable<any> {
    const apiUrl = `${REDEEMABLE_API}/create`;

    return this.http
      .post<any>(apiUrl, createRedeemableObj)
      .pipe(catchError(handleError('createRedeemable')));
  }

  getExistingTiers(): Observable<any> {
    const apiUrl = `${LOYALTY_POINTS_TIER_API}/index`;

    return this.http.get<any>(apiUrl).pipe(
      tap(existingTiers => this.existingTiers$.next(existingTiers.data)),
      catchError(handleError('existingTiers'))
    );
  }

  updateTier(tier: LoyaltyTier): Observable<any> {
    const apiUrl = `${LOYALTY_POINTS_TIER_API}/update/${tier.uuid}`;

    return this.http
      .patch<any>(apiUrl, tier)
      .pipe(catchError(handleError('updateTier')));
  }

  createTier(tier: LoyaltyTier): Observable<any> {
    const apiUrl = `${LOYALTY_POINTS_TIER_API}/store`;

    return this.http
      .post<any>(apiUrl, tier)
      .pipe(catchError(handleError('createTier')));
  }

  deleteTier(tierUuid: string): Observable<any> {
    const apiUrl = `${LOYALTY_POINTS_TIER_API}/destroy/${tierUuid}`;

    return this.http
      .delete<any>(apiUrl)
      .pipe(catchError(handleError('deleteTier')));
  }

  saveFeedback(feedbackText: string, ledgerRecordId: string) {
    const apiUrl = `${FEEDBACK_API}/store`;

    return this.http
      .post<any>(apiUrl, {
        feedback_text: feedbackText,
        ledger_id: ledgerRecordId,
      })
      .pipe(catchError(handleError('saveFeedbackService')));
  }

  updateFeedback(feedbackText: string, feedbackId: string) {
    const apiUrl = `${FEEDBACK_API}/update/${feedbackId}`;

    return this.http
      .patch<any>(apiUrl, {feedback_text: feedbackText})
      .pipe(catchError(handleError('updateFeedback')));
  }
}
