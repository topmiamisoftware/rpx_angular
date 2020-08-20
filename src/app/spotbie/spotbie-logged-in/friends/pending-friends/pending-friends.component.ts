import { Component, OnInit } from '@angular/core'
import * as spotbieGlobals from '../../../../globals'
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'

const FRIENDS_API = spotbieGlobals.API + "api/friends_general.service.php"

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}
@Component({
  selector: 'app-pending-friends',
  templateUrl: './pending-friends.component.html',
  styleUrls: ['../friends.component.css', './pending-friends.component.css']
})
export class PendingFriendsComponent implements OnInit {

  private exe_api_key : string

  private pending_ite : number = 0

  public pending_list = [] 

  public load_more_pending : boolean = false

  public loading : boolean = false

  public show_pending_actions : boolean = false

  public current_pending

  constructor(private http: HttpClient){}

  public setCurrentPending(friend){
    this.current_pending = friend
    this.show_pending_actions = true    
  }

  public initCallPending(){
    
    this.loading = true
    
    let call_friends_obj = { exe_api_key : this.exe_api_key, exe_friend_action : "getMyPending",  exe_friends_ite : this.pending_ite, public_exe_user_id : 'null'}
    
    this.http.post<HttpResponse<any>>(FRIENDS_API, call_friends_obj, HTTP_OPTIONS)
    .subscribe( resp => {
      this.callPendingCallback(resp)
    },
      error => {
        console.log("Pending Friends Error", error)
    })    
  }

  private callPendingCallback(http_response : HttpResponse<any>){

    if(http_response.status === 200){      

      http_response.body.responseObject.forEach(friend => {
        this.pending_list.push(friend)
      })      

      if(http_response.body.responseObject.length > 6){
        this.pending_ite = this.pending_ite + 6
        this.pending_list.pop()
        this.load_more_pending = true
      } else
        this.load_more_pending = false

      this.loading = false

    } else
      console.log("Call Pending Callback Error", http_response)

  }

  public loadMorePending(){
    this.initCallPending()
  }

  ngOnInit() {
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
    this.initCallPending()
  }

}