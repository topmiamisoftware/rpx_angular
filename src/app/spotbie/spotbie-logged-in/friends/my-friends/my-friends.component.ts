import { Component, OnInit } from '@angular/core'
import * as spotbieGlobals from '../../../../globals'
import { HttpClient } from '@angular/common/http'
import { catchError } from 'rxjs/operators'
import { handleError } from 'src/app/helpers/error-helper'

const FRIENDS_API = spotbieGlobals.API + "friendship"

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['../friends.component.css', './my-friends.component.css']
})
export class MyFriendsComponent implements OnInit {

  private page: number = 1

  public friends_list = [] 

  public load_more_friends: boolean = false

  public loading: boolean = false

  public no_spotbie_friends: boolean = false

  public current_friend: string

  public show_friend_actions: boolean = false

  constructor(private http: HttpClient){}
  
  public setCurrentFriend(friend){

    this.show_friend_actions = true
    this.current_friend = friend

  }

  public initCallFriends(): void{

    this.loading = true

    const show_friends_api = `${FRIENDS_API}/show-friends`

    const friendsObj = {
      page: this.page
    }

    this.http.post<any>(show_friends_api, friendsObj).pipe(
      catchError(handleError("initCallFriends"))
    ).subscribe( 
      resp => {
        this.callFriendsCallback(resp)
      },
        error => {
          console.log("initCallFriends", error)
      }
    )

  }

  private callFriendsCallback(http_response: any): void{

    if(http_response.message === 'success'){  
      
      const current_page = http_response.friend_list.current_page
      const last_page =  http_response.friend_list.last_page

      http_response.friend_list.data.forEach(friend => {
        this.friends_list.push(friend)
      })      

      if(current_page < last_page){
        this.page++
        this.load_more_friends = true
      } else
        this.load_more_friends = false

      if(this.friends_list.length == 0)
        this.no_spotbie_friends = true

      this.loading = false

    } else
      console.log("Error callFriendsCallback: ", http_response)

  }

  public loadMoreFriends(){
    this.initCallFriends()
  }

  ngOnInit() {
    this.initCallFriends()
  }

}