import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { UserauthService } from '../../../services/userauth.service'
import { HttpResponse } from '../../../models/http-reponse'
import { Router } from '@angular/router'
import { MenuLoggedOutComponent } from '../menu-logged-out.component'

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { logOutCallback } from 'src/app/helpers/logout-callback'

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['../../menu.component.css', './log-in.component.css']
})
export class LogInComponent implements OnInit {

  @ViewChild('spotbieSignUpIssues') spotbieSignUpIssues: ElementRef

  public faEye = faEye
  public faEyeSlash = faEyeSlash

  public loading: boolean = false

  public bg_color: string
  public current_login_photo: string
  public current_login_username: string

  public logInForm: FormGroup

  // will be used to know if the user clicked submit or not.
  public loggingIn: boolean = false
  public submitted: boolean = false
  public helpToggle: boolean = false

  public rememberMeState: string = '0'
  public rememberMeLight: string = 'red'
  public rememberMeTextOff: string = 'Remember Me is set to OFF.'
  public rememberMeTextOn: string = 'Remember Me is set to ON.'
  public rememberMeToggleStateText: string = this.rememberMeTextOff
  public rememberMeToken: string

  public loginResponse: HttpResponse

  public forgotPasswordWindow = { open : false }

  public passwordShow: boolean = false

  public business: boolean = false

  constructor(private host: MenuLoggedOutComponent = null,
              private formBuilder: FormBuilder,
              private userAuthService: UserauthService,
              private router: Router) { }

  public signInWithGoogle(): void {
    this.loading = true
    this.userAuthService.signInWithGoogle(this.loginCallback.bind(this), this.router.url)
  }

  public signInWithFB(): void {    
    this.loading = true
    this.userAuthService.signInWithFB(this.loginCallback.bind(this), this.router.url)
  }

  public togglePassword(){
    this.passwordShow = !this.passwordShow
  }

  public toggleRememberMe(): void{

    if (this.rememberMeState == '0') {

      this.rememberMeState = '1'
      this.rememberMeLight = '#7bb126'
      this.rememberMeToggleStateText = this.rememberMeTextOn

    } else {

      this.rememberMeState = '0'
      this.rememberMeLight = 'red'
      this.rememberMeToggleStateText = this.rememberMeTextOff

    }

  }

  public toggleRememberMeHelp(): void{
    this.helpToggle = !this.helpToggle
  }

  public loginUser(){
    
    this.spotbieSignUpIssues.nativeElement.style.display = 'none'

    this.userAuthService.initLogin().subscribe({
      next: (resp) => {
        this.loginCallback(resp)    
      },
      error: (e) => {
        this.spotbieSignUpIssues.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
        this.spotbieSignUpIssues.nativeElement.innerHTML = `<span class='spotbie-text-gradient spotbie-error'>INVALID USERNAME OR PASSWORD.</span>`
        this.spotbieSignUpIssues.nativeElement.style.display = 'block'
        this.loading = false
        return
      }
    })

  }


  private loginCallback(loginResponse: any): void{

    if(loginResponse.error == 'popup_closed_by_user'){
      this.loading = false
      return
    }
    
    if(loginResponse === undefined){

      this.logInForm.setErrors(null)
      this.logInForm.get('spotbieUsername').setErrors({ invalidUorP: true })
      this.loading = false
      
    }

    let login_status = loginResponse.message

    if(login_status == 'success' || login_status == 'confirm'){

      localStorage.setItem('spotbie_userLogin', loginResponse.user.username)
      localStorage.setItem('spotbie_loggedIn', '1')
      localStorage.setItem('spotbie_rememberMe', this.userAuthService.userRememberMe)
      localStorage.setItem('spotbie_userId', loginResponse.user.id)
      localStorage.setItem('spotbie_userDefaultImage', loginResponse.spotbie_user.default_picture)
      localStorage.setItem('spotbie_userType', loginResponse.spotbie_user.user_type)
      localStorage.setItem('spotbiecom_session', loginResponse.token_info.original.access_token)

      if (this.userAuthService.userRememberMe == '1'){

        this.rememberMeToken = loginResponse.remember_me_token
        localStorage.setItem('spotbie_rememberMeToken', this.rememberMeToken)

      }
      
      this.router.navigate(['/user-home'])

    } else {

      console.log("login_status", login_status)

      if (login_status == 'invalid_cred' || 
          login_status == 'spotbie_google_account' || 
          login_status == 'spotbie_fb_account' || 
          login_status == 'spotbie_account' ||
          login_status == 'wrong_account_type'
      ) {
        

        if(login_status == 'invalid_cred'){      
        
          this.spotbieSignUpIssues.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
          this.spotbieSignUpIssues.nativeElement.innerHTML = `<span class='spotbie-text-gradient spotbie-error'>INVALID USERNAME OR PASSWORD.</span>`
          this.spotbieSignUpIssues.nativeElement.style.display = 'block'

        } else if(login_status == 'spotbie_google_account')
          this.logInForm.get('spotbieUsername').setErrors({ spotbie_google_account: true })
        else if(login_status == 'spotbie_fb_account')
          this.logInForm.get('spotbieUsername').setErrors({ spotbie_fb_account: true })         
        else if(login_status == 'spotbie_account')
          this.logInForm.get('spotbieUsername').setErrors({ spotbie_account: true })
        else if(login_status == 'wrong_account_type')
          this.logInForm.get('spotbieUsername').setErrors({ wrong_account_type: true })          

        logOutCallback({success: true}, false)
  
      } 

    }

    this.loading = false

  }

  public initLogIn(): void{

    this.loading = true

    this.submitted = true

    // stop here if form is invalid
    if (this.logInForm.invalid) {
      this.loading = false      
      return
    }

    // user UserAuth Service to log the user in.
    this.userAuthService.userLogin = this.email
    this.userAuthService.userPassword = this.password
    this.userAuthService.userRememberMe = this.rememberMeState
    this.userAuthService.route = this.router.url
    // console.log(this.rememberMeState)

    this.loginUser()

  }

  private initLogInForm(): void{

    const usernameValidators = [Validators.required]
    const passwordValidators = [Validators.required]

    if (localStorage.getItem('spotbie_rememberMe') == '1') this.toggleRememberMe()

    this.logInForm = this.formBuilder.group({
      spotbieUsername: ['', usernameValidators],
      spotbiePassword: ['', passwordValidators]
    })

    if (this.current_login_username != '')
      this.logInForm.get('spotbieUsername').setValue(this.current_login_username)

    this.loading = false

  }

  public initTokenLogin(): void {

    const saved_remember_me_token = localStorage.getItem('spotbie_rememberMeToken')
    const saved_username = localStorage.getItem('spotbie_userLogin')

    this.userAuthService.userLogin = saved_username
    this.userAuthService.userPassword = ''
    this.userAuthService.userRememberMe = '1'
    this.userAuthService.userRememberMeToken = saved_remember_me_token

    this.loginUser()

  }

  get email() { return this.logInForm.get('spotbieUsername').value }
  get password() { return this.logInForm.get('spotbiePassword').value }
  get f() { return this.logInForm.controls }

  public closeWindow(){
    this.host.closeWindow(this.host.logInWindow)
  }

  public openWindow(window: any): void{
    window.open = true
  }

  public signUp(){
    this.host.openWindow(this.host.signUpWindow)
    this.host.closeWindow(this.host.logInWindow)
  }

  public usersHome(){
    this.router.navigate(['/home'])
  }

  public businessHome(){
    this.router.navigate(['/business'])
  }

  public getCurrentWindowBg(){
    if(this.business){
      return 'sb-businessBg'
    } else {
      return 'sb-regularBg'
    }
  }

  public openIg(){
    if(this.business){
      window.open("https://www.instagram.com/spotbie.business/","_blank")
    } else {
      window.open("https://www.instagram.com/spotbie.loyalty.points/","_blank")   
    }    
  }

  public openYoutube(){
    window.open("https://www.youtube.com/channel/UCtxkgw0SYiihwR7O8f-xIYA","_blank")     
  }

  public openTwitter(){
      window.open("https://twitter.com/SpotBie","_blank")
  }

  ngOnInit() {

    this.loading = true

    this.current_login_username = localStorage.getItem('spotbie_lastLoggedUserName')

    this.bg_color = '#181818'

    this.current_login_photo = 'assets/images/user.png'

    this.router.url === '/business' ? this.business = true : this.business = false

    this.initLogInForm()

    const remember_me = localStorage.getItem('spotbie_rememberMe')
    const logged_in = localStorage.getItem('spotbie_loggedIn')

    if (remember_me == '1' && logged_in !== '1') this.initTokenLogin()

  }

}
