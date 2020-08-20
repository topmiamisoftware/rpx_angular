import { Component, OnInit } from '@angular/core';
import * as spotbieGlobals from '../../../globals';
import { HttpResponse } from '../../../models/http-reponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const FRIENDS_API = spotbieGlobals.API + "api/friends_general.service.php";

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};

@Component({
  selector: 'app-around-me',
  templateUrl: './around-me.component.html',
  styleUrls: ['../friends/friends.component.css', './around-me.component.css']
})
export class AroundMeComponent implements OnInit {

  private exe_api_key : string;

  private around_me_ite : number = 0;

  public around_me_list = []; 

  public load_more_around_me : boolean = false;

  public loading : boolean = false;

  public no_spotbie_around_me : boolean = false;

  public show_around_me_actions : boolean = false;

  public current_around_me;

  public loc_x: number;
  public loc_y: number;

  constructor(private http: HttpClient){}

  public setCurrentAroundMe(friend){
    //console.log(friend);
    this.current_around_me = friend;
    this.show_around_me_actions = true;    
  }

  public initAroundMe(){    
    this.loading = true;
    let call_friends_obj = { exe_api_key : this.exe_api_key,
                            loc_x : this.loc_x,
                            loc_y : this.loc_y,
                            exe_friend_action : "getAroundMe", 
                            exe_friends_ite : this.around_me_ite, 
                            public_exe_user_id : 'null'};
    this.http.post<HttpResponse>(FRIENDS_API, call_friends_obj, HTTP_OPTIONS)
    .subscribe( resp => {
      let httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      });
      this.aroundMeCallback(httpResponse);
    },
      error => {
        console.log("Around Me Friends Error : ", error);
    });    
  }

  private aroundMeCallback(httpResponse : HttpResponse){
    if(httpResponse.status == "200"){      
      httpResponse.responseObject.forEach(friend => {
        friend = friend;
        this.around_me_list.push(friend);
      });      
      if(httpResponse.responseObject.length > 6){
        this.around_me_ite = this.around_me_ite + 6;
        this.around_me_list.pop();
        this.load_more_around_me = true;
      } else {
        this.load_more_around_me = false;
      }
      if(this.around_me_list.length == 0){
        this.no_spotbie_around_me = true;
      }
      this.loading = false;
      console.log("Around Me Friends are : ", this.around_me_list);    
    } else {
      console.log("Error arouneMeCallback : ", httpResponse);
    }
  }

  public getLocation(){
    if (window.navigator.geolocation){
      window.navigator.geolocation.getCurrentPosition(this.savePosition.bind(this));
    }
  }
  private savePosition(position) {
    this.loc_x = position.coords.latitude;
    this.loc_y = position.coords.longitude;
    this.initAroundMe();
  }

  public loadMoreAroundMe(){
    this.getLocation();
  }

  ngOnInit() {
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey');
      
    this.getLocation();
  }
}