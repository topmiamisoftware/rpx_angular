import { Component, OnInit, Input } from '@angular/core';
import { BlockedUsersComponent } from '../blocked-users/blocked-users.component';
import { HttpResponse } from '../../../models/http-reponse';
import { FriendshipsService } from '../../../services/friendships.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-blocked-user-actions',
  templateUrl: './blocked-user-actions.component.html',
  styleUrls: ['./blocked-user-actions.component.css']
})
export class BlockedUserActionsComponent implements OnInit {

  @Input() blocked_user;

  public loading : boolean = false;

  public exe_api_key : string;

  public successful_action : boolean = false;

  public successful_action_title : string;

  public successful_action_description : string;
  
  public questions_answer : boolean;

  public isMobile : boolean;

  public isDesktop : boolean;

  constructor(private host : BlockedUsersComponent,
              private friendshipServices : FriendshipsService,
              private  deviceDetector : DeviceDetectorService) { }
  
  report(){
    console.log("Hello World");
  }

  unblockUser(){
    this.loading = true;
    let block_user_obj = { exe_api_key : this.exe_api_key, exe_friend_action : "unblockUser", exe_friend_id : this.blocked_user.user_info.exe_user_id};
    this.friendshipServices.blockUserService(block_user_obj, function(a){this.unblockUserCallback(a);}.bind(this));
  }

  unblockUserCallback(httpResponse : HttpResponse){
    if(httpResponse.status == "200" && httpResponse.responseObject == "unblocked"){
      this.successful_action_title = "User was unblocked.";
      this.successful_action_description = "You have unblocked \"" + this.blocked_user.user_info.exe_username + "\".";
      this.successful_action = true;
      let pending_index = this.host.blocked_list.indexOf(this.blocked_user);
      this.host.blocked_list.splice(pending_index, 1);
      setTimeout(function(){
        this.host.show_blocked_actions = false;
        this.successful_action = false;
      }.bind(this), 2500);
      this.loading = false;  
    } else {
      alert("Problem with app. Please re-fresh/re-open.");
      console.log("unblockUserCallback Error : ", httpResponse);
    }    
  }

  friendUser(){
    this.loading = true;
    let block_user_obj = { exe_api_key : this.exe_api_key, exe_friend_action : "friendUser", exe_friend_id : this.blocked_user.user_info.exe_user_id};
    this.friendshipServices.friendService(block_user_obj, function(a){this.friendUserCallback(a);}.bind(this));
  }

  friendUserCallback(httpResponse : HttpResponse){
    if(httpResponse.status == "200"){
      if(httpResponse.responseObject == "questions"){
        this.questions_answer = true;
      } else if(httpResponse.responseObject == "requested"){
        this.successful_action_title = "User friendship requested.";
        this.successful_action_description = "You have requested to be friends with \"" + this.blocked_user.user_info.exe_username + "\".";
        this.successful_action = true;
        let pending_index = this.host.blocked_list.indexOf(this.blocked_user);
        this.host.blocked_list.splice(pending_index, 1);
        setTimeout(function(){
          this.host.show_blocked_actions = false;
          this.successful_action = false;
        }.bind(this), 2500);       
      } 
      this.loading = false;
    } else {
      alert("Problem with app. Please re-fresh/re-open.");
      console.log("unblockUserCallback Error : ", httpResponse);
    }    
  }
  friendRequested(){
      this.questions_answer = false;
      this.successful_action_title = "User friendship requested.";
      this.successful_action_description = "You have requested to be friends with \"" + this.blocked_user.user_info.exe_username + "\".";
      this.successful_action = true;
      let pending_index = this.host.blocked_list.indexOf(this.blocked_user);
      this.host.blocked_list.splice(pending_index, 1);
      setTimeout(function(){
        this.host.show_blocked_actions = false;
        this.successful_action = false;
      }.bind(this), 2500);
      this.loading = false;
  }
  closeWindow(){
    this.host.show_blocked_actions = false;
  }
  closeChildWindow(window_to_close){
    window_to_close = false;
  }
  ngOnInit() {
    //console.log("Pending Friend Input : ", this.pending_friend);
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey');
    if(this.deviceDetector.isMobile())
      this.isMobile = true;
    else
      this.isDesktop = true;    
  }
}