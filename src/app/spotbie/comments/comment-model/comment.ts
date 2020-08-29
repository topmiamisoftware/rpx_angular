import { I_Comment } from '../comment-interface/comment.interface';
import { User } from 'src/app/models/user';
import { SpotbieUser } from 'src/app/models/spotbieuser';

export class Comment implements I_Comment{
    
    public album_id: number
    public album_item_id: number
    public comment: string
    public created_at: string
    public updated_at: string
    public id: number
    public spotbie_user: SpotbieUser
    public user: User
    
    constructor(comments_object: I_Comment){

        this.album_id = comments_object.album_id
        this.album_item_id = comments_object.album_id
        this.comment = comments_object.comment
        this.created_at = comments_object.created_at
        this.updated_at = comments_object.updated_at
        this.id = comments_object.id
        this.spotbie_user = comments_object.spotbie_user
        this.user = comments_object.user

    }   

}