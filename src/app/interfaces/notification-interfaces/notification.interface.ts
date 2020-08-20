import { User } from 'src/app/models/user';

export interface I_Notification{
    
    user : User
    content : string
    date : string

    made_to : number
    made_by : number

}