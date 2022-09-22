import { Component, OnInit, ViewChild, ElementRef, Output, Input, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'
import { Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms'
import { ValidateUsername } from '../../../helpers/username.validator'
import { ValidatePassword } from '../../../helpers/password.validator'
import { SignUpService } from 'src/app/services/spotbie-logged-out/sign-up/sign-up.service'
import { catchError } from 'rxjs/operators'
import { Observable } from 'rxjs/internal/Observable'
import { of } from 'rxjs'
import { EmailConfirmationService } from '../../email-confirmation/email-confirmation.service'
import { ValidateUniqueEmail } from 'src/app/validators/email-unique.validator'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: [ '../../menu.component.css', './sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  @ViewChild('spotbie_register_info') spotbieRegisterInfo
  @ViewChild('spotbieSignUpIssues') spotbieSignUpIssues

  @Output() closeWindow = new EventEmitter()
  @Output() logInEvent = new EventEmitter()
  @Input() windowObj

  public faEye = faEye
  public faEyeSlash = faEyeSlash
  public signUpFormx: UntypedFormGroup
  public signingUp: boolean = false
  public submitted: boolean = false
  public loading: boolean = false
  public passwordShow: boolean = false
  public business: boolean = false

  constructor(private router: Router,
              private signUpService: SignUpService,
              private formBuilder: UntypedFormBuilder,
              private emailUniqueCheckService: EmailConfirmationService) { }

  public closeWindowX(): void {
    this.closeWindow.emit(this.windowObj)
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
        this.signingUp = false

        if (this.signUpFormx.get('spotbieEmail').invalid) {
          document.getElementById('user_email').style.border = '1px solid red'
        } else {
          document.getElementById('user_email').style.border = 'unset'
        }

        if (this.signUpFormx.get('spotbiePassword').invalid) {
          document.getElementById('user_pass').style.border = '1px solid red'
        } else {
          document.getElementById('user_pass').style.border = 'unset'
        }
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
    const signUpObj = {
        username,
        password,
        email,
        route: this.router.url
    }

    this.signUpService.initRegister(signUpObj).pipe(
        catchError(this.signUpError())
      ).subscribe(
        resp =>{
          this.initSignUpCallback(resp)
        })
  }

  private initSignUpCallback(resp: any) {
      const signUpInstructions = this.spotbieSignUpIssues.nativeElement

      if(resp.message === 'success'){
        // save the user information.
        localStorage.setItem('spotbie_userLogin', resp.user.username)
        localStorage.setItem('spotbie_loggedIn', '1')
        localStorage.setItem('spotbie_rememberMe', '0')
        localStorage.setItem('spotbie_userId', resp.user.id)
        localStorage.setItem('spotbie_userDefaultImage', resp.spotbie_user.default_picture)
        localStorage.setItem('spotbie_userType', resp.spotbie_user.user_type)
        localStorage.setItem('spotbiecom_session', resp.token_info.original.access_token)
        signUpInstructions.innerHTML = '<span class=\'spotbie-text-gradient\'>Welcome to SpotBie!</span>'
        window.location.reload()
      } else {
        signUpInstructions.innerHTML = '<span class=\'spotbie-text-gradient spotbie-error\'>There has been an error signing up.</span>'
      }

      this.loading = false
      this.signingUp = false
  }

  public signUpError<T>(operation = 'operation', result?: T) {
    this.signingUp = false
    this.loading = false

    return (error: any): Observable<T> => {
      const signUpInstructions = this.spotbieSignUpIssues.nativeElement
      signUpInstructions.style.display = 'none'

      const errorList = error.error.errors

      if(errorList.username){
        const errors: {[k: string]: any} = {};
        errorList.username.forEach(error => {
          errors[error] = true
        })
        this.signUpFormx.get('spotbieUsername').setErrors(errors)
        document.getElementById('spotbie_username').style.border = '1px solid red'
      } else {
        document.getElementById('spotbie_username').style.border = 'unset'
      }

      if(errorList.email){
        const errors: {[k: string]: any} = {};
        errorList.email.forEach(error => {
          errors[error] = true
        })
        this.signUpFormx.get('spotbieEmail').setErrors(errors)
        document.getElementById('user_email').style.border = '1px solid red'
      } else {
        document.getElementById('user_email').style.border = 'unset'
      }

      if(errorList.password){
        const errors: {[k: string]: any} = {};
        errorList.username.forEach(error => {
          errors[error] = true
        })
        this.signUpFormx.get('spotbiePassword').setErrors(errors)
        document.getElementById('user_pass').style.border = '1px solid red'
      } else {
        document.getElementById('user_pass').style.border = 'unset'
      }

      this.signingUp = false

      setTimeout(() => {
        signUpInstructions.style.display = 'block'
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

  public getCurrentWindowBg(){
    if(this.business){
      return 'sb-businessBg'
    } else {
      return 'sb-regularBg'
    }
  }

  public openIg(){
    if(this.business){
      window.open('https://www.instagram.com/spotbie.business/','_blank')
    } else {
      window.open('https://www.instagram.com/spotbie.loyalty.points/','_blank')
    }
  }

  public openYoutube(){
    window.open('https://www.youtube.com/channel/UCtxkgw0SYiihwR7O8f-xIYA','_blank')
  }

  public openTwitter(){
      window.open('https://twitter.com/SpotBie','_blank')
  }

  public openBlog(){
    window.open('https://blog.spotbie.com/','_blank')
  }

  ngOnInit() {
    this.loading = true
    this.router.url === '/business' ? this.business = true : this.business = false
    this.initSignUpForm()
  }

  ngAfterViewInit(){
  }
}
