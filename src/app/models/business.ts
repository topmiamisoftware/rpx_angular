import { LoyaltyPointBalance } from "./loyalty-point-balance"

export class Business {

    public id: number = null
    public user_id: number = null
    public name: string = null
    public photo: string = null
    public description: string = null
    public address: string = null
    public loc_x: number = null
    public loc_y: number = null
    public created_at: string = null
    public updated_at: string = null
    public qr_code_link: string = null

    public type_of_info_object: string = null
    public is_community_member: boolean = true

    public cleanCategories: string = null
    public categories: number[] = []

    public rewardRate: number = null

    public loyalty_point_dollar_percent_value: number = null
    public balance: number = null

    public user_type: number | string = null

    public trial_ends_at: string = null
    
}   
