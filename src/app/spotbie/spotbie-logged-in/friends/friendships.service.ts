import { Injectable } from '@angular/core';
import * as spotbieGlobals from '../../../globals';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from 'src/app/helpers/error-helper';
import { FriendActionsComponent } from '../../profile-header/friend-actions/friend-actions.component';
import { PendingFriendActionsComponent } from './pending-friends/pending-friend-actions/pending-friend-actions.component';

const FRIENDS_API = spotbieGlobals.API + "friendship";

@Injectable({
  providedIn: 'root'
})
export class FriendshipsService {

  constructor(private http: HttpClient) { }

  public blockUser(peerId: any): Observable<any>{    

    const blockApi = `${FRIENDS_API}/block`
    const blockObj = {
      peer_id: peerId
    }

    return this.http.post<any>(blockApi, blockObj).pipe(
      catchError(handleError("blockUser"))
    )

  }

  public unblockUser(peerId: any): Observable<any>{    

    const unblockApi = `${FRIENDS_API}/unblock`
    const unblockObj = {
      _method: 'DELETE',
      peer_id: peerId
    }

    return this.http.post<any>(unblockApi, unblockObj).pipe(
      catchError(handleError("unblockUser"))
    )

  }

  public unfriend(peer_id: any): Observable<any>{    

    const unfriend_api = `${FRIENDS_API}/unfriend`
    const unfriend_obj = {
      _method: 'DELETE',
      peer_id: peer_id
    }

    return this.http.post<any>(unfriend_api, unfriend_obj).pipe(
      catchError(handleError("unfriend"))
    )

  }

  public befriend(peerId: any): Observable<any>{    

    const addFriendApi = `${FRIENDS_API}/add_friend`
    const befriendObj = {
      peer_id: peerId
    }

    return this.http.post<any>(addFriendApi, befriendObj).pipe(
      catchError(handleError("befriend"))
    )

  }

  public acceptFriend(userId: any): Observable<any>{    

    const acceptFriendApi = `${FRIENDS_API}/accept`
    const acceptFriendObj = {
      _method: 'PUT',
      user_id: userId
    }

    return this.http.post<any>(acceptFriendApi, acceptFriendObj).pipe(
      catchError(handleError("acceptFriend"))
    )

  }

  public declineFriend(userId: any): Observable<any>{    

    const declineFriendApi = `${FRIENDS_API}/decline`
    const declineFriendObj = {
      _method: 'DELETE',
      user_id: userId
    }

    return this.http.post<any>(declineFriendApi, declineFriendObj).pipe(
      catchError(handleError("declineFriend"))
    )

  }

  public aroundMe(aroundMeObj: any): Observable<any>{    

    const aroundMeApi = `${FRIENDS_API}/show_nearby`

    return this.http.post<any>(aroundMeApi, aroundMeObj).pipe(
      catchError(handleError("befriend"))
    )

  }

  public report(peerId: number, reportReason: number): Observable<any>{    

    const reportPeerId = `${FRIENDS_API}/report`
    const reportObj = {
      peer_id: peerId,
      report_reason: reportReason
    }

    return this.http.post<any>(reportPeerId, reportObj).pipe(
      catchError(handleError("report"))
    )

  }

  public cancelRequest(peerId: number): Observable<any>{

    const cancelRequestApi = `${FRIENDS_API}/cancel_request`
    const cancelRequestObj = {
      _method: 'DELETE',
      peer_id: peerId
    }

    return this.http.post<any>(cancelRequestApi, cancelRequestObj).pipe(
      catchError(handleError("report"))
    )

  }

  public checkRelationship(peerId: number): Observable<any>{

    const checkRelationshipApi = `${FRIENDS_API}/check_relationship`

    const checkRelationshipObj = {
      peer_id: peerId
    } 

    return this.http.post<any>(checkRelationshipApi, checkRelationshipObj).pipe(
      catchError(handleError("checkRelationship"))
    )

  }

  public viewProfile(component: any){

    component.closeWindow()
    component.router.navigate([`/user-profile/${component.peer.user.username}`])

  }

}
