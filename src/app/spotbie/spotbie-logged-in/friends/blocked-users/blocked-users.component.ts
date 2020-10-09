import { Component, OnInit } from '@angular/core'
import * as spotbieGlobals from '../../../../globals'
import { HttpClient } from '@angular/common/http'

const FRIENDS_API = spotbieGlobals.API + "friendship"

@Component({
  selector: 'app-blocked-users',
  templateUrl: './blocked-users.component.html',
  styleUrls: ['../friends.component.css', './blocked-users.component.css']
})
export class BlockedUsersComponent implements OnInit {

  private page: number = 1

  public blocked_list = [] 

  public load_more_blocked: boolean = false

  public loading: boolean = false

  public show_blocked_actions: boolean = false

  public current_blocked

  constructor(private http: HttpClient){}

  public setCurrentPending(friend){
    console.log(friend)
    this.current_blocked = friend
    this.show_blocked_actions = true    
  }

  public initCallBlocked(){

    this.loading = true
    
    const blocked_friendships_api = `${FRIENDS_API}/show_blocked?page=${this.page}`

    this.http.get<any>(blocked_friendships_api).subscribe(
      resp => {
        this.callBlockedCallback(resp)
      },
      error => {
        console.log("initCallBlocked", error)
      }
    )    

  }

  private callBlockedCallback(httpResponse: any){

    console.log("callBlockedCallback", httpResponse)

    if(httpResponse.message == "success"){   

      const current_page = httpResponse.blocked_friendships_list.current_page
      const last_page = httpResponse.blocked_friendships_list.last_page

      httpResponse.blocked_friendships_list.data.forEach(friend => {
        this.blocked_list.push(friend)
      })      

      if(current_page < last_page){
        this.page++
        this.load_more_blocked = true
      } else 
        this.load_more_blocked = false

      this.loading = false

    } else
      console.log("callBlockedCallback", httpResponse)
    
  }

  public loadMoreBlocked(){
    this.initCallBlocked()
  }

  ngOnInit() {
    this.initCallBlocked()
  }

}