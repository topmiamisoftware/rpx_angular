import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '../../../models/http-reponse';
import * as spotbieGlobals from '../../../globals';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { NotificationsComponent } from '../UNUSED_notifications/notifications.component';

const NOTIFICATIONS_API = spotbieGlobals.API + "api/notifications.service.php";

const HTTP_OPTIONS = {
  withCredentials : true,
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};
@Component({
  selector: 'app-tag-notifications',
  templateUrl: './tag-notifications.component.html',
  styleUrls: ['./tag-notifications.component.css']
})
export class TagNotificationsComponent implements OnInit {

  private exe_api_key : string;
  public exe_user_id : string;
  
  public notis_list = [];

  public notifications_ite : number = 0;

  public load_more_notifications : boolean = false;

  public no_notis : boolean = false;

  public loading : boolean = false;

  constructor(private http : HttpClient,
              private host : NotificationsComponent) { }
  notificationStyle(notification){
    if(notification.noti_read == '0'){
      return { 'background-color' : 'rgba(0,0,0,.83)'};
    }
  }
  openNotification(notification){
    
  }
  loadMoreNotifications(){
    this.loading=true;
    this.fetchStreamNotifications();
  }
  fetchStreamNotifications(){
    this.loading = true;  
    let _this = this;
    let notifications_object = { exe_api_key : this.exe_api_key, exe_nots_action : "getTagsNotifications", exe_nots_ite : this.notifications_ite };
    this.http.post<HttpResponse>(NOTIFICATIONS_API, notifications_object, HTTP_OPTIONS)
      .subscribe( resp => {
          //console.log("Settings Response", resp);
          let notifications_response = new HttpResponse ({
          status : resp.status,
          message : resp.message,
          full_message : resp.full_message,
          responseObject : resp.responseObject
        });
        _this.populateNotifications(notifications_response);
      },
        error => {
          console.log("Stream Notifications Error : ", error);     
      });
  }
  populateNotifications(notifications_response : HttpResponse){
    if(notifications_response.status == "200"){
      let notifications_list = notifications_response.responseObject; 
      notifications_list.forEach(notification => { 
        notification.text = notification.user_info.exe_username  + " tagged you in their post : " + unescape(notification.msg);
        this.notis_list.push(notification);
      });      
      if(notifications_list.length > 6){
        this.notifications_ite = this.notifications_ite + 6;
        this.notis_list.pop();
        this.load_more_notifications = true;
      } else {
        this.load_more_notifications = false;
      }
      if(this.notis_list.length == 0){
        this.no_notis = true;
      }
      this.loading = false;
      //console.log("your loaded friend notifications are : ", notifications_list);         
    } else {
      console.log("Stream Notifications Error : ", notifications_response.httpResponse);
    }
  } 
  ngOnInit() {
    this.loading = true;
    this.exe_api_key = localStorage.getItem("spotbie_userApiKey");
    this.exe_user_id = localStorage.getItem("spotbie_userId");
    this.fetchStreamNotifications();
  }
}
