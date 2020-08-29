import { I_CommentSubject } from '../../spotbie/comments/comment-interface/comment-subject.interface'
import { StreamerService } from '../streamer-services/streamer.service'
import { I_StreamPost } from '../streamer-interfaces/stream-post'
import { videoEmbedCheck } from 'src/app/helpers/video-check'
import { DomSanitizer } from '@angular/platform-browser'
import { User } from 'src/app/models/user'
import { Observable } from 'rxjs'

export class StreamPost implements I_StreamPost, I_CommentSubject {

    private _stream_post_id: number
    private _original_post: StreamPost
    private _stream_by: User
    private _stream_content: string
    private _extra_media: number
    private _status: number 
    private _loc_x: string
    private _loc_y: string
    private _last_update: string
    public stream_actions: boolean = false
    public open_comments: boolean = false
    private _stream_link: string
    private _dated: string
    private _spotbie_user: any
    private _extra_media_obj: any
    private _likes_count: number
    private _comments_count: number
    private _stream_post_first_comments: any
    private _video_embed: boolean
    private _video_embed_link: any
    private _poster: any
    private _repost: boolean = false

    public liked_by_me: any

    constructor(stream_post: any, 
                private _streamer_service: StreamerService, 
                private _sanitizer: DomSanitizer) {

        this.spotbie_user = stream_post.spotbie_user 
        this.stream_by = stream_post.user
        this.stream_post_id = stream_post.id 
        this.stream_content = stream_post.stream_content 
        
        this.status = stream_post.status 
        
        this.extra_media = stream_post.extra_media 
        this.extra_media_obj = stream_post.extra_media_list

        this.dated = stream_post.updated_at
        this.last_update = stream_post.last_update

        this.stream_actions = stream_post.stream_actions 
        this.stream_link = stream_post.stream_link 

        this.comments_count = stream_post.comments_count 
        this.stream_post_first_comments = stream_post.stream_post_first_comments

        this.likes_count = stream_post.likes_count

        this.original_post = stream_post.original_post

    }

    public deleteComment(stream_post_comment_id: number): Observable<any>{

        const stream_comment_object = {
            stream_post_comment_id : stream_post_comment_id,
            stream_post_id : this.stream_post_id,
        } 
          
        return this._streamer_service.deleteStreamPostComment(stream_comment_object)        

    }

    public addComment(comment: string): Observable<any>{

        const stream_comment_object = {
            stream_post_comment : comment,
            stream_post_id : this.stream_post_id,
            users_glued : ''
        }   

        return this._streamer_service.addStreamPostComment(stream_comment_object)   

    }
    
    public pullComments(page: number): Observable<any>{

        const stream_obj = { stream_post_id : this._stream_post_id,  
            stream_post_comments_iter : page
        }

        return this._streamer_service.pullStreamPostComments(stream_obj)

    }

    get dated(): string { return this._dated }
    set dated(value: string) { 

        let date = new Date(value)
       
        let hours = date.getUTCHours()
        let minutes = date.getUTCMinutes()

        let ampm = hours >= 12 ? 'pm' : 'am'

        hours = hours % 12
        hours = hours ? hours : 12 // the hour '0' should be '12'

        let new_minutes = minutes < 10 ? '0'+minutes : minutes
        
        let strTime = hours + ':' + new_minutes + ' ' + ampm

        this._dated = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getUTCFullYear() + " - " + strTime

    }

    get comments_count(): number { return this._comments_count }
    set comments_count(value: number) { this._comments_count = value }

    get stream_post_first_comments(): any { return this._stream_post_first_comments }
    set stream_post_first_comments(value: any) { this._stream_post_first_comments = value }

    get likes_count(): number { return this._likes_count }
    set likes_count(value: number) { this._likes_count = value }

    get poster(): string { return this._poster}
    set poster(value: string) { this._poster = value }

    get repost(): boolean { return this._repost}
    set repost(value: boolean) { this._repost = value }

    get extra_media_obj(): any { return this._extra_media_obj }
    set extra_media_obj(extra_media_obj: any) { 

        this._extra_media_obj = extra_media_obj
        
        if(extra_media_obj !== undefined){

            extra_media_obj.forEach(extra_media => {
  
                if(extra_media.type == 'video'){
  
                  let poster = extra_media.content.split('.mp4')
                  this.poster = poster[0] + ".jpeg"
  
                }
  
            })
  
        }        
        
        //console.log("Extra MEdia Obj", this._extra_media_obj)

    }

    get spotbie_user(): any { return this._spotbie_user }
    set spotbie_user(value: any) { this._spotbie_user = value }

    get stream_post_id(): number { return this._stream_post_id }
    set stream_post_id(value: number) { this._stream_post_id = value }

    get stream_by(): User { return this._stream_by }
    set stream_by(user: User) { this._stream_by = user }

    get stream_content(): string { return this._stream_content }
    set stream_content(value: string) { 
        
        try{
            this._stream_content = unescape(decodeURI(value))
        } catch(err){
            this._stream_content = unescape(value)
        }        

        let video_link_embed = videoEmbedCheck(this._stream_content, this._sanitizer)

        if(video_link_embed !== 'no_video'){
            this.video_embed = true
            this.video_embed_link = video_link_embed
        } else {
            this.video_embed = false
            this.video_embed_link = ''
        }         

    }

    get extra_media(): number { return this._extra_media }
    set extra_media(value: number) { this._extra_media = value }

    get status(): number { return this._status }
    set status(value: number) { this._status = value }

    get loc_x(): string { return this._loc_x }
    set loc_x(value: string) { this._loc_x = value }

    get loc_y(): string { return this._loc_y }
    set loc_y(value: string) { this._loc_y = value }

    get last_update(): string { return this._last_update }
    set last_update(value: string) { this._last_update = value }

    get stream_link(): string { return this._stream_link }
    set stream_link(value: string) { this._stream_link = value }

    get original_post(): StreamPost { return this._original_post }
    set original_post(original_post: StreamPost) { 

        (original_post == null) ? this.repost = false : this.repost = true
        this._original_post = original_post 
        
    }
    
    get video_embed() : boolean { return this._video_embed }
    set video_embed(value : boolean) { this._video_embed = value }
    
    get video_embed_link() : any { return this._video_embed_link }
    set video_embed_link(value : any) { this._video_embed_link = value }    

}
