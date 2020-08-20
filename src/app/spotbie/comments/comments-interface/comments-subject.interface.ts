export interface I_CommentsSubject{

    addAlbumMediaComment(comment : string, callback : Function) : void
    pullComments(comments_ite : number, callback : Function) : void

}