import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

import * as spotbieGlobals from 'src/app/globals'
import { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { handleError } from '../helpers/error-helper'
import { User } from '../models/user'

import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { AllowedAccountTypes } from '../helpers/enum/account-type.enum'
import { logOutCallback } from '../helpers/logout-callback'

const USER_API = spotbieGlobals.API + 'user'

const BUSINESS_API = spotbieGlobals.API + 'business'


@Injectable({
  providedIn: 'root'
})
export class UserauthService {

  public userLogin: string
  public userPassword: string
  public userRememberMe: string
  public userRememberMeToken: string
  public userTimezone: string
  public route: string

  constructor(private http: HttpClient,
              private router: Router,
              private socialAuthService: SocialAuthService) { }

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

  public getOAuthBearer(): Observable<any>{

    return this.socialAuthService.authState

  }

  private reRouteFromSpotBie(){
    this.router.navigate(['/home'])
  }

  public logOut(): Observable<any> {

    const logOutApi = `${USER_API}/logout`

    return this.http.post<any>(logOutApi, null)

  }

  public closeBrowser(): Observable<any> {

    const logOutApi = `${USER_API}/close-browser`

    return this.http.post<any>(logOutApi, null)

  }

  public initLogin(): Observable<any>{

    this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const params = {
      'login': this.userLogin,
      'password': this.userPassword,
      'remember_me_opt': this.userRememberMe,
      'timezone': this.userTimezone,
      'route': this.route
    }

    const logInApi = `${USER_API}/login`

    return this.http.post<any>(logInApi, params).pipe(
      catchError( err => {
        throw err
      })
    )

  }

  public getSettings(): Observable<any>{

    const getSettingsApi = `${USER_API}/settings`

    return this.http.post<any>(getSettingsApi, null).pipe(
      catchError( err => {
        throw err
      })
    )  

  }
  
  public saveSettings(user: User): Observable<any>{

    const saveSettingsApi = `${USER_API}/update`

    let saveSettingsObj

    if(user.business === undefined){
      
      saveSettingsObj = {
        _method: 'PUT',
        username: user.username,
        email: user.email,
        first_name: user.spotbie_user.first_name,
        last_name: user.spotbie_user.last_name,
        phone_number: user.spotbie_user.phone_number,
        ghost_mode: user.spotbie_user.ghost_mode,
        privacy: user.spotbie_user.privacy,
        account_type: user.spotbie_user.user_type
      }

    } else {

      saveSettingsObj = {
        _method: 'PUT',
        username: user.username,
        email: user.email,
        first_name: user.spotbie_user.first_name,
        last_name: user.spotbie_user.last_name,
        phone_number: user.spotbie_user.phone_number,
        ghost_mode: user.spotbie_user.ghost_mode,
        privacy: user.spotbie_user.privacy,
        account_type: user.spotbie_user.user_type,
        origin_description: user.business.description,
        origin_address: user.business.address,
        origin_title: user.business.name,
        origin_x: user.business.loc_x,
        origin_y: user.business.loc_y
      }

    }

    return this.http.post<any>(saveSettingsApi, saveSettingsObj).pipe(
      catchError( err => {
        throw err
      })
    )  

  }

  public setPassResetPin(emailOrPhone: string): Observable<any>{

    const resetPasswordApi = `${USER_API}/send-pass-email`
    const setPassResetObj = {
      email: emailOrPhone
    }

    return this.http.post<any>(resetPasswordApi, setPassResetObj).pipe(
      catchError( err => {
        throw err
      })
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

  public deactivateAccount(password: string, is_social_account: boolean): Observable<any>{

    const resetPasswordApi = `${USER_API}/deactivate`

    const passResetObj = {
      _method: 'DELETE',
      password,
      is_social_account 
    }

    return this.http.post<any>(resetPasswordApi, passResetObj).pipe(
      catchError(handleError("deactivateAccount"))
    ) 

  }

  public signInWithGoogle(loginCallBack, route): void {    
    
    const gLoginOptions = {
      scope: 'https://www.googleapis.com/auth/business.manage https://www.googleapis.com/auth/plus.business.manage',
      return_scopes: true,
      enable_profile_selector: true      
    }

    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, gLoginOptions).catch(
      (error) => {
        loginCallBack(error)
        return
      }
    )
    
    this.socialAuthService.authState.subscribe((user) => {

      this.userLogin = user.email
      this.userPassword = null 
      this.userRememberMe = '1'

      localStorage.setItem('spotbiecom_social_id', user.id)
      localStorage.setItem('spotbiecom_social_session', user.authToken)
      localStorage.setItem('spotbiecom_social_id_session', user.idToken)

      this.saveCurrentGoogleProfile(user, route).subscribe(
        resp => {
          loginCallBack(resp)
        }
      )
    
    })

  }

  public saveCurrentGoogleProfile(userObj: any, route: string): Observable<any>{

    const googleLoginApi = `${USER_API}/google-login`

    const googleLoginObj = {
      userID: userObj.id,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      email: userObj.email,
      photoUrl: userObj.photoUrl,
      remember_me: this.userRememberMe,
      route: route
    }

    return this.http.post<any>(googleLoginApi, googleLoginObj).pipe(
      catchError(handleError("signInWithGoogle"))
    ) 

  }

  public signInWithFB(loginCallBack, route: string) {
    
    /**
     * Please look at this document for extra fbLoginOptions
     * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11
     */
    const fbLoginOptions = {
      scope: 'email,public_profile',
      return_scopes: true,
      enable_profile_selector: true
    }; 

    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID, fbLoginOptions).catch(
      (error) => {
        loginCallBack(error)
        return
      }
    )
    
    this.socialAuthService.authState.subscribe( (user) => {

      this.userLogin = user.email
      this.userPassword = null 
      this.userRememberMe = '1'

      localStorage.setItem('spotbiecom_social_session', user.authToken)
      localStorage.setItem('spotbiecom_social_id', user.id)

      this.saveCurrentFbProfile(user, route).subscribe(
        (resp) => {
          loginCallBack(resp)
        }
      )

    });

  }

  public saveCurrentFbProfile(userObj: any, route: string): Observable<any> {

    const fbLoginApi = `${USER_API}/fb-login`
    
    const facebookLoginObj = {
      userID: userObj.id,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      email: userObj.email,
      photoUrl: userObj.photoUrl,
      remember_me: this.userRememberMe,
      route
    }

    return this.http.post<any>(fbLoginApi, facebookLoginObj).pipe(
      catchError(handleError("signInWithFB"))
    ) 

  }

  public verifyBusiness(businessInfo: any): Observable<any>{

    let apiUrl
    
    switch(businessInfo.accountType){
      
      case AllowedAccountTypes.PlaceToEat:
      case AllowedAccountTypes.Shopping:
      case AllowedAccountTypes.Events:
        apiUrl = `${BUSINESS_API}/verify`
        break

    }
    
    const businessInfoObj = {
      name: businessInfo.name,
      description: businessInfo.description,
      address: businessInfo.address,
      photo: businessInfo.photo,
      loc_x: businessInfo.loc_x,
      loc_y: businessInfo.loc_y,
      passkey: businessInfo.passkey,
      categories: businessInfo.categories,
      city: businessInfo.city,
      country: businessInfo.country,
      line1: businessInfo.line1,
      line2: businessInfo.line2,
      postal_code: businessInfo.postal_code,
      state: businessInfo.state      
    }

    return this.http.post<any>(apiUrl, businessInfoObj).pipe(
      catchError(handleError("verifyBusiness"))
    ) 

  }

  public saveBusiness(businessInfo: any): Observable<any>{

    let apiUrl
    
    switch(businessInfo.accountType){
      
      case AllowedAccountTypes.PlaceToEat:
      case AllowedAccountTypes.Shopping:
      case AllowedAccountTypes.Events:
        apiUrl = `${BUSINESS_API}/save-business`
        break

    }
    
    const businessInfoObj = {
      name: businessInfo.name,
      description: businessInfo.description,
      address: businessInfo.address,
      photo: businessInfo.photo,
      loc_x: businessInfo.loc_x,
      loc_y: businessInfo.loc_y,
      categories: businessInfo.categories,
      city: businessInfo.city,
      country: businessInfo.country,
      line1: businessInfo.line1,
      line2: businessInfo.line2,
      postal_code: businessInfo.postal_code,
      state: businessInfo.state      
    }

    return this.http.post<any>(apiUrl, businessInfoObj).pipe(
      catchError(handleError("verifyBusiness"))
    ) 

  }

}
