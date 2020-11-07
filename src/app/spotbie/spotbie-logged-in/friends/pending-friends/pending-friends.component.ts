import { Component, OnInit } from '@angular/core'
import * as spotbieGlobals from '../../../../globals'
import { HttpClient } from '@angular/common/http'

const FRIENDS_API = spotbieGlobals.API + "friendship"

@Component({
  selector: 'app-pending-friends',
  templateUrl: './pending-friends.component.html',
  styleUrls: ['../friends.component.css', './pending-friends.component.css']
})
export class PendingFriendsComponent implements OnInit {

  private page: number = 1

  public pending_list = [] 

  public load_more_pending: boolean = false

  public loading: boolean = false

  public show_pending_actions: boolean = false

  public current_pending

  constructor(private http: HttpClient){}

  public setCurrentPending(friend){    
    this.current_pending = friend
    this.show_pending_actions = true    
  }

  public initCallPending(): void{
    
    this.loading = true
    
    const pendingFriendsApi = `${FRIENDS_API}/show_pending`
    const showPendingObj = {
      page: this.page
    }

    this.http.post<any>(pendingFriendsApi, showPendingObj).subscribe(
      resp => {
        this.callPendingCallback(resp)
      },
      error => {
        console.log("initCallPending", error)
      }
    )    

  }

  private callPendingCallback(httpResonse: any){

    if(httpResonse.success){      

      const currentPage = httpResonse.pending_friends_list.current_page
      const lastPage = httpResonse.pending_friends_list.last_page

      httpResonse.pending_friends_list.data.forEach(friend => {
        this.pending_list.push(friend)
      })      

      if(currentPage < lastPage){
        this.page++
        this.load_more_pending = true
      } else
        this.load_more_pending = false

      this.loading = false

    } else
      console.log("callPendingCallback", httpResonse)

  }

  public loadMorePending(){
    this.initCallPending()
  }

  ngOnInit() {
    this.initCallPending()
  }

}