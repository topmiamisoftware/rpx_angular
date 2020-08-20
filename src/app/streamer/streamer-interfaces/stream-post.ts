import { StreamPost } from '../streamer-models/stream-post';

export interface I_StreamPost {

    stream_post_id: number
    original_post: StreamPost
    stream_by: any
    stream_content: string
    extra_media: number
    status: number
    loc_x: string
    loc_y: string
    last_update: string
    stream_actions : boolean
    open_comments : boolean
    stream_link: string
    dated : string
    spotbie_user : any
    extra_media_obj : any
    likes_count : number
    comments_count : number
    stream_post_first_comments : any
    
    liked_by_me : any

}
