import { User } from 'src/app/models/user';
import { SpotbieUser } from 'src/app/models/spotbieuser';

export interface I_Comment{

    album_id: number
    album_item_id: number
    comment: string
    created_at: string
    updated_at: string
    id: number
    spotbie_user: SpotbieUser
    user: User
    
}