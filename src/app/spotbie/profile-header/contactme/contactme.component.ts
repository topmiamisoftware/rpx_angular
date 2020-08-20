import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileHeaderComponent } from '../profile-header.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as spotbieGlobals from '../../../globals';
import { HttpResponse } from '../../../models/http-reponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const PROFILE_HEADER_API = spotbieGlobals.API + 'api/settings.service.php';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};


@Component({
  selector: 'app-contactme',
  templateUrl: './contactme.component.html',
  styleUrls: ['./contactme.component.css']
})
export class ContactmeComponent implements OnInit {

  @ViewChild('spotbie_contact_me_info') spotbie_contact_me_info;

  public contact_me_submitted = false;
  public spotbie_contact_me_form : FormGroup;
  public background_color : string;

  private exe_api_key : string;

  public loading = false;

  constructor(private host: ProfileHeaderComponent,
              private http: HttpClient,
              private formBuilder: FormBuilder) { }

  closeWindow() {
    this.host.contactMeWindow.open = false;
  }

  initContactMeForm() {

    const contact_me_1_validators = [Validators.required, Validators.maxLength(130)];
    const contact_me_2_validators = [Validators.required, Validators.maxLength(130)];
    const contact_me_3_validators = [Validators.required, Validators.maxLength(130)];
    const contact_me_4_validators = [Validators.required, Validators.maxLength(130)];
    const contact_me_5_validators = [Validators.required, Validators.maxLength(130)];


    this.spotbie_contact_me_form = this.formBuilder.group({
      spotbie_contact_me_1 : ['', contact_me_1_validators],
      spotbie_contact_me_2 : ['', contact_me_2_validators],
      spotbie_contact_me_3 : ['', contact_me_3_validators],
      spotbie_contact_me_4 : ['', contact_me_4_validators],
      spotbie_contact_me_5 : ['', contact_me_5_validators]
    });

    this.getContactMe();

  }

  getContactMe() {

    const get_profile_header_object = { exe_api_key : this.exe_api_key, exe_settings_action : 'getContactMe', public_exe_user_id : 'null' };

    this.http.post<HttpResponse>(PROFILE_HEADER_API, get_profile_header_object, HTTP_OPTIONS)
    .subscribe( resp => {
      const httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      });
      this.getContactMeCallback(httpResponse);
    },
      error => {
        console.log('Profile Contact Me Error : ', error);
    });

  }

  getContactMeCallback(httpResponse: HttpResponse) {
    if (httpResponse.status == '200') {
      console.log('Contact Me : ', httpResponse);
      this.populateContactMe(httpResponse.responseObject);
    } else {
      console.log('Contact Me Error : ', httpResponse);
    }
  }

  saveContactMe() {

    this.loading = true;

    if (this.contact_me_submitted) {
      this.loading = false;
      return;
    } else { this.contact_me_submitted = true; }

    if (this.spotbie_contact_me_form.invalid) {
      this.loading = false;
      return;
    }

    const contact_me_object = {
      contact_me_1 : this.spotbie_contact_me_1,
      contact_me_2 : this.spotbie_contact_me_2,
      contact_me_3 : this.spotbie_contact_me_3,
      contact_me_4 : this.spotbie_contact_me_4,
      contact_me_5 : this.spotbie_contact_me_5,
    };

    const get_profile_header_object = { exe_api_key : this.exe_api_key, exe_settings_action : 'saveContactMe', contact_me_object };

    this.http.post<HttpResponse>(PROFILE_HEADER_API, get_profile_header_object, HTTP_OPTIONS)
    .subscribe( resp => {
      const httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      });
      this.saveQuestionsCallback(httpResponse);
    },
      error => {
        console.log('Profile Save Contact Me Error : ', error);
    });

  }

  saveQuestionsCallback(httpResponse: HttpResponse) {
    this.loading = false;
    this.contact_me_submitted = false;
    if (httpResponse.status == '200') {
      this.spotbie_contact_me_info.nativeElement.innerHTML = 'ContactMe Saved.';
    } else {
      console.log('Profile Save Contact Me Error : ', httpResponse);
    }
  }

  private populateContactMe(contact_me_object: any) {
    this.spotbie_contact_me_form.get('spotbie_contact_me_1').setValue(contact_me_object.fb);
    this.spotbie_contact_me_form.get('spotbie_contact_me_2').setValue(contact_me_object.ig);
    this.spotbie_contact_me_form.get('spotbie_contact_me_3').setValue(contact_me_object.sp);
    this.spotbie_contact_me_form.get('spotbie_contact_me_4').setValue(contact_me_object.twt);
    this.spotbie_contact_me_form.get('spotbie_contact_me_5').setValue(contact_me_object.wtu);
    this.loading = false;
  }

  get spotbie_contact_me_1() { return this.spotbie_contact_me_form.get('spotbie_contact_me_1').value; }
  get spotbie_contact_me_2() { return this.spotbie_contact_me_form.get('spotbie_contact_me_2').value; }
  get spotbie_contact_me_3() { return this.spotbie_contact_me_form.get('spotbie_contact_me_3').value; }
  get spotbie_contact_me_4() { return this.spotbie_contact_me_form.get('spotbie_contact_me_4').value; }
  get spotbie_contact_me_5() { return this.spotbie_contact_me_form.get('spotbie_contact_me_5').value; }
  get g() { return this.spotbie_contact_me_form.controls; }

  ngOnInit() {
    this.loading = true;
    this.background_color = localStorage.getItem('spotbie_backgroundColor');
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey');
    this.initContactMeForm();
  }

}
