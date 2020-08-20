export interface I_CommentSubject{

    deleteComment(comment_id : number, callback : Function) : void
    addComment(comment : string, callback : Function) : void
    pullComments(comments_ite : number, callback : Function) : void

}