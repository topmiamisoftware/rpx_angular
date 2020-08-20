import { Injectable } from '@angular/core'
import { HttpResponse } from '../../models/http-reponse'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import * as spotbieGlobals from '../../globals'
import { Observable } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { handleError } from 'src/app/helpers/error-helper'

const STREAM_API = spotbieGlobals.API + 'stream'

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class StreamerService {

  constructor(private http : HttpClient) {}

  public deleteStreamPostComment(stream_comments_object : any, callback : Function){

    this.http.post<HttpResponse>(STREAM_API, stream_comments_object, HTTP_OPTIONS)
        .subscribe( resp => {
          // console.log("Settings Response", resp)
            const settings_response = new HttpResponse ({
            status : resp.status,
            message : resp.message,
            full_message : resp.full_message,
            responseObject : resp.responseObject
          })
          callback(settings_response)
        },
          error => {
            console.log('error', error)
    }) 
    
  }

  public addStreamPostComment(stream_comments_object : any, callback : Function){

    this.http.post<HttpResponse>(STREAM_API, stream_comments_object, HTTP_OPTIONS)
        .subscribe( resp => {
          // console.log("Settings Response", resp)
            const settings_response = new HttpResponse ({
            status : resp.status,
            message : resp.message,
            full_message : resp.full_message,
            responseObject : resp.responseObject
          })
          callback(settings_response)
        },
          error => {
            console.log('error', error)
    }) 
    
  }

  public pullStreamPostComments(stream_obj : any, callback : Function){

    this.http.post<HttpResponse>(STREAM_API, stream_obj, HTTP_OPTIONS)
        .subscribe( resp => {
          // console.log("Settings Response", resp)
            const settings_response = new HttpResponse ({
            status : resp.status,
            message : resp.message,
            full_message : resp.full_message,
            responseObject : resp.responseObject
          })
          callback(settings_response)
        },
          error => {
            console.log('error', error)
    })
         
  }

  public deleteAllUnused(media_object: any){
    this.http.post<HttpResponse>(STREAM_API, JSON.stringify(media_object), HTTP_OPTIONS);
  }

  public getMyStream(stream_obj: any): Observable<any>{

    let stream_api = STREAM_API + "/my_stream?page=" + stream_obj.page

    return this.http.get<any>(stream_api, stream_obj).pipe(
      catchError(handleError("getMyStream Error"))
    )

  }

  public getMyGeneralStream(stream_obj: any): Observable<any>{

    let stream_api = STREAM_API + "/my_general_stream?page=" + stream_obj.page

    return this.http.get<any>(stream_api, stream_obj).pipe(
      catchError(handleError("getMyGeneralStream Error"))
    )

  }

  public uploadStream(stream_obj, callback) {
    this.http.post<HttpResponse>(STREAM_API, JSON.stringify(stream_obj), HTTP_OPTIONS)
            .subscribe( resp => {
              //console.log('Stream Response: ', resp)
              const httpResponse = new HttpResponse ({
                status : resp.status,
                message : resp.message,
                full_message : resp.full_message,
                responseObject : resp.responseObject
              })
              callback(httpResponse)
            },
              error => {
            })
  }

  public getStreamPost(stream_obj, callback){
    this.http.post<HttpResponse>(STREAM_API, JSON.stringify(stream_obj), HTTP_OPTIONS)
            .subscribe( resp => {
              //console.log('View Stream Post Response: ', resp)
              const httpResponse = new HttpResponse ({
                status : resp.status,
                message : resp.message,
                full_message : resp.full_message,
                responseObject : resp.responseObject
              })
              callback(httpResponse)
            },
              error => {
    })
  }

  public saveEdit(stream_obj, callback){

    this.http.post<HttpResponse>(STREAM_API, stream_obj, HTTP_OPTIONS)
    .subscribe( resp => {
      const httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      })
      callback(httpResponse)
    },
      error => {
        console.log('Save Stream Edit Error : ', error)
    })

  }

  getMediaStream(stream_obj, callback) {

    this.http.post<HttpResponse>(STREAM_API, JSON.stringify(stream_obj), HTTP_OPTIONS)
            .subscribe( resp => {
              // console.log("Stream Response: ", resp)
              const httpResponse = new HttpResponse ({
                status : resp.status,
                message : resp.message,
                full_message : resp.full_message,
                responseObject : resp.responseObject
              })
              callback(httpResponse)
            },
              error => {
                console.log('Get Stream Error : ', error)
    })

  }

  public uploadMediaStream(stream_obj, callback) {
    this.http.post<HttpResponse>(STREAM_API, JSON.stringify(stream_obj), HTTP_OPTIONS)
            .subscribe( resp => {
              // console.log("Stream Response: ", resp)
              const httpResponse = new HttpResponse ({
                status : resp.status,
                message : resp.message,
                full_message : resp.full_message,
                responseObject : resp.responseObject
              })
              callback(httpResponse)
            },
              error => {
                console.log('Get Stream Error : ', error)
    })
  }

  public getLifeStream(stream_obj, callback) {

    this.http.post<HttpResponse>(STREAM_API, JSON.stringify(stream_obj), HTTP_OPTIONS)
            .subscribe( resp => {
              // console.log("Stream Response: ", resp)
              const httpResponse = new HttpResponse ({
                status : resp.status,
                message : resp.message,
                full_message : resp.full_message,
                responseObject : resp.responseObject
              })
              callback(httpResponse)
            },
              error => {
                console.log('Get Stream Error : ', error)
    })

  }

  public uploadLifeStream(stream_obj, callback) {
    this.http.post<HttpResponse>(STREAM_API, JSON.stringify(stream_obj), HTTP_OPTIONS)
            .subscribe( resp => {
              // console.log("Stream Response: ", resp)
              const httpResponse = new HttpResponse ({
                status : resp.status,
                message : resp.message,
                full_message : resp.full_message,
                responseObject : resp.responseObject
              })
              callback(httpResponse)
            },
              error => {
                console.log('Get Stream Error : ', error)
    })
  }

}
