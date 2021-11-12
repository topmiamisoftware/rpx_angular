import { Component, OnInit, ViewChild, ElementRef, Output, Input, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'

import * as $ from 'jquery'

import { Validators, FormGroup, FormBuilder } from '@angular/forms'

import { ValidateUsername } from '../../../helpers/username.validator'
import { ValidatePassword } from '../../../helpers/password.validator'

import { SignUpService } from 'src/app/services/spotbie-logged-out/sign-up/sign-up.service'
import { catchError } from 'rxjs/operators'
import { Observable } from 'rxjs/internal/Observable'
import { of } from 'rxjs'
import { EmailConfirmationService } from '../../email-confirmation/email-confirmation.service'
import { ValidateUniqueEmail } from 'src/app/validators/email-unique.validator'

import { faEye, faEyeSlash, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { UserauthService } from 'src/app/services/userauth.service'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css', '../menu-logged-out.component.css', '../../menu.component.css']
})
export class SignUpComponent implements OnInit {

  @ViewChild('spotbie_register_info') spotbie_register_info

  @ViewChild('spotbieSignUpIssues') spotbieSignUpIssues

  @Output() closeWindow = new EventEmitter()

  @Output() logInEvent = new EventEmitter()

  @Input() window_obj

  public faEye = faEye
  public faInfo = faInfoCircle
  public faEyeSlash = faEyeSlash

  public signUpFormx: FormGroup

  public signing_up: boolean = false

  public sign_up_box: boolean = false

  public submitted: boolean = false

  public loading: boolean = false

  public alreadyConfirmedEmail: string = ''
  public emailIsConfirmed: boolean = false
  public emailConfirmation: boolean

  public passwordShow: boolean = false

  public rememberMeToken: string

  public business: boolean = false

  constructor(private router: Router,
              private sign_up_service: SignUpService,
              private formBuilder: FormBuilder,
              private emailUniqueCheckService: EmailConfirmationService,
              private userAuthService: UserauthService) { }

  scrollTo(el: ElementRef): void{
    $('html, body').animate({ scrollTop: $(el).offset().top }, 'slow')
  }

  public signInWithGoogle(): void {
    this.loading = true
    this.userAuthService.signInWithGoogle(this.loginCallback.bind(this), this.router.url)
  }

  public signInWithFB(): void {    
    this.loading = true
    this.userAuthService.signInWithFB(this.loginCallback.bind(this), this.router.url)
  }

  private loginCallback(loginResponse: any): void{

    if(loginResponse.error == 'popup_closed_by_user'){
      this.loading = false
      return
    }

    if(loginResponse === undefined){
      this.signUpFormx.setErrors(null)
      this.spotbieSignUpIssues.nativeElement.innerHTML = "Invalid username or password."
      this.loading = false
    }

    let login_status = loginResponse.message

    if(login_status == 'success' || login_status == 'confirm'){

      localStorage.setItem('spotbie_userLogin', loginResponse.user.username)
      localStorage.setItem('spotbie_loggedIn', '1')
      localStorage.setItem('spotbie_rememberMe', this.userAuthService.userRememberMe)
      localStorage.setItem('spotbie_userId', loginResponse.user.id)
      localStorage.setItem('spotbiecom_session', loginResponse.user.original.access_token)
      localStorage.setItem('spotbie_userDefaultImage', loginResponse.spotbie_user.default_picture)

      if( this.userAuthService.userRememberMe == '1' ){

        this.rememberMeToken = loginResponse.remember_me_token
        localStorage.setItem('spotbie_rememberMeToken', this.rememberMeToken)

      }
      
      this.router.navigate(['/user-home'])

    } else {

      if (login_status == 'invalid_cred' || 
          login_status == 'spotbie_google_account' || 
          login_status == 'spotbie_fb_account' || 
          login_status == 'spotbie_account'
      ) {
  
        if(login_status == 'invalid_cred'){      
        
          this.spotbieSignUpIssues.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
          this.spotbieSignUpIssues.nativeElement.innerHTML = `<span class='spotbie-text-gradient spotbie-error'>INVALID USERNAME OR PASSWORD.</span>`
          this.spotbieSignUpIssues.nativeElement.style.display = 'block'

        } else if(login_status == 'spotbie_google_account')
          this.signUpFormx.get('spotbieEmail').setErrors({ spotbie_google_account: true })
        else if(login_status == 'spotbie_fb_account')
          this.signUpFormx.get('spotbieEmail').setErrors({ spotbie_fb_account: true })         
        else if(login_status == 'spotbie_account')
          this.signUpFormx.get('spotbieEmail').setErrors({ spotbie_account: true })
        
        let favorites = localStorage.getItem('spotbie_currentFavorites') 
        localStorage.clear()
        localStorage.setItem('', favorites)
  
      } 

    } 

    this.loading = false

  }

  public closeWindowX(): void {
    this.closeWindow.emit(this.window_obj)
  }

  get spotbieUsername() { return this.signUpFormx.get('spotbieUsername').value }
  get spotbieEmail() { return this.signUpFormx.get('spotbieEmail').value }
  get spotbiePassword() { return this.signUpFormx.get('spotbiePassword').value }

  get f() { return this.signUpFormx.controls }

  public removeWhiteSpace(key) {
    this.signUpFormx.get(key).setValue(this.signUpFormx.get(key).value.trim())
  }

  public togglePassword(){
    this.passwordShow = !this.passwordShow
  }

  public initSignUp(): void {

    // will be used when the user hits the submit button
    this.submitted = true

    this.loading = true

    this.spotbieSignUpIssues.nativeElement.scrollTo(0, 0)

    this.signUpFormx.updateValueAndValidity()

    // stop here if form is invalid
    if (this.signUpFormx.invalid) {

        this.signing_up = false

        if (this.signUpFormx.get('spotbieEmail').invalid)
          document.getElementById('user_email').style.border = '1px solid red'
        else
          document.getElementById('user_email').style.border = 'unset'

        if (this.signUpFormx.get('spotbiePassword').invalid) 
          document.getElementById('user_pass').style.border = '1px solid red'
        else
          document.getElementById('user_pass').style.border = 'unset'

        this.loading = false

        return

    } else {

      document.getElementById('spotbie_username').style.border = 'unset'
      document.getElementById('user_email').style.border = 'unset'
      document.getElementById('user_pass').style.border = 'unset'
      
    }
    
    const username = this.spotbieUsername
    const password = this.spotbiePassword
    const email = this.spotbieEmail

    // send to server
    const sign_up_obj = {
        username,
        password,
        email,
        route: this.router.url
    }

    this.sign_up_service.initRegister(sign_up_obj)
    .pipe(
      catchError(this.signUpError())
    )
    .subscribe(
      resp =>{
        this.initSignUpCallback(resp)
      }
    )

  }

  private initSignUpCallback(resp: any) {
      
      let sign_up_instructions = this.spotbieSignUpIssues.nativeElement

      if(resp.message == 'success'){               

        // save the user information.
        localStorage.setItem('spotbie_userLogin', resp.user.username)
        localStorage.setItem('spotbie_loggedIn', '1')
        localStorage.setItem('spotbie_rememberMe', '0')
        localStorage.setItem('spotbie_userId', resp.user.id)
        localStorage.setItem('spotbie_userDefaultImage', resp.spotbie_user.default_picture)
        localStorage.setItem('spotbie_userType', resp.spotbie_user.user_type)
        localStorage.setItem('spotbiecom_session', resp.token_info.original.access_token)

        sign_up_instructions.innerHTML = 'Welcome to SpotBie!'
  
        window.location.reload()

      } else {
        sign_up_instructions.innerHTML = 'There has been an error signing up.'
      }

      this.loading = false
      this.signing_up = false

  }

  public signUpError<T>(operation = 'operation', result?: T) {

    this.signing_up = false
    this.loading = false

    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.log(error) // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      let sign_up_instructions = this.spotbieSignUpIssues.nativeElement
      sign_up_instructions.style.display = 'none'

      const error_list = error.error.errors

      if(error_list.username){

        let errors: {[k: string]: any} = {};
        error_list.username.forEach(error => {
          errors[error] = true
        })
        this.signUpFormx.get('spotbieUsername').setErrors(errors)
        document.getElementById('spotbie_username').style.border = '1px solid red' 

      } else
        document.getElementById('spotbie_username').style.border = 'unset'


      if(error_list.email){

        let errors: {[k: string]: any} = {};
        error_list.email.forEach(error => {
          errors[error] = true
        })          
        this.signUpFormx.get('spotbieEmail').setErrors(errors)
        document.getElementById('user_email').style.border = '1px solid red' 

      } else
        document.getElementById('user_email').style.border = 'unset'

      if(error_list.password){

        let errors: {[k: string]: any} = {};
        error_list.username.forEach(error => {
          errors[error] = true
        })          
        this.signUpFormx.get('spotbiePassword').setErrors(errors)
        document.getElementById('user_pass').style.border = '1px solid red'

      } else
        document.getElementById('user_pass').style.border = 'unset'

      this.signing_up = false

      setTimeout(function() {
        sign_up_instructions.style.display = 'block' 
      } , 200)  

      // Let the app keep running by returning an empty result.
      return of(result as T)

    }

  }

  public logIn(){
    this.logInEvent.emit()
    this.closeWindowX()
  }

  public initSignUpForm() {
    
    // will set validators for form and take care of animations
    const usernameValidators = [Validators.required]
    const passwordValidators = [Validators.required]
    const emailValidators = [Validators.required, Validators.email]

    this.signUpFormx = this.formBuilder.group({
        spotbieUsername: ['', usernameValidators],
        spotbieEmail: ['', emailValidators],
        spotbiePassword: ['', passwordValidators]
    }, {
        validators: [ValidateUsername('spotbieUsername'),
                    ValidatePassword('spotbiePassword')]
    })

    this.signUpFormx.setAsyncValidators(
      ValidateUniqueEmail.valid(
        this.emailUniqueCheckService, 
        this.spotbieEmail
      )
    )

    this.loading = false

  }

  public usersHome(){
    this.router.navigate(['/home'])
  }

  public businessHome(){
    this.router.navigate(['/business'])
  }

  ngOnInit() {    

    this.loading = true

    this.router.url === '/business' ? this.business = true : this.business = false

    this.initSignUpForm()

  }

  ngAfterViewInit(){
  }
  
}
