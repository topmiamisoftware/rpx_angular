import { Injectable } from '@angular/core';
import * as spotbieGlobals from '../globals';
import { HttpResponse } from '../models/http-reponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const FRIENDS_API = spotbieGlobals.API + "api/friends_general.service.php";

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FriendshipsService {
  constructor(private http: HttpClient) { }

  public blockUserService(block_user_obj, callback){    
    this.http.post<HttpResponse>(FRIENDS_API, block_user_obj, HTTP_OPTIONS)
    .subscribe( resp => {
      let httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      });
      callback(httpResponse);
    },
      error => {
        console.log("Blocked Users Error : ", error);
    });
  }

  public unfriendService(block_user_obj, callback){    
    this.http.post<HttpResponse>(FRIENDS_API, block_user_obj, HTTP_OPTIONS)
    .subscribe( resp => {
      let httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      });
      callback(httpResponse);
    },
      error => {
        console.log("Blocked Users Error : ", error);
    });
  }

  public friendService(block_user_obj, callback){    
    this.http.post<HttpResponse>(FRIENDS_API, block_user_obj, HTTP_OPTIONS)
    .subscribe( resp => {
      let httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      });
      callback(httpResponse);
    },
      error => {
        console.log("Blocked Users Error : ", error);
    });
  }

}
