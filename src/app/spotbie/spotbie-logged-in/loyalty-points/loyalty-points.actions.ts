import { createAction, props } from '@ngrx/store';
import { LoyaltyPointBalance } from 'src/app/models/loyalty-point-balance';

export const setValue = createAction(
    '[Loyalty Points Component] Set Value',
    props<{ loyaltyPointBalance: LoyaltyPointBalance[] }>()
);
