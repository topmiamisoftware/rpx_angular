import { Component, OnInit } from '@angular/core';
import * as spotbieGlobals from '../../../globals';
import { HttpResponse } from '../../../models/http-reponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const FRIENDS_API = spotbieGlobals.API + "api/friends_general.service.php";

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};
@Component({
  selector: 'app-blocked-users',
  templateUrl: './blocked-users.component.html',
  styleUrls: ['../friends/friends.component.css', './blocked-users.component.css']
})
export class BlockedUsersComponent implements OnInit {

  private exe_api_key : string;

  private blocked_ite : number = 0;

  public blocked_list = []; 

  public load_more_blocked : boolean = false;

  public loading : boolean = false;

  public show_blocked_actions : boolean = false;

  public current_blocked;

  constructor(private http: HttpClient){}

  public setCurrentPending(friend){
    console.log(friend);
    this.current_blocked = friend;
    this.show_blocked_actions = true;    
  }

  public initCallBlocked(){
    this.loading = true;
    let call_friends_obj = { exe_api_key : this.exe_api_key, exe_friend_action : "getMyBlocked",  exe_friends_ite : this.blocked_ite, public_exe_user_id : 'null'};
    this.http.post<HttpResponse>(FRIENDS_API, call_friends_obj, HTTP_OPTIONS)
    .subscribe( resp => {
      let httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      });
      this.callBlockedCallback(httpResponse);
    },
      error => {
        console.log("Blocked Users Error : ", error);
    });    
  }

  private callBlockedCallback(httpResponse : HttpResponse){
    if(httpResponse.status == "200"){      
      httpResponse.responseObject.forEach(friend => {
        this.blocked_list.push(friend);
      });      
      if(httpResponse.responseObject.length > 6){
        this.blocked_ite = this.blocked_ite + 6;
        this.blocked_list.pop();
        this.load_more_blocked = true;
      } else {
        this.load_more_blocked = false;
      }
      this.loading = false;
      //console.log("your blocked users are : ", this.blocked_list);    
    } else {
      console.log("Error callBlockedCallback : ", httpResponse);
    }
  }

  public loadMoreBlocked(){
    this.initCallBlocked();
  }

  ngOnInit() {
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey');
    this.initCallBlocked();
  }
}