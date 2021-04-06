import { Component, OnInit, ViewChild, ElementRef, Output, Input, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'

import * as $ from 'jquery'

import { Validators, FormGroup, FormBuilder } from '@angular/forms'

import { MustMatch } from '../../../helpers/must-match.validator'
import { ValidateUsername } from '../../../helpers/username.validator'
import { ValidatePersonName } from '../../../helpers/name.validator'
import { ValidatePassword } from '../../../helpers/password.validator'

import { SignUpService } from 'src/app/services/spotbie-logged-out/sign-up/sign-up.service'
import { catchError } from 'rxjs/operators'
import { Observable } from 'rxjs/internal/Observable'
import { of } from 'rxjs'
import { EmailConfirmationService } from '../../email-confirmation/email-confirmation.service'
import { ValidateUniqueEmail } from 'src/app/validators/email-unique.validator'
import { EmailConfirmationComponent } from '../../email-confirmation/email-confirmation.component'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'

import { faEye, faEyeSlash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css', '../../read-about/read-about.component.css']
})
export class SignUpComponent implements OnInit {

  @ViewChild('spotbie_register_info') spotbie_register_info

  @ViewChild('vc_spotbie_sign_up_box_inner') vc_spotbie_sign_up_box_inner
  @ViewChild('vc_spotbie_sign_up_box') vc_spotbie_sign_up_box

  @ViewChild('vc_account_perks_box') vc_account_perks_box

  @ViewChild('spotbieSignUpIssues') spotbieSignUpIssues

  @Output() closeWindow = new EventEmitter()

  @Input() window_obj

  public faEye = faEye
  public faInfo = faInfoCircle
  public faEyeSlash = faEyeSlash

  public signUpFormx: FormGroup

  public signing_up: boolean = false

  public sign_up_box: boolean = false

  public submitted: boolean = false

  public loading: boolean = false

  public account_perks: boolean = false

  public alreadyConfirmedEmail: string = ''
  public emailIsConfirmed: boolean = false
  public emailConfirmation: boolean

  public passwordShow: boolean = false

  constructor(private router: Router,
              private sign_up_service: SignUpService,
              private formBuilder: FormBuilder,
              private emailUniqueCheckService: EmailConfirmationService,
              private matDialog: MatDialog) { }

  scrollTo(el: ElementRef): void{
    $('html, body').animate({ scrollTop: $(el).offset().top }, 'slow')
  }

  public closeWindowX(): void {
    this.closeWindow.emit(this.window_obj)
  }

  public accountPerks(): void {
    this.account_perks = true
  }

  public closePerks(): void {
      this.account_perks = false
  }
  
  public emailChanged(){
    this.emailIsConfirmed = false
  }

  public tryEmailConfirmation(): void{
    
    this.loading = true

    const emailFormControl = this.signUpFormx.get('spotbieEmail')

    if(emailFormControl.valid &&
      (this.alreadyConfirmedEmail !== this.spotbieEmail || this.emailIsConfirmed == false)){

      this.emailIsConfirmed = false
      this.emailConfirmation = true

      const dialogConfig = new MatDialogConfig()

      dialogConfig.autoFocus = true
      dialogConfig.data = {
        email: this.spotbieEmail,
        firstName: this.spotbieFirstName
      }

      let dialogRef = this.matDialog.open(
        EmailConfirmationComponent,
        dialogConfig
      )
      
      dialogRef.componentInstance.emailAddressChange.subscribe(
        email => {
          this.signUpFormx.get('spotbieEmail').setValue(email)
          this.signUpFormx.get('spotbieEmailConfirm').setValue(email)
        }
      )

      dialogRef.afterClosed().subscribe(
        resp => {
          this.tryEmailConfirmationCb(resp) 
        }
      )

    }

  }

  public tryEmailConfirmationCb(resp: any){

    if(resp !== undefined){

      if(resp.emailConfirmed)
        this.emailIsConfirmed = true
      else 
        this.emailIsConfirmed = false
      
    } else 
      this.emailIsConfirmed = false
  
    this.alreadyConfirmedEmail = this.spotbieEmail

    this.loading = false

  }

  get spotbieUsername() { return this.signUpFormx.get('spotbieUsername').value }
  get spotbieFirstName() { return this.signUpFormx.get('spotbieFirstName').value }
  get spotbieLastName() { return this.signUpFormx.get('spotbieLastName').value }
  get spotbiePhoneNumber() { return this.signUpFormx.get('spotbiePhone').value }
  get spotbieEmail() { return this.signUpFormx.get('spotbieEmail').value }
  get spotbiePassword() { return this.signUpFormx.get('spotbiePassword').value }
  get spotbieConfirm() { return this.signUpFormx.get('spotbieConfirm').value }

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

    if(!this.emailIsConfirmed && 
          this.signUpFormx.valid){

      this.tryEmailConfirmation()
      return

    }

    this.loading = true

    this.vc_spotbie_sign_up_box_inner.nativeElement.scrollTo(0, 0)

    this.signUpFormx.updateValueAndValidity()

    // stop here if form is invalid
    if (this.signUpFormx.invalid) {

        this.signing_up = false

        if (this.signUpFormx.get('spotbieUsername').invalid)
          document.getElementById('spotbie_username').style.border = '1px solid red'
        else
          document.getElementById('spotbie_username').style.border = 'unset'

        if (this.signUpFormx.get('spotbieFirstName').invalid)
          document.getElementById('user_first_name').style.border = '1px solid red'
        else
          document.getElementById('user_first_name').style.border = 'unset'

        if (this.signUpFormx.get('spotbieLastName').invalid)
          document.getElementById('user_last_name').style.border = '1px solid red'
        else
          document.getElementById('user_last_name').style.border = 'unset'

        if (this.signUpFormx.get('spotbieEmail').invalid)
          document.getElementById('user_email').style.border = '1px solid red'
        else
          document.getElementById('user_email').style.border = 'unset'

        if (this.signUpFormx.get('spotbiePassword').invalid) 
          document.getElementById('user_pass').style.border = '1px solid red'
        else
          document.getElementById('user_pass').style.border = 'unset'

        if (this.signUpFormx.get('spotbieConfirm').invalid)
          document.getElementById('user_pass_confirm').style.border = '1px solid red'
        else
          document.getElementById('user_pass_confirm').style.border = 'unset'

        this.loading = false

        return

    } else {

      document.getElementById('spotbie_username').style.border = 'unset'
      document.getElementById('user_first_name').style.border = 'unset'
      document.getElementById('user_last_name').style.border = 'unset'
      document.getElementById('user_email').style.border = 'unset'
      document.getElementById('user_pass').style.border = 'unset'
      document.getElementById('user_pass_confirm').style.border = 'unset'
      
    }
    
    const username = this.spotbieUsername
    const user_first_name = this.spotbieFirstName
    const user_last_name = this.spotbieLastName
    const password = this.spotbiePassword
    const confirm_password = this.spotbieConfirm
    const email = this.spotbieEmail

    // send to server
    const sign_up_obj = {
        username,
        first_name: user_first_name,
        last_name: user_last_name,
        password,
        password_confirmation: confirm_password,
        email
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

  private initSignUpCallback(httpResponse: any) {
      
      if(httpResponse.message == 'success'){       

        let sign_up_instructions = this.spotbieSignUpIssues.nativeElement

        const loginResponse = httpResponse

        // save the user information.
        localStorage.setItem('spotbie_userLogin', loginResponse.user.username)
        localStorage.setItem('spotbie_loggedIn', '1')
        localStorage.setItem('spotbie_rememberMe', '0')
        localStorage.setItem('spotbie_userId', loginResponse.user.id)
        localStorage.setItem('spotbie_userDefaultImage', loginResponse.spotbie_user.default_picture)
        localStorage.setItem('spotbiecom_session', loginResponse.tokenInfo.original.access_token)

        sign_up_instructions.className = 'signUpBoxInstructions'
        sign_up_instructions.innerHTML = 'Welcome to SpotBie!'

        this.router.navigate(['/user-home'])

      } else
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

      sign_up_instructions.className = 'signUpBoxInstructions spotbie-error-red'
      sign_up_instructions.style.display = 'none'

      sign_up_instructions.innerHTML = "There was an error signing-up."

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

      if(error_list.first_name){

        let errors: {[k: string]: any} = {};
        error_list.first_name.forEach(error => {
          errors[error] = true
        })        
        this.signUpFormx.get('spotbieFirstName').setErrors(errors)
        document.getElementById('user_first_name').style.border = '1px solid red' 

      } else
        document.getElementById('user_first_name').style.border = 'unset'

      if(error_list.last_name){

        let errors: {[k: string]: any} = {};
        error_list.last_name.forEach(error => {
          errors[error] = true
        })                
        this.signUpFormx.get('spotbieLastName').setErrors(errors)
        document.getElementById('user_last_name').style.border = '1px solid red' 

      } else
        document.getElementById('user_last_name').style.border = 'unset'

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

      if(error_list.password_confirmation){

        let errors: {[k: string]: any} = {};
        error_list.password_confirmation.forEach(error => {
          error[error] = true
        })          
        this.signUpFormx.get('spotbieConfirm').setErrors(errors)
        document.getElementById('user_pass_confirm').style.border = '1px solid red' 
        
      } else
        document.getElementById('user_pass_confirm').style.border = 'unset'

      this.signing_up = false

      setTimeout(function() {
        sign_up_instructions.style.display = 'block' 
      } , 200)  

      // Let the app keep running by returning an empty result.
      return of(result as T)

    }

  }

  public finishSignUp() {
    const signUpBox = document.getElementById('spotbie_sign_up_box')
    signUpBox.style.display = 'none'
    const successsignUp = document.getElementById('success_box')
    successsignUp.style.display = 'none'
  }

  public initSignUpForm() {
    
    // will set validators for form and take care of animations
    const usernameValidators = [Validators.required]
    const passwordValidators = [Validators.required]
    const firstNameValidators = [Validators.required]
    const lastNameValidators = [Validators.required]
    const emailValidators = [Validators.required, Validators.email]

    this.signUpFormx = this.formBuilder.group({
        spotbieUsername: ['', usernameValidators],
        spotbieEmail: ['', emailValidators],
        spotbieFirstName: ['', firstNameValidators],
        spotbieLastName: ['', lastNameValidators],
        spotbiePassword: ['', passwordValidators],
        spotbieConfirm: ['', passwordValidators]
    }, {
        validators: [ValidateUsername('spotbieUsername'),
                    ValidatePassword('spotbiePassword'),
                    MustMatch('spotbiePassword', 'spotbieConfirm'),
                    ValidatePersonName('spotbieFirstName'),
                    ValidatePersonName('spotbieLastName'),]
    })

    this.signUpFormx.setAsyncValidators(
      ValidateUniqueEmail.valid(
        this.emailUniqueCheckService, 
        this.spotbieEmail
      )
    )

    this.loading = false

  }

  ngOnInit() {    
    this.loading = true
    this.initSignUpForm()
  }

  ngAfterViewInit(){
  }
  
}
