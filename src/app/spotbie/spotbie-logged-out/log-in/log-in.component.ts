import { Component, OnInit, ViewChild } from '@angular/core'
import {FormGroup, FormBuilder, Validators } from '@angular/forms'
import { UserauthService } from '../../../services/userauth.service'
import { HttpResponse } from '../../../models/http-reponse'
import { Router } from '@angular/router'
import { MenuLoggedOutComponent } from '../menu-logged-out.component'

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  @ViewChild('spotbieLogInIssues') spotbieLogInIssues

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

  public lastLoggedWindow = { open : false }  

  public forgotPasswordWindow = { open : false }

  constructor(private host: MenuLoggedOutComponent = null,
              private formBuilder: FormBuilder,
              private userAuthService: UserauthService,
              private router: Router) { }

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

    this.userAuthService.initLogin().subscribe(
      resp =>{
        this.loginCallback(resp)    
      }
    )

  }

  private loginCallback(loginResponse: any): void{

    if(loginResponse === undefined){
      this.spotbieLogInIssues.nativeElement.innerHTML = "Invalid username or password."
      this.loading = false
    }

    let login_status = loginResponse.message

    if(login_status == 'success' || login_status == 'confirm'){

      localStorage.setItem('spotbie_userLogin', loginResponse.user.username)

      localStorage.setItem('spotbie_loggedIn', '1')
      
      localStorage.setItem('spotbie_rememberMe', this.userAuthService.userRememberMe)

      localStorage.setItem('spotbie_userId', loginResponse.user.id)

      localStorage.setItem('spotbie_token', loginResponse.token_info.original.access_token)

      localStorage.setItem('spotbie_userDefaultImage', loginResponse.spotbie_user.default_picture)

      if (this.userAuthService.userRememberMe == '1'){

        this.rememberMeToken = loginResponse.remember_me_token
        localStorage.setItem('spotbie_rememberMeToken', this.rememberMeToken)

      }
      
      this.router.navigate(['/user-home'])

    } else {

      if (login_status == 'invalid_cred') {
  
        this.spotbieLogInIssues.nativeElement.style.display = 'none'
        this.spotbieLogInIssues.nativeElement.innerHTML = "Invalid username or password."
        this.spotbieLogInIssues.nativeElement.className = 'spotbie-input-info animated shake'
  
        setTimeout(function() { this.spotbieLogInIssues.nativeElement.style.display = 'block' }.bind(this), 40)
  
        localStorage.setItem('spotbie_userId', null)
        localStorage.setItem('spotbie_loggedIn', '0')
        localStorage.setItem('spotbie_userApiKey', null)
        localStorage.setItem('spotbie_rememberMe', '0')
        localStorage.setItem('spotbie_rememberMeToken', null)
  
      } 

    }

    this.loading = false

  }

  public initLogIn(): void{

    this.loading = true

    // will be used when the user hits the submit button
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

  public closeWindow() {
    this.host.closeWindow(this.host.logInWindow)
  }

  public openWindow(window: any): void{
    window.open = true
  }

  ngOnInit() {

    this.loading = true

    this.current_login_username = localStorage.getItem('spotbie_lastLoggedUserName')

    this.bg_color = '#181818'

    this.current_login_photo = 'assets/images/user.png'
      

    this.initLogInForm()

    const remember_me = localStorage.getItem('spotbie_rememberMe')
    const logged_in = localStorage.getItem('spotbie_loggedIn')

    if (remember_me == '1' && logged_in !== '1') this.initTokenLogin()

  }

}
