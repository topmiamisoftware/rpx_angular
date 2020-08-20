import { Injectable } from '@angular/core';
import * as spotbieGlobals from 'src/app/globals'
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { handleError } from 'src/app/helpers/error-helper';
import { catchError, tap } from 'rxjs/operators';

const SIGN_UP_API = spotbieGlobals.API + 'user'

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http : HttpClient) { }

  public initRegister(register_object: any): Observable<any>{

    let sign_up_api = SIGN_UP_API + '/signup'

    return this.http.post<HttpResponse<any>>(sign_up_api, register_object, HTTP_OPTIONS).pipe(
      tap( _ => console.log("Fetched response")),
      catchError(handleError("Get Chat Info Error"))
    )

  }

}
