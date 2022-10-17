import { createReducer, on } from '@ngrx/store';
import { setValue } from './loyalty-points.actions';
import { LoyaltyPointBalance } from '../../../models/loyalty-point-balance'

export const initialState: LoyaltyPointBalance[] = []

const _loyaltyPointsReducer = createReducer(
  initialState,
  on(setValue, (state, { loyaltyPointBalance }) => loyaltyPointBalance),
);

export function loyaltyPointsReducer(state, action) {
  return _loyaltyPointsReducer(state, action);
}
