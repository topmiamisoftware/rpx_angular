import { Component, OnInit, ViewChild, Input } from '@angular/core'
import { ProfileHeaderComponent } from '../profile-header.component'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import * as spotbieGlobals from '../../../globals'
import { HttpClient } from '@angular/common/http'

const CONTACT_ME_API = spotbieGlobals.API + 'contact-me'

@Component({
  selector: 'app-contactme',
  templateUrl: './contactme.component.html',
  styleUrls: ['./contactme.component.css']
})
export class ContactmeComponent implements OnInit {

  @ViewChild('spotbieContactMeInfo') spotbieContactMeInfo

  @Input() userId: string
  @Input() bgColor: string
  @Input() publicProfileInfo: any

  public contactMeSubmitted = false
  public spotbieContactMeForm: FormGroup

  public loading = false

  constructor(private host: ProfileHeaderComponent,
              private http: HttpClient,
              private formBuilder: FormBuilder) { }

  public closeWindow(): void {
    this.host.contactMeWindow.open = false
  }

  public initContactMeForm(): void {

    const facebookValidators = [Validators.maxLength(130)]
    const instagramValidators = [Validators.maxLength(130)]
    const twitterValidators = [Validators.maxLength(130)]
    const whatsappValidators = [Validators.maxLength(130)]
    const snapchatValidators = [Validators.maxLength(130)]

    this.spotbieContactMeForm = this.formBuilder.group({
      facebook: ['', facebookValidators],
      instagram: ['', instagramValidators],
      twitter: ['', twitterValidators],
      whatsapp: ['', whatsappValidators],
      snapchat: ['', snapchatValidators]
    })

    this.getContactMe()

  }

  public getContactMe(): void {

    const getContactMeApi = `${CONTACT_ME_API}/${this.userId}/show`

    this.http.get<any>(getContactMeApi).subscribe( 
      resp => {
        this.getContactMeCallback(resp)
      },
      error => {
        console.log('getContactMe', error)
      }
    )

  }

  public getContactMeCallback(httpResponse: any): void {

    if (httpResponse.message == 'success')
      this.populateContactMe(httpResponse.contact_me)
    else
      console.log('getContactMeCallback', httpResponse)

  }

  public saveContactMe(): void {

    this.loading = true
    this.contactMeSubmitted = true

    if (this.spotbieContactMeForm.invalid) {
      this.loading = false
      return
    }

    const contactMeObject = {
      facebook: this.facebook,
      instagram: this.instagram,
      twitter: this.twitter,
      whatsapp: this.whatsapp,
      snapchat: this.snapchat
    }

    const saveContactMeApi = `${CONTACT_ME_API}/update`

    this.http.post<any>(saveContactMeApi, contactMeObject).subscribe( 
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
    this.contactMeSubmitted = false

    if (httpResponse.message == 'success')
      this.spotbieContactMeInfo.nativeElement.innerHTML = 'ContactMe Saved.'
    else
      console.log('Profile Save Contact Me Error: ', httpResponse)

  }

  private populateContactMe(contactMeObject: any) {

    if(this.publicProfileInfo !== undefined){
      this.spotbieContactMeForm.get('facebook').disable()
      this.spotbieContactMeForm.get('instagram').disable()
      this.spotbieContactMeForm.get('twitter').disable()
      this.spotbieContactMeForm.get('whatsapp').disable()
      this.spotbieContactMeForm.get('snapchat').disable()     
    }

    if(contactMeObject === null){
      return
    } else {
      this.spotbieContactMeForm.get('facebook').setValue(contactMeObject.facebook)
      this.spotbieContactMeForm.get('instagram').setValue(contactMeObject.instagram)
      this.spotbieContactMeForm.get('twitter').setValue(contactMeObject.twitter)
      this.spotbieContactMeForm.get('whatsapp').setValue(contactMeObject.whatsapp)
      this.spotbieContactMeForm.get('snapchat').setValue(contactMeObject.snapchat)
    }

    this.loading = false

  }

  get facebook() { return this.spotbieContactMeForm.get('facebook').value }
  get instagram() { return this.spotbieContactMeForm.get('instagram').value }
  get twitter() { return this.spotbieContactMeForm.get('twitter').value }
  get whatsapp() { return this.spotbieContactMeForm.get('whatsapp').value }
  get snapchat() { return this.spotbieContactMeForm.get('snapchat').value }
  get g() { return this.spotbieContactMeForm.controls }

  ngOnInit() {

    this.loading = true
    this.initContactMeForm()

  }

}
