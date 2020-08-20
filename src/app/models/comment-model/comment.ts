import { I_Comment } from '../../interfaces/comment-interface/comment.interface';

export class Comment implements I_Comment{
    
    public c_id : number
    public user_id : number
    public comment : string
    public comment_date : string
    public users_glued : string
    public comment_read : number
    
    constructor(comments_object : any){
        this.c_id = comments_object.c_id
        this.user_id = comments_object.user_id
        this.comment = comments_object.comment
        this.comment_date = comments_object.comment_date
        this.users_glued = comments_object.users_glued
        this.comment_read = comments_object.comment_read
    }   

}