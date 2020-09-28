import { Injectable } from '@angular/core';
import * as spotbieGlobals from '../globals';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from '../helpers/error-helper';

const FRIENDS_API = spotbieGlobals.API + "friendship";

@Injectable({
  providedIn: 'root'
})
export class FriendshipsService {

  constructor(private http: HttpClient) { }

  public blockUser(user_id: any): Observable<any>{    

    const block_api = `${FRIENDS_API}/block`

    return this.http.post<any>(block_api, user_id).pipe(
      catchError(handleError("blockUser"))
    )

  }

  public unblockUser(user_id: any): Observable<any>{    

    const unblock_api = `${FRIENDS_API}/unblock`
    const unblock_obj = {
      _method: 'DELETE',
      user_id: user_id
    }

    return this.http.post<any>(unblock_api, unblock_obj).pipe(
      catchError(handleError("unblockUser"))
    )

  }

  public unfriend(user_id: any): Observable<any>{    

    const unfriend_api = `${FRIENDS_API}/unfriend`
    const unfriend_obj = {
      _method: 'DELETE',
      user_id: user_id
    }

    return this.http.post<any>(unfriend_api, unfriend_obj).pipe(
      catchError(handleError("unfriend"))
    )

  }

  public befriend(user_id: any): Observable<any>{    

    const add_friend_api = `${FRIENDS_API}/add_friend`

    return this.http.post<any>(add_friend_api, user_id).pipe(
      catchError(handleError("befriend"))
    )

  }

  public acceptFriend(user_id: any): Observable<any>{    

    const accept_friend_api = `${FRIENDS_API}/accept`
    const accept_friend_obj = {
      _method: 'PUT',
      user_id: user_id
    }

    return this.http.post<any>(accept_friend_api, accept_friend_obj).pipe(
      catchError(handleError("acceptFriend"))
    )

  }

  public declineFriend(user_id: any): Observable<any>{    

    const decline_friend_api = `${FRIENDS_API}/decline`
    const deline_friend_obj = {
      _method: 'PUT',
      user_id: user_id
    }

    return this.http.post<any>(decline_friend_api, deline_friend_obj).pipe(
      catchError(handleError("declineFriend"))
    )

  }

  public aroundMe(around_me_obj: any): Observable<any>{    

    const around_me_api = `${FRIENDS_API}/show_nearby?loc_x=${around_me_obj.loc_x}&loc_y=${around_me_obj.loc_y}&page=${around_me_obj.page}`

    return this.http.get<any>(around_me_api).pipe(
      catchError(handleError("befriend"))
    )

  }

}
