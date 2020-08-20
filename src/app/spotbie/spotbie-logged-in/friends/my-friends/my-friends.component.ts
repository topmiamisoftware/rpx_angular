import { Component, OnInit } from '@angular/core'
import * as spotbieGlobals from '../../../../globals'
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'

const FRIENDS_API = spotbieGlobals.API + "api/friends_general.service.php"

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}
@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['../friends.component.css', './my-friends.component.css']
})
export class MyFriendsComponent implements OnInit {

  private exe_api_key : string

  private friends_ite : number = 0

  public friends_list = [] 

  public load_more_friends : boolean = false

  public loading : boolean = false

  public no_spotbie_friends : boolean = false

  public current_friend : string

  public show_friend_actions : boolean = false

  constructor(private http: HttpClient){}
  
  public setCurrentFriend(friend){
    this.show_friend_actions = true
    this.current_friend = friend
  }

  public initCallFriends(){

    this.loading = true

    let call_friends_obj = { exe_api_key : this.exe_api_key, exe_friend_action : "getMyFriends",  exe_friends_ite : this.friends_ite, public_exe_user_id : 'null'}
    
    this.http.post<HttpResponse<any>>(FRIENDS_API, call_friends_obj, HTTP_OPTIONS)
    .subscribe( resp => {
      this.callFriendsCallback(resp)
    },
      error => {
        console.log("Call Friends Error", error)
    }) 

  }

  private callFriendsCallback(http_response : HttpResponse<any>){

    if(http_response.status === 200){  
          
      http_response.body.responseObject.forEach(friend => {
        friend = JSON.parse(friend)
        this.friends_list.push(friend)
      })      

      if(http_response.body.responseObject.length > 20){
        this.friends_ite = this.friends_ite + 20
        this.friends_list.pop()
        this.load_more_friends = true
      } else {
        this.load_more_friends = false
      }

      if(this.friends_list.length == 0){
        this.no_spotbie_friends = true
      }

      this.loading = false
      //console.log("your friends are : ", this.friends_list)    
    } else
      console.log("Error callFriendsCallback : ", http_response)

  }

  public loadMoreFriends(){
    this.initCallFriends()
  }

  ngOnInit() {
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
    this.initCallFriends()
  }

}