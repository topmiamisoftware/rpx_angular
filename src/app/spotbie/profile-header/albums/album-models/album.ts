import { I_Album } from '../album-interfaces/album'

export class Album implements I_Album{

    public id: number
    public name: string
    public user_id: number
    public description: string
    public like_list: any
    public likes_count: string
    public comment_list: any
    public comments_count: string
    public privacy: string
    public cover: string
    public updated_at: string
    public created_at: string

    public is_new: boolean

}