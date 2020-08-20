import { I_Comments } from '../comments-interface/comments.interface';

export class Comments implements I_Comments{
    
    public c_id : number
    public user_id : number
    public comment : string
    public comment_date : string
    public album_media_id : number
    public users_glued : string
    public comment_read : number
    
    constructor(comments_object : any){
        this.c_id = comments_object.c_id
        this.user_id = comments_object.user_id
        this.comment = comments_object.comment
        this.comment_date = comments_object.comment_date
        this.album_media_id = comments_object.album_media_id
        this.users_glued = comments_object.users_glued
        this.comment_read = comments_object.comment_read
    }

    public deleteAlbumMediaComment() : void{

    }   

}