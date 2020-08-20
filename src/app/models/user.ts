export class User {

    public exe_user_id : number = null // (11)

    public username : string = null // (35)

    public exe_user_email : string = null // (135)

    public exe_date_joined : string = null // (timestamp)
    
    public exe_user_type : string = null // (35)

    public exe_user_status : number = null // (1)

    public exe_user_confirm : string = null // (160)
    
    public exe_user_default_picture : string = null // (100)

    public exe_user_first_name : string = null // (72)
    public exe_user_last_name : string = null // (72)
    public exe_user_full_name : string = null

    public exe_user_stream_id : number = null // (11)

    public last_log : string = null // (timestamp)
    public exe_animal : string = null // (30)
    public exe_birthdate : string = null // (timestamp)
    public exe_desc : string = null // (360)
    public last_prof_pic : string = null // (timestamp)
    public last_loc_date : string = null // (timestamp )
    public last_loc : string = null // (40)
    public last_ip : string = null // (36)
    public exe_sign : string = null // (30)
    public privacy : number = null // (1)
    public ghost : number = null // (11)
    public my_ads : number = null // (1)
    public mature : number = null // (1)
    public ph : string = null // (135)

    public profile_pictures : string[] = []

    public acc_splash : string
    public acc_splash_date : string
    public acc_sp_ty : string

    public exe_background_color : string = null

    public place_attributes : any

    public spotbie_place_address : any
    public spotbie_origin : any
    public spotbie_origin_description : any
    
}
