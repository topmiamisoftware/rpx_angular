import { SpotbieUser } from './spotbieuser'
import { Business } from './business'
import {LoyaltyPointBalance} from './loyalty-point-balance';

export class User {
    id: number
    uuid: string
    username: string
    email: string
    trial_ends_at: string
    created_at: string
    updated_at: string
    spotbie_user: SpotbieUser
    business: Business
    lp_balance_list: LoyaltyPointBalance[]
}
