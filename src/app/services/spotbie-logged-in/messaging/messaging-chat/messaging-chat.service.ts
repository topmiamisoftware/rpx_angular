import { Injectable } from '@angular/core'
import { I_SpotBieSessionRequestParams } from 'src/app/interfaces/spotbie-session-request.interface'
import { Observable } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import * as spotbieGlobals from 'src/app/globals'
import { HttpClient, HttpParams, HttpRequest, HttpHeaders } from '@angular/common/http'
import { handleError } from 'src/app/helpers/error-helper'

const CHAT_API = spotbieGlobals.API + "api/messaging.service.php"

const HTTP_OPTIONS = {
  withCredentials : true,
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class MessagingChatService {

  constructor(private http: HttpClient) { }

  public getChatInfo(params: SpotBieChatInfoParams) : Observable<any>{

    let params_options = new HttpParams()
    .set('exe_api_key', params.exe_api_key)
    .set('request_action', params.request_action)
    .set('peer_user_id', params.peer_user_id)

    const options = { params : params_options }

    return this.http.get<HttpRequest<any>>(CHAT_API, options)
    .pipe(
      tap( _ => console.log("Fetched response")),
      catchError(handleError("Get Chat Info Error"))
    )

  }

}

export class SpotBieChatInfoParams implements I_SpotBieSessionRequestParams{

  public exe_api_key : string
  public request_action : string
  public peer_user_id : string

}
