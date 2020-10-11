import { Component, OnInit } from '@angular/core'
import * as spotbieGlobals from '../../../../globals'
import { HttpClient } from '@angular/common/http'
import { FriendshipsService } from 'src/app/services/friendships.service'

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
    
    const pending_friends_apis = `${FRIENDS_API}/show_pending?page=${this.page}`

    this.http.get<any>(pending_friends_apis).subscribe(
      resp => {
        this.callPendingCallback(resp)
      },
      error => {
        console.log("initCallPending", error)
      }
    )    

  }

  private callPendingCallback(http_response: any){

    if(http_response.success){      

      const current_page = http_response.current_page
      const last_page = http_response.last_page

      http_response.pending_friends_list.data.forEach(friend => {
        this.pending_list.push(friend)
      })      

      if(current_page < last_page){
        this.page++
        this.load_more_pending = true
      } else
        this.load_more_pending = false

      this.loading = false

    } else
      console.log("callPendingCallback", http_response)

  }

  public loadMorePending(){
    this.initCallPending()
  }

  ngOnInit() {
    this.initCallPending()
  }

}