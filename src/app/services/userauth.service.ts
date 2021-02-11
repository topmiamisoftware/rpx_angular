import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

import * as spotbieGlobals from 'src/app/globals'
import { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { handleError } from '../helpers/error-helper'
import { User } from '../models/user'

const USER_API = spotbieGlobals.API + 'user'

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

  public async checkIfLoggedIn(): Promise<any>{

    let check_login_object = {}

    let loginApi = `${USER_API}/check-user-auth`

    return new Promise((resolve, reject) => {

      this.http.post<String>(loginApi, check_login_object)
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

    const logOutApi = `${USER_API}/logout`

    return this.http.post<any>(logOutApi, null).pipe(
      tap( resp => { this.logOutCallback(resp) })
    )

  }

  public closeBrowser(): Observable<any> {

    const logOutApi = `${USER_API}/close-browser`

    return this.http.post<any>(logOutApi, null).pipe(
      tap( resp => { this.logOutCallback(resp) })
    )

  }

  private logOutCallback(logOutResponse: any): void {

      if(logOutResponse.success){

        let loggedOutFavorites = localStorage.getItem('spotbie_currentFavorites')

        localStorage.clear()
        
        localStorage.setItem('spotbie_currentFavorites', loggedOutFavorites)

        localStorage.setItem('spotbie_locationPrompted', '1')
        localStorage.setItem('spotbie_userId', '0')
        localStorage.setItem('spotbie_loggedIn', '0')
        localStorage.setItem('spotbie_userApiKey', null)
        localStorage.setItem('spotbie_rememberMe', '0')
        localStorage.setItem('spotbie_rememberMeToken', null)

      }

  }

  public initLogin(): Observable<any>{

    this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const params = {
      'login': this.userLogin,
      'password': this.userPassword,
      'remember_me_opt': this.userRememberMe,
      'timezone': this.userTimezone
    }

    const logInApi = `${USER_API}/login`

    return this.http.post<any>(logInApi, params).pipe(
      catchError(handleError("initLogin"))
    )

  }

  public getSettings(): Observable<any>{

    const getSettingsApi = `${USER_API}/settings`

    return this.http.post<any>(getSettingsApi, null).pipe(
      catchError(handleError("getSettings"))
    )  

  }

  public saveSettings(user: User): Observable<any>{

    const saveSettingsApi = `${USER_API}/update`

    const saveSettingsObj = {
      _method: 'PUT',
      username: user.username,
      email: user.email,
      first_name: user.exe_user_first_name,
      last_name: user.exe_user_last_name,
      phone_number: user.ph,
      ghost_mode: user.ghost,
      privacy: user.privacy,
      animal: user.exe_animal
    }

    return this.http.post<any>(saveSettingsApi, saveSettingsObj).pipe(
      catchError(handleError("saveSettings"))
    )  

  }

  public setPassResetPin(emailOrPhone: string): Observable<any>{

    const resetPasswordApi = `${USER_API}/send-pass-email`
    const setPassResetObj = {
      email_or_phone: emailOrPhone
    }

    return this.http.post<any>(resetPasswordApi, setPassResetObj).pipe(
      catchError(handleError("setPassResetPin"))
    ) 

  }

  public completeReset(password: string, passwordConfirmation: string, email: string, token: string): Observable<any>{

    const resetPasswordApi = `${USER_API}/complete-pass-reset`

    const passResetObj = {
      _method: 'PUT',
      password: password,
      password_confirmation: passwordConfirmation,
      email: email,
      token: token
    }

    return this.http.post<any>(resetPasswordApi, passResetObj).pipe(
      catchError(handleError("completeReset"))
    ) 

  }

  public passwordChange(passwordChangeObj: any): Observable<any>{

    const resetPasswordApi = `${USER_API}/change-password`

    const passResetObj = {
      _method: 'PUT',
      password: passwordChangeObj.password,
      password_confirmation: passwordChangeObj.passwordConfirmation,
      current_password: passwordChangeObj.currentPassword
    }

    return this.http.post<any>(resetPasswordApi, passResetObj).pipe(
      catchError(handleError("passwordChange"))
    ) 

  }

  public deactivateAccount(password: string): Observable<any>{

    const resetPasswordApi = `${USER_API}/deactivate`

    const passResetObj = {
      _method: 'DELETE',
      password
    }

    return this.http.post<any>(resetPasswordApi, passResetObj).pipe(
      catchError(handleError("deactivateAccount"))
    ) 

  }

}
