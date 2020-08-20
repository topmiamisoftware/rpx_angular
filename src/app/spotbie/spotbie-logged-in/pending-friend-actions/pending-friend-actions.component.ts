import { Component, OnInit, Input } from '@angular/core';
import { PendingFriendsComponent } from '../pending-friends/pending-friends.component';
import * as spotbieGlobals from '../../../globals';
import { HttpResponse } from '../../../models/http-reponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FriendshipsService } from '../../../services/friendships.service';
import { DeviceDetectorService } from 'ngx-device-detector';

const FRIENDS_API = spotbieGlobals.API + "api/friends_general.service.php";

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};
@Component({
  selector: 'app-pending-friend-actions',
  templateUrl: './pending-friend-actions.component.html',
  styleUrls: ['./pending-friend-actions.component.css']
})
export class PendingFriendActionsComponent implements OnInit {

  @Input() pending_friend;

  public loading : boolean = false;

  private exe_api_key : string;

  public successful_action : boolean = false;

  public successful_action_title : string;

  public successful_action_description : string;

  public my_id : string;

  public isMobile : boolean;

  public isDesktop : boolean;

  constructor(private host : PendingFriendsComponent,
              private http: HttpClient,
              private friendshipService : FriendshipsService,
              private deviceDetector : DeviceDetectorService) { }

  report(){
    console.log("Hello World");
  }

  blockUser(){
    this.loading = true;
    let block_user_obj = { exe_api_key : this.exe_api_key, exe_friend_action : "blockUser", exe_friend_id : this.pending_friend.user_info.exe_user_id};
    this.friendshipService.blockUserService(block_user_obj, function(a){this.blockUserCallback(a);}.bind(this));
  }

  blockUserCallback(httpResponse : HttpResponse){
    if(httpResponse.status == "200" && httpResponse.responseObject == "blocked"){
      this.successful_action_title = "User was blocked.";
      this.successful_action_description = "You have blocked \"" + this.pending_friend.user_info.exe_username + "\".";
      this.successful_action = true;
      let pending_index = this.host.pending_list.indexOf(this.pending_friend);
      this.host.pending_list.splice(pending_index, 1);
      setTimeout(function(){
        this.host.show_pending_actions = false;
        this.successful_action = false;
      }.bind(this), 2500);
      this.loading = false;  
    } else {
      alert("Problem with app. Please re-fresh/re-open.");
      console.log("cancelRequestCallback Error : ", httpResponse);
    }    
  }

  acceptRequest(){
    this.loading = true;
    let block_user_obj = { exe_api_key : this.exe_api_key, exe_friend_action : "acceptRequest", exe_friend_id : this.pending_friend.user_info.exe_user_id};
    this.friendshipService.blockUserService(block_user_obj, function(a){this.acceptRequestCallback(a);}.bind(this));
  }

  acceptRequestCallback(httpResponse : HttpResponse){
    if(httpResponse.status == "200" && httpResponse.responseObject == "accepted"){
      this.successful_action_title = "Friend request accepted.";
      this.successful_action_description = "You and \"" + this.pending_friend.user_info.exe_username + "\" are now friends.";
      this.successful_action = true;
      let pending_index = this.host.pending_list.indexOf(this.pending_friend);
      this.host.pending_list.splice(pending_index, 1);
      setTimeout(function(){
        this.host.show_pending_actions = false;
        this.successful_action = false;
      }.bind(this), 2500);
      this.loading = false;  
    } else {
      alert("Problem with app. Please re-fresh/re-open.");
      console.log("acceptRequestCallback Error : ", httpResponse);
    }    
  }

  cancelRequest(){
    this.loading = true;    
    let call_friends_obj = { exe_api_key : this.exe_api_key, exe_friend_action : "cancelRequest", exe_friend_id : this.pending_friend.user_info.exe_user_id};
    this.http.post<HttpResponse>(FRIENDS_API, call_friends_obj, HTTP_OPTIONS)
    .subscribe( resp => {
      let httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      });
      this.cancelRequestCallback(httpResponse);
    },
      error => {
        console.log("Cancel Friend Request Error : ", error);
    });   
  }
  
  cancelRequestCallback( httpResponse : HttpResponse){
    if(httpResponse.status == "200" && httpResponse.responseObject == "cancelled"){
      this.successful_action_title = "Friend request cancelled.";
      this.successful_action_description = "Your friendship request to \"" + this.pending_friend.user_info.exe_username + "\" was cancelled.";    
      this.successful_action = true;
      let pending_index = this.host.pending_list.indexOf(this.pending_friend);
      this.host.pending_list.splice(pending_index, 1);
      setTimeout(function(){
        this.host.show_pending_actions = false;
        this.successful_action = false;
      }.bind(this), 2500);
      this.loading = false;  
    } else {
      alert("Problem with app. Please re-fresh/re-open.");
      console.log("cancelRequestCallback Error : ", httpResponse);
    }
  }

  closeWindow(){
    this.host.show_pending_actions = false;
  }

  ngOnInit() {
    console.log("Pending Friend Input : ", this.pending_friend);
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey');
    this.my_id = localStorage.getItem('spotbie_userId');
    if(this.deviceDetector.isMobile())
      this.isMobile = true;
    else
      this.isDesktop = true;      
  }
}