import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'

import * as spotbieGlobals from 'src/app/globals'
import { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { handleError } from '../helpers/error-helper'

const LOGIN_API = spotbieGlobals.API + 'user'

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 
    'Content-Type' : 'application/json',
   })
}

@Injectable({
  providedIn: 'root'
})
export class UserauthService {

  public userLogin: string

  public userPassword: string

  public userRememberMe: string

  public userRememberMeToken: string

  public userTimezone: string

  constructor(private http: HttpClient,
              private router: Router) { }

  public async checkIfLoggedIn() : Promise<any>{

    let check_login_object = {}

    let login_api = LOGIN_API + '/check_user_auth'

    return new Promise((resolve, reject) => {

      this.http.post<String>(login_api, check_login_object)
      .subscribe( resp => {
        resolve(resp)
      }, error => {
        console.log("checkIfLoggedIn Error", error)
        this.logOut()
        reject()
      })

    })
      
  }

  private reRouteFromSpotBie(){
    this.router.navigate(['/home'])
  }

  public logOut(): Observable<any> {

    const log_out_object = {}

    const log_out_api = LOGIN_API + '/logout'

    return this.http.post<any>(log_out_api, log_out_object).pipe(
      tap( resp => { this.logOutCallback(resp) }),
      catchError(handleError("Log Out Error"))
    )

  }

  private logOutCallback(log_out_response: any): void {

      if(log_out_response.message == 'success'){

        localStorage.clear()

        localStorage.setItem('spotbie_userId', '0')
        localStorage.setItem('spotbie_loggedIn', '0')
        localStorage.setItem('spotbie_userApiKey', null)
        localStorage.setItem('spotbie_rememberMe', '0')
        localStorage.setItem('spotbie_rememberMeToken', null)

      }

  }

  public initLogin(token: string = '0'): Observable<any>{

    this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const params = {
      'login' : this.userLogin,
      'password' : this.userPassword,
      'remember_me' : this.userRememberMe,
      'remember_me_token' : token,
      'user_time_zone' : this.userTimezone
    }

    let login_api = LOGIN_API + '/login'

    return this.http.post<any>(login_api, params).pipe(
      catchError(handleError("initLogin Error"))
    )

  }

}
