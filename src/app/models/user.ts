import { SpotbieUser } from './spotbieuser'

export class User {

    public id: number = null // (11)

    public username: string = null // (35)

    public email: string = null // (135)

    public exe_date_joined: string = null // (timestamp)
    
    public exe_user_type: string = null // (35)

    public exe_user_status: number = null

    public exe_user_confirm: string = null
    
    public exe_user_default_picture: string = null

    public exe_user_first_name: string = null
    public exe_user_last_name: string = null
    public exe_user_full_name: string = null

    public exe_user_stream_id: number = null

    public last_log: string = null
    public exe_animal: string = null 
    public exe_birthdate: string = null
    public exe_desc: string = null
    public last_prof_pic: string = null
    public last_loc_date: string = null
    public last_loc: string = null
    public last_ip: string = null
    public exe_sign: string = null
    public privacy: number = null
    public ghost: number = null
    public my_ads: number = null
    public mature: number = null
    public ph: string = null

    public profile_pictures: Array<any> = []

    public acc_splash: string
    public acc_splash_date: string
    public acc_sp_ty: string

    public exe_background_color: string = null

    public place_attributes: any

    public spotbie_place_address: any
    public spotbie_origin: any
    public spotbie_origin_description: any

    public spotbie_user: SpotbieUser

    constructor(user_object?: any){



    }

}
