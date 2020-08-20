import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';

import * as spotbieGlobals from '../../../globals'
import { tap, catchError } from 'rxjs/operators';
import { handleError } from 'src/app/helpers/error-helper';

const MESSAGES_API = spotbieGlobals.API + 'api/messaging.service.php'

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private http : HttpClient) { }


  public getAllMessages(msgs_params : any): Observable<any> {

    return this.http.get<any>(MESSAGES_API, msgs_params).pipe(
      tap( _ => console.log("Fetched all messages.") ),
      catchError(handleError())
    )

  }

  public getReadMessages(msgs_params : any): Observable<any> {

    return this.http.get<any>(MESSAGES_API, msgs_params).pipe(
      tap( _ => console.log("Fetched all read messages.") ),
      catchError(handleError())
    )

  }

  public getUnreadMessages(msgs_params : any): Observable<any> {

    return this.http.get<any>(MESSAGES_API, msgs_params).pipe(
      tap( _ => console.log("Fetched all unread messages.") ),
      catchError(handleError())
    )

  }

  public getChatHeads(msgs_params : any): Observable<any> {

    return this.http.get<any>(MESSAGES_API, msgs_params).pipe(
      tap( _ => console.log("Fetched all read messages.") ),
      catchError(handleError())
    )

  }


}
