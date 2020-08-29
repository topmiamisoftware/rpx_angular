import { AlbumService } from '../album-services/album.service'
import { I_AlbumMedia } from '../album-interfaces/album-media'
import { I_CommentSubject } from 'src/app/spotbie/comments/comment-interface/comment-subject.interface'
import { Observable } from 'rxjs'

export class AlbumMedia implements I_AlbumMedia, I_CommentSubject{

    public album_by: string
    public album_id: number
    public album_item_caption: string
    public album_media_content: string
    public album_media_id: number
    public album_username: string
    public content: string
    public media_type: string
    public poster ?: string
    public _item_created: string
    public item_updated: string
    public comments_count: number
    public likes_count: number

    constructor(private album_media_item: any, private _album_service: AlbumService){

        this.album_by = album_media_item.album_owner_user_id
        this.album_id = album_media_item.album_id
        this.album_item_caption = escape(album_media_item.caption)
        this.album_media_content = album_media_item.content
        this.album_media_id = album_media_item.id
        this.album_username = album_media_item.album_username
        this.content = album_media_item.content
        this.media_type = album_media_item.media_type
        this.poster = album_media_item.poster
        this.item_created = album_media_item.created_at
        this.item_updated = album_media_item.updated_at
        this.comments_count = album_media_item.comments_count
        this.likes_count = album_media_item.likes_count

    }
    
    public set item_created(value: string){

        let date = new Date(value)
       
        let hours = date.getUTCHours()
        let minutes = date.getUTCMinutes()

        let ampm = hours >= 12 ? 'pm' : 'am'

        hours = hours % 12
        hours = hours ? hours : 12 // the hour '0' should be '12'

        let new_minutes = minutes < 10 ? '0'+minutes : minutes
        
        let strTime = hours + ':' + new_minutes + ' ' + ampm

        this._item_created = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getUTCFullYear() + " - " + strTime     
           
    }

    public get item_created(){
        return this._item_created
    }

    public deleteComment(comment_id: number): Observable<any>{

        return this._album_service.deleteComment(comment_id)

    }

    public addComment(comment: string): Observable<any>{

        const album_media_comment_object = {
            album_media_comment: comment,
            current_album: this.album_id,
            current_media_id: this.album_media_id,
            users_glued: ''
        }   

        return this._album_service.addAlbumMediaComment(album_media_comment_object)     

    }
    
    public pullComments(page: number): Observable<any> {
        return this._album_service.pullAlbumItemComments(this.album_media_id, page)
    }
    
}