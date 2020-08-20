import { Component, OnInit } from '@angular/core';
import { LogInComponent } from '../log-in/log-in.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpResponse } from '../../../models/http-reponse';
import * as spotbieGlobals from '../../../globals';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ValidatePassword } from '../../../helpers/password.validator';
import { MustMatch } from '../../../helpers/must-match.validator';

const SETTINGS_API = spotbieGlobals.API + 'api/passwordreset.service.php';

const DEF_INC_PASS_OR_EM_MSG = "Enter your Phone Number or E-Mail";

const DEF_PIN_PASS_OR_EM_MSG = "Check your phone or e-mail.";

const NEW_PASS_MSG =  "Enter Your New Password.";

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public password_reset_form: FormGroup;
  public password_reset_form_2: FormGroup;
  public password_form: FormGroup;

  public pass_reset_submitted: boolean = false;

  public loading: boolean = false;

  public password_submitted: boolean = false;

  public save_password: boolean = false;

  public step_one: boolean = true;
  public step_two: boolean = false;
  public step_three: boolean = false;
  public step_four: boolean = false;

  public pin_reset_submitted: boolean = false;

  public attempts_remaining: number = 3;

  public reset_pin: string; 

  public pin_ready_msg: string = DEF_PIN_PASS_OR_EM_MSG;

  public email_or_ph_error: string = DEF_INC_PASS_OR_EM_MSG;
  
  public new_password_msg: string = NEW_PASS_MSG;

  constructor(private host: LogInComponent,
                private formBuilder: FormBuilder,
                private http: HttpClient) { }

  closeWindow(){
    this.host.forgotPasswordWindow.open = false;
  }

  initForgotPassForm(){

    const spotbie_email_or_ph_validators = [Validators.required, Validators.maxLength(130)];

    this.password_reset_form = this.formBuilder.group({
      spotbie_email_or_ph : ['', spotbie_email_or_ph_validators]
    });

  }
  
  get spotbie_email_or_ph() { return this.password_reset_form.get('spotbie_email_or_ph').value; }
  get g() { return this.password_reset_form.controls; }
  
  get spotbie_reset_pin() { return this.password_reset_form_2.get('spotbie_reset_pin').value; }
  get f() { return this.password_reset_form_2.controls; }

  get spotbie_reset_password() { return this.password_form.get('spotbie_reset_password').value; }
  get spotbie_reset_password_c() { return this.password_form.get('spotbie_reset_password_c').value; }
  get h() { return this.password_form.controls; }

  initPinForm(){

    this.step_two = true;

    const spotbie_pin_validators = [Validators.required];

    this.password_reset_form_2 = this.formBuilder.group({
      spotbie_reset_pin : ['', spotbie_pin_validators]
    });

  }

  sendPin(){

    this.pin_reset_submitted = true;

    if(this.loading) return;

    if(this.password_reset_form_2.invalid) return;

    this.loading = true;
    
    let reset_pin = this.spotbie_reset_pin;

    const get_profile_header_object = {exe_settings_action : 'initPin', reset_pin : reset_pin};

    this.http.post<HttpResponse>(SETTINGS_API, get_profile_header_object, HTTP_OPTIONS)
    .subscribe( resp => {
      const httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      });
      this.sendPinCb(httpResponse);
    },
      error => {
        console.log('Pass Reset Error : ', error);
    });    
  }

  sendPinCb(httpResponse : HttpResponse){
    if(httpResponse.status == '200'){
      if(httpResponse.responseObject == 'true'){
        this.reset_pin = this.spotbie_reset_pin;
        this.step_two = false;
        this.initPasswordForm();
      } else {
        this.pin_ready_msg = "Your pin was incorrect.";
      }
    } else {
      console.log('Pass Reset Error : ', httpResponse);
    }
    this.loading = false;
  }

  startPassReset(){

    this.pass_reset_submitted = true;

    if(this.loading) return;

    if(this.password_reset_form.invalid) return;

    this.loading = true;
    
    let email_or_phone = this.spotbie_email_or_ph;

    const get_profile_header_object = {  exe_settings_action : 'startPasswordReset', email_or_phone : email_or_phone };

    this.http.post<HttpResponse>(SETTINGS_API, get_profile_header_object, HTTP_OPTIONS)
    .subscribe( resp => {
      const httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      });
      this.startPassResetCb(httpResponse);
    },
      error => {
        console.log('Pass Reset Error : ', error);
    });
  }

  startPassResetCb(httpResponse : HttpResponse){
    if(httpResponse.status == '200'){
      if(httpResponse.responseObject == 'true'){
        this.step_one = false;        
        this.initPinForm();
      } else {
        this.email_or_ph_error = "Incorrect e-mail or phone number.";
      }
    } else {
      console.log('Pass Reset Error : ', httpResponse);
    }
    this.loading = false;
  }

  initPasswordForm(){

    this.step_three = true;

    const password_validators = [Validators.required];
    const password_confirm_validators = [Validators.required];

    this.password_form = this.formBuilder.group({
      spotbie_reset_password : ['', password_validators],
      spotbie_reset_password_c : ['', password_confirm_validators]
    },{
      validators : [ValidatePassword('spotbie_reset_password'),
                MustMatch('spotbie_reset_password', 'spotbie_reset_password_c')]
    }); 
    
  }

  completeSavePassword() {

    
    this.password_submitted = true;
    
    if(this.password_form.invalid){
      this.save_password = false;
      return;
    } 

    if(this.save_password) return;

    this.loading = true;

    const exe_save_password_object = { 
      password : this.spotbie_reset_password, 
      confirm_password : this.spotbie_reset_password_c
    };

    const settings_object = { exe_settings_object : JSON.stringify(exe_save_password_object), 
                              exe_settings_action : 'savePasswordFromReset',
                              reset_pin : this.reset_pin
                            };
    
    this.http.post<HttpResponse>(SETTINGS_API, settings_object, HTTP_OPTIONS)
            .subscribe( resp => {
              // console.log("Settings Response", resp);
                const settings_response = new HttpResponse ({
                status : resp.status,
                message : resp.message,
                full_message : resp.full_message,
                responseObject : resp.responseObject
              });
                this.passwordChanged(settings_response);
            },
              error => {
                console.log('error', error);
            });
  }

  passwordChanged(settings_response: HttpResponse) {

    if (settings_response.status == '200') {

      //console.log(settings_response.responseObject);
      this.save_password = false;
      switch (settings_response.responseObject.saved) {
        case 'saved':
          this.new_password_msg = 'Your password was updated. You can now log-in.';
          this.step_three = false;
          this.step_four = true;
          setTimeout(function(){
            this.closeWindow();
          }.bind(this), 3500);
          break;
        case 'SB-E-000':
          // server error
          this.new_password_msg = 'There was an error with the server. Try again.';
          break;
        case 'SB-E-01':
          // passwords don't match
          this.new_password_msg = 'Your passwords must match.';
          break;
        case 'SB-E-02':
          // Invalid password
          this.new_password_msg = 'Your current password is invalid.';
          break;
      }
      
    } else {
      console.log(settings_response);
    }
    this.loading = false;
  }

  ngOnInit() {
    this.initForgotPassForm();
  }

}
