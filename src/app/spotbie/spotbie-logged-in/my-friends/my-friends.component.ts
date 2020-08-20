import { Component, OnInit } from '@angular/core';
import * as spotbieGlobals from '../../../globals';
import { HttpResponse } from '../../../models/http-reponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const FRIENDS_API = spotbieGlobals.API + "api/friends_general.service.php";

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};
@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['../friends/friends.component.css', './my-friends.component.css']
})
export class MyFriendsComponent implements OnInit {

  private exe_api_key : string;

  private friends_ite : number = 0;

  public friends_list = []; 

  public load_more_friends : boolean = false;

  public loading : boolean = false;

  public no_spotbie_friends : boolean = false;

  public current_friend : string;

  public show_friend_actions : boolean = false;

  constructor(private http: HttpClient){}
  
  public setCurrentFriend(friend){
    this.show_friend_actions = true;
    this.current_friend = friend;
  }

  public initCallFriends(){
    this.loading = true;
    //console.log("Iteration : " + this.friends_ite);
    let call_friends_obj = { exe_api_key : this.exe_api_key, exe_friend_action : "getMyFriends",  exe_friends_ite : this.friends_ite, public_exe_user_id : 'null'};
    this.http.post<HttpResponse>(FRIENDS_API, call_friends_obj, HTTP_OPTIONS)
    .subscribe( resp => {
      let httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      });
      this.callFriendsCallback(httpResponse);
    },
      error => {
        console.log("Profile Contact Me Error : ", error);
    });    
  }

  private callFriendsCallback(httpResponse : HttpResponse){
    if(httpResponse.status == "200"){  
          
      httpResponse.responseObject.forEach(friend => {
        friend = JSON.parse(friend);
        this.friends_list.push(friend);
      });      

      if(httpResponse.responseObject.length > 20){
        this.friends_ite = this.friends_ite + 20;
        this.friends_list.pop();
        this.load_more_friends = true;
      } else {
        this.load_more_friends = false;
      }

      if(this.friends_list.length == 0){
        this.no_spotbie_friends = true;
      }

      this.loading = false;
      //console.log("your friends are : ", this.friends_list);    
    } else {
      console.log("Error callFriendsCallback : ", httpResponse);
    }
  }

  public loadMoreFriends(){
    this.initCallFriends();
  }

  ngOnInit() {
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey');
    this.initCallFriends();
  }
}