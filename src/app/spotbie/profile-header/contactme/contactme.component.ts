import { Component, OnInit, ViewChild, Input } from '@angular/core'
import { ProfileHeaderComponent } from '../profile-header.component'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import * as spotbieGlobals from '../../../globals'
import { HttpClient } from '@angular/common/http'

const PROFILE_HEADER_API = spotbieGlobals.API + 'contact_me'

@Component({
  selector: 'app-contactme',
  templateUrl: './contactme.component.html',
  styleUrls: ['./contactme.component.css']
})
export class ContactmeComponent implements OnInit {

  @ViewChild('spotbie_contact_me_info') spotbie_contact_me_info

  @Input() user_id: string

  public contact_me_submitted = false
  public spotbie_contact_me_form: FormGroup
  public background_color: string

  public loading = false

  constructor(private host: ProfileHeaderComponent,
              private http: HttpClient,
              private formBuilder: FormBuilder) { }

  public closeWindow(): void {
    this.host.contactMeWindow.open = false
  }

  public initContactMeForm(): void {

    const facebook_validators = [Validators.required, Validators.maxLength(130)]
    const instagram_validators = [Validators.required, Validators.maxLength(130)]
    const twitter_validators = [Validators.required, Validators.maxLength(130)]
    const whatsapp_validators = [Validators.required, Validators.maxLength(130)]
    const snapchat_validators = [Validators.required, Validators.maxLength(130)]

    this.spotbie_contact_me_form = this.formBuilder.group({
      facebook: ['', facebook_validators],
      instagram: ['', instagram_validators],
      twitter: ['', twitter_validators],
      whatsapp: ['', whatsapp_validators],
      snapchat: ['', snapchat_validators]
    })

    this.getContactMe()

  }

  public getContactMe(): void {

    const get_contact_me_api = `${PROFILE_HEADER_API}/${this.user_id}/show`

    this.http.get<any>(get_contact_me_api).subscribe( 
      resp => {
        this.getContactMeCallback(resp)
      },
        error => {
          console.log('getContactMe', error)
      }
    )

  }

  public getContactMeCallback(httpResponse: any): void {

    console.log('Contact Me: ', httpResponse)

    if (httpResponse.message == 'success')
      this.populateContactMe(httpResponse.contact_me)
    else
      console.log('getContactMeCallback', httpResponse)

  }

  public saveContactMe(): void {

    this.loading = true

    if (this.contact_me_submitted) {
      this.loading = false
      return
    } else { this.contact_me_submitted = true }

    if (this.spotbie_contact_me_form.invalid) {
      this.loading = false
      return
    }

    const contact_me_object = {
      facebook: this.facebook,
      instagram: this.instagram,
      twitter: this.twitter,
      whatsapp: this.whatsapp,
      snapchat: this.snapchat
    }

    const save_contact_me_api = `${PROFILE_HEADER_API}/update`

    this.http.post<any>(save_contact_me_api, contact_me_object).subscribe( 
      resp => {
        this.saveQuestionsCallback(resp)
      },
      error => {
        console.log('saveContactMe', error)
      }
    )

  }

  public saveQuestionsCallback(httpResponse: any): void {

    this.loading = false
    this.contact_me_submitted = false

    if (httpResponse.message == 'success')
      this.spotbie_contact_me_info.nativeElement.innerHTML = 'ContactMe Saved.'
    else
      console.log('Profile Save Contact Me Error: ', httpResponse)

  }

  private populateContactMe(contact_me_object: any) {

    this.spotbie_contact_me_form.get('facebook').setValue(contact_me_object.facebook)
    this.spotbie_contact_me_form.get('instagram').setValue(contact_me_object.instagram)
    this.spotbie_contact_me_form.get('twitter').setValue(contact_me_object.twitter)
    this.spotbie_contact_me_form.get('whatsapp').setValue(contact_me_object.whatsapp)
    this.spotbie_contact_me_form.get('snapchat').setValue(contact_me_object.snapchat)

    this.loading = false

  }

  get facebook() { return this.spotbie_contact_me_form.get('facebook').value }
  get instagram() { return this.spotbie_contact_me_form.get('instagram').value }
  get twitter() { return this.spotbie_contact_me_form.get('twitter').value }
  get whatsapp() { return this.spotbie_contact_me_form.get('whatsapp').value }
  get snapchat() { return this.spotbie_contact_me_form.get('snapchat').value }
  get g() { return this.spotbie_contact_me_form.controls }

  ngOnInit() {

    this.loading = true
    this.background_color = localStorage.getItem('spotbie_backgroundColor')
    this.initContactMeForm()

  }

}
