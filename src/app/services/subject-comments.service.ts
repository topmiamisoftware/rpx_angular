import { Injectable } from '@angular/core';
import { HttpResponse } from '../models/http-reponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as spotbieGlobals from '../globals';

const STREAM_API = spotbieGlobals.API + 'api2/streamer.service.php';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class SubjectCommentsService {

  constructor(private http: HttpClient) { }

  getComments(_that, stream_obj, callback) {

    this.http.post<HttpResponse>(STREAM_API, stream_obj, HTTP_OPTIONS)
              .subscribe( resp => {
                // console.log("Stream Response: ", resp);
                const httpResponse = new HttpResponse ({
                  status : resp.status,
                  message : resp.message,
                  full_message : resp.full_message,
                  responseObject : resp.responseObject
                });
                callback(httpResponse, _that);
              },
                error => {
                  console.log('error', error);
              });
  }

}
