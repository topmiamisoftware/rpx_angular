import { Component, OnInit, Input } from '@angular/core'
import { MyFriendsComponent } from '../my-friends/my-friends.component'
import { DeviceDetectorService } from 'ngx-device-detector'
import { FriendshipsService } from 'src/app/services/friendships.service'
import { HttpResponse } from '@angular/common/http'

@Component({
  selector: 'app-friend-actions',
  templateUrl: './friend-actions.component.html',
  styleUrls: ['./friend-actions.component.css']
})
export class FriendActionsComponent implements OnInit {

  @Input() friend

  public loading : boolean = false

  public exe_api_key : string

  public successful_action : boolean = false

  public successful_action_title : string

  public successful_action_description : string  

  public isMobile : boolean

  public isDesktop : boolean

  constructor(private host : MyFriendsComponent,
    private friendshipSerivce : FriendshipsService,
    private  deviceDetector : DeviceDetectorService) { }

  blockUser(){
    this.loading = true
    let block_user_obj = { exe_api_key : this.exe_api_key, exe_friend_action : "blockUser", exe_friend_id : this.friend.exe_user_id}
    this.friendshipSerivce.blockUserService(block_user_obj, function(a){this.blockUserCallback(a)}.bind(this))
  }
  
  blockUserCallback(http_response : HttpResponse<any>){
    if(http_response.status === 200 && http_response.body.responseObject == "blocked"){
      this.successful_action_title = "User was blocked."
      this.successful_action_description = "You have blocked \"" + this.friend.exe_username + "\"."
      this.successful_action = true
      let friend_index = this.host.friends_list.indexOf(this.friend)
      this.host.friends_list.splice(friend_index, 1)
      setTimeout(function(){
        this.host.show_friend_actions = false
        this.successful_action = false
      }.bind(this), 2500)
      this.loading = false  
    } else {
      alert("Problem with app. Please re-fresh/re-open.")
      console.log("cancelRequestCallback Error : ", http_response)
    }    
  }
  
  unfriend(){
    this.loading = true
    let block_user_obj = { exe_api_key : this.exe_api_key, exe_friend_action : "unfriendUser", exe_friend_id : this.friend.exe_user_id}
    this.friendshipSerivce.unfriendService(block_user_obj, function(a){this.unfriendCallback(a)}.bind(this))
  }
  unfriendCallback(http_response : HttpResponse<any>){
    if(http_response.status === 200 && http_response.body.responseObject == "unfriended"){
      this.successful_action_title = "User was unfriended."
      this.successful_action_description = "You have unfriended \"" + this.friend.exe_username + "\"."
      this.successful_action = true
      let friend_index = this.host.friends_list.indexOf(this.friend)
      this.host.friends_list.splice(friend_index, 1)
      setTimeout(function(){
        this.host.show_friend_actions = false
        this.successful_action = false
      }.bind(this), 2500)
      this.loading = false  
    } else {
      alert("Problem with app. Please re-fresh/re-open.")
      console.log("cancelRequestCallback Error : ", http_response)
    }    
  }
  closeWindow(){
    this.host.show_friend_actions = false
  }
  ngOnInit() {
    
    //console.log("Friend Input : ", this.friend)
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
    
    if(this.deviceDetector.isMobile())
      this.isMobile = true
    else
      this.isDesktop = true

  }
}