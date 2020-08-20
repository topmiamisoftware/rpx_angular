import { I_Album } from '../../interfaces/album-interfaces/album'

export class Album implements I_Album{
    
    public exe_album_id : number
    public is_new : boolean = false
    public exe_album_name : string
    public exe_album_description : string
    public exe_album_likes_list : any
    public exe_album_likes_count : string
    public exe_album_comments_list : any
    public exe_album_comments_count : string
    public album_privacy : string
    public cover : string

}