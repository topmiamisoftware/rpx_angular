import { Component, OnInit, Input } from '@angular/core'
import { DeviceDetectorService } from 'ngx-device-detector'
import { HttpResponse } from '@angular/common/http'
import { BlockedUsersComponent } from '../blocked-users.component'
import { FriendshipsService } from 'src/app/services/friendships.service'

@Component({
  selector: 'app-blocked-user-actions',
  templateUrl: './blocked-user-actions.component.html',
  styleUrls: ['./blocked-user-actions.component.css']
})
export class BlockedUserActionsComponent implements OnInit {

  @Input() blocked_user

  public loading : boolean = false

  public exe_api_key : string

  public successful_action : boolean = false

  public successful_action_title : string

  public successful_action_description : string
  
  public questions_answer : boolean

  public isMobile : boolean

  public isDesktop : boolean

  constructor(private host : BlockedUsersComponent,
              private friendshipServices : FriendshipsService,
              private  deviceDetector : DeviceDetectorService) { }
  
  report(){}

  unblockUser(){

    this.loading = true
    let block_user_obj = { exe_api_key : this.exe_api_key, exe_friend_action : "unblockUser", exe_friend_id : this.blocked_user.user_info.exe_user_id}
    this.friendshipServices.blockUserService(block_user_obj, function(a){this.unblockUserCallback(a)}.bind(this))

  }

  unblockUserCallback(http_response : HttpResponse<any>){

    if(http_response.status === 200 && http_response.body.responseObject == "unblocked"){

      this.successful_action_title = "User was unblocked."
      this.successful_action_description = "You have unblocked \"" + this.blocked_user.user_info.exe_username + "\"."
      this.successful_action = true

      let pending_index = this.host.blocked_list.indexOf(this.blocked_user)

      this.host.blocked_list.splice(pending_index, 1)

      setTimeout(function(){
        this.host.show_blocked_actions = false
        this.successful_action = false
      }.bind(this), 2500)

      this.loading = false  

    } else {

      console.log("unblockUserCallback Error : ", http_response)

    }    

  }

  friendUser(){

    this.loading = true

    let block_user_obj = { exe_api_key : this.exe_api_key, exe_friend_action : "friendUser", exe_friend_id : this.blocked_user.user_info.exe_user_id}

    this.friendshipServices.friendService(block_user_obj, function(a){this.friendUserCallback(a)}.bind(this))

  }

  friendUserCallback(http_response : HttpResponse<any>){

    if(http_response.status === 200){

      if(http_response.body.responseObject == "questions"){

        this.questions_answer = true

      } else if(http_response.body.responseObject == "requested"){

        this.successful_action_title = "User friendship requested."
        this.successful_action_description = "You have requested to be friends with \"" + this.blocked_user.user_info.exe_username + "\"."
        this.successful_action = true

        let pending_index = this.host.blocked_list.indexOf(this.blocked_user)
        this.host.blocked_list.splice(pending_index, 1)

        setTimeout(function(){
          this.host.show_blocked_actions = false
          this.successful_action = false
        }.bind(this), 2500)  

      } 

      this.loading = false

    } else {

      console.log("Friend User Callback Error", http_response)

    }    

  }

  friendRequested(){

      this.questions_answer = false
      this.successful_action_title = "User friendship requested."
      this.successful_action_description = "You have requested to be friends with \"" + this.blocked_user.user_info.exe_username + "\"."
      this.successful_action = true

      let pending_index = this.host.blocked_list.indexOf(this.blocked_user)
      this.host.blocked_list.splice(pending_index, 1)

      setTimeout(function(){
        this.host.show_blocked_actions = false
        this.successful_action = false
      }.bind(this), 2500)

      this.loading = false

  }

  closeWindow(){
    this.host.show_blocked_actions = false
  }

  closeChildWindow(window_to_close){
    window_to_close = false
  }

  ngOnInit() {

    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')

    if(this.deviceDetector.isMobile())
      this.isMobile = true
    else
      this.isDesktop = true    

  }

}