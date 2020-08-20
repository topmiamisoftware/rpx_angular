export interface I_Album{

    id : number
    name : string
    user_id: number
    description: string
    like_list: any
    likes_count: string
    comment_list: any
    comments_count: string
    privacy: string
    cover: string
    updated_at: string
    created_at: string

    is_new: boolean

}