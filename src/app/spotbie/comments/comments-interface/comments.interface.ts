export interface I_Comments{

    c_id : number
    user_id : number
    comment : string
    comment_date : string
    album_media_id : number
    users_glued : string
    comment_read : number

    deleteAlbumMediaComment() : void    
    
}