import { SpotbieUser } from './spotbieuser'
import { Business } from './business'

export class User {

    public id: number = null
    public uuid: string = null
    public username: string = null
    public email: string = null

    public trial_ends_at: string = null

    public created_at: string = null

    public updated_at: string = null

    public spotbie_user: SpotbieUser

    public business: Business

    constructor(user_object?: any){}

}
