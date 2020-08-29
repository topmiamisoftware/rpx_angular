import { Observable } from 'rxjs';

export interface I_CommentSubject{

    deleteComment(comment_id: number): Observable<any>
    addComment(comment: string): Observable<any>
    pullComments(comments_ite: number): Observable<any>

}