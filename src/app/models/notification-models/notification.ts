import { I_Notification } from 'src/app/interfaces/notification-interfaces/notification.interface'
import { User } from '../user'

export class Notification implements I_Notification{

    user : User
    content : string
    date : string
    
    made_to : number
    made_by : number

}
