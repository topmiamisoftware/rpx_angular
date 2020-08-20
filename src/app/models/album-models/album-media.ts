import { I_AlbumMedia } from 'src/app/interfaces/album-interfaces/album-media'
import { I_CommentSubject } from 'src/app/interfaces/comment-interface/comment-subject.interface'
import { AlbumService } from 'src/app/services/profile-header/albums/album-services/album.service'

export class AlbumMedia implements I_AlbumMedia, I_CommentSubject{

    public album_by : string
    public album_id : number
    public album_item_caption : string
    public album_media_content : string
    public album_media_id : number
    public album_media_type : string
    public album_username: string
    public file_path : string
    public file_type : string
    public poster ?: string
    public item_created : string
    public item_updated : string
    public total_comments : number
    public total_likes : number

    constructor(private album_media_item : any, private _album_service : AlbumService){
        this.album_by = album_media_item.album_by
        this.album_id = album_media_item.album_id
        this.album_item_caption = album_media_item.album_item_caption
        this.album_media_content = album_media_item.album_media_content
        this.album_media_id = album_media_item.album_media_id
        this.album_media_type = album_media_item.album_media_type
        this.album_username = album_media_item.album_username
        this.file_path = album_media_item.file_path
        this.file_type = album_media_item.file_type
        this.poster = album_media_item.poster
        this.item_created = album_media_item.item_created
        this.item_updated = album_media_item.item_updated
        this.total_comments = album_media_item.total_comments
        this.total_likes = album_media_item.total_likes
    }
    
    public deleteComment(comment_id : number, callback : Function){

        const exe_api_key = localStorage.getItem("spotbie_userApiKey")

        const album_media_comment_object = {
            upload_action : "deleteAlbumMediaComment",
            exe_api_key : exe_api_key,
            comment_id : comment_id,
            current_media_id : this.album_media_id
        }   

        this._album_service.deleteComment(album_media_comment_object, callback.bind(this)) 

    }

    public addComment(comment : string, callback : Function) : void {

        const exe_api_key = localStorage.getItem("spotbie_userApiKey")

        const album_media_comment_object = {
            upload_action : "addAlbumMediaComment",
            exe_api_key : exe_api_key,
            album_media_comment : comment,
            current_album : this.album_id,
            current_media_id : this.album_media_id,
            users_glued : ''
        }   

        this._album_service.addAlbumMediaComment(album_media_comment_object, callback.bind(this))     

    }
    
    public pullComments(comments_ite : number, callback : Function) : void {

        const exe_api_key = localStorage.getItem("spotbie_userApiKey");
        
        const album_media_comment_object = {
            upload_action : "pullAlbumMediaComments",
            exe_api_key : exe_api_key,
            current_album : this.album_id,
            current_media_id : this.album_media_id,
            comment_ite : comments_ite
        }

        this._album_service.pullAlbumComments(album_media_comment_object, callback.bind(this))
        
    }
}