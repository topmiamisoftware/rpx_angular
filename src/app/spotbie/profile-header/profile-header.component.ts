import { Component, OnInit, ViewChild, Input } from '@angular/core'
import { HttpClient, HttpEventType } from '@angular/common/http'
import { Swiper } from 'swiper/dist/js/swiper.esm.js'
import * as spotbieGlobals from '../../globals'
import { Validators, FormGroup, FormBuilder } from '@angular/forms'
import { SanitizePipe } from '../../pipes/sanitize.pipe'
import { Subscription } from 'rxjs'
import { User } from 'src/app/models/user'
import { ProfileHeaderService } from 'src/app/services/profile-header/profile-header.service'
import { ColorsService } from 'src/app/services/background-color/colors.service'

const PROFILE_HEADER_API = spotbieGlobals.API + 'api/settings.service.php'

const BACKGROUND_UPLOAD_API_URL = `${spotbieGlobals.API}profile_header/upload_background`
const BACKGROUND_MAX_UPLOAD_SIZE = 3e+6

const DEFAULT_UPLOAD_API_URL = `${spotbieGlobals.API}profile_header/upload_default`
const DEFAULT_MAX_UPLOAD_SIZE = 3e+6

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css']
})
export class ProfileHeaderComponent implements OnInit {

  @Input() publicProfileInfo

  @Input() current_user_bg
  
  @Input() album_id: string
  @Input() album_media_id: string

  @ViewChild('spotbie_description_info') spotbie_description_info

  @ViewChild('spotBackgroundInput') spotBackgroundInput
  @ViewChild('spotbie_upload_background_info') spotbie_upload_background_info

  @ViewChild('spotDefaultInput') spotDefaultInput
  @ViewChild('spotbie_upload_default_info') spotbie_upload_default_info

  public default_media_message: string = 'Upload a new default image.'
  public default_media_progress: number

  public background_media_message: string = 'Change your background image.'
  public background_media_progress: number

  public user = new User()

  public public_profile: boolean = false

  public showDefaultPictureMessage: boolean = false
  public defaultPictureMessage: string = null

  private profile_pictures_index: number = 0

  public m_swiper: Swiper
  public profile_images_loaded: boolean

  public edit_description: boolean = false

  public profile_description_form: FormGroup
  public new_profile_description: string
  public description_submitted: boolean = false

  public upload_background: boolean = false
  public upload_default: boolean = false

  public questionsWindow = { open: false }
  public contactMeWindow = { open: false }
  public friendActionsWindow = { open: false}

  public loading: boolean = false

  public webOptionsSubscriber: Subscription

  public isLoggedIn: string = '0'

  constructor(private http: HttpClient,
              private formBuilder: FormBuilder,
              private profile_header_service: ProfileHeaderService,
              private webOptionsService: ColorsService) {}

  private getMyProfileHeader(): void {
                                    
    this.profile_header_service.myProfileHeader().subscribe( 
      resp => {
        this.getMyProfileHeaderCallback(resp)
      },
      error => {
        console.log("getProfileHeader", error)
      }
    )

  }

  private getMyProfileHeaderCallback(profileHeaderResponse: any): void{

    const user = profileHeaderResponse.user
    const spotbie_user = profileHeaderResponse.spotbie_user
    const default_images = profileHeaderResponse.default_images
    const webOptions = profileHeaderResponse.web_options

    let current_index = 0

    this.user.profile_pictures = default_images.map(default_image => default_image.default_image_url)

    if(this.user.profile_pictures.length > 0){

      this.user.profile_pictures.forEach(profile_picture =>{
      
        current_index = this.user.profile_pictures.indexOf(profile_picture)
  
        if(this.user.profile_pictures[current_index] == spotbie_user.default_picture)
          this.profile_pictures_index = current_index
  
      }) 

    } else
      this.user.profile_pictures[current_index] = spotbieGlobals.NEW_USER_DEFAULT

    this.user.exe_user_default_picture = spotbie_user.default_picture

    this.user.exe_user_full_name = spotbie_user.first_name + " " + spotbie_user.last_name
    this.user.username = user.username

    this.profile_images_loaded = true
    this.user.exe_desc = unescape(spotbie_user.description)
    this.user.exe_animal = spotbie_user.animal
    this.user.ghost = spotbie_user.ghost_mode
    this.user.privacy = spotbie_user.privacy
    this.user.exe_background_color = webOptions.bg_color

    const _this = this
    
    this.m_swiper = new Swiper('.spotbie-swiper', {
      slidesPerView: 1,
      initialSlide: _this.profile_pictures_index,
      spaceBetween: 0,
      allowTouchMove: false,
      on: {
        slideNextTransitionStart() { _this.nextProfilePicIndex() },
        slidePrevTransitionStart() { _this.prevProfilePicIndex() }
      }
    })

    const mSwiperSlides = document.getElementsByClassName('swiper-slide')

    for (let i = 0; i < mSwiperSlides.length; i++) {
      const el = mSwiperSlides[i] as HTMLElement
      el.style.position = 'absolute'
    }

    const description_validators = [Validators.maxLength(360)]

    this.profile_description_form = this.formBuilder.group({
      spotbie_profile_description: ['', description_validators],
    })

  }

  private prevProfilePicIndex(): void {

    if (this.profile_pictures_index == 0) {
      return
    } else {
      this.profile_pictures_index--
      this.user.exe_user_default_picture = this.user.profile_pictures[this.profile_pictures_index]
    }

  }

  public prevSlide(): void {
    if (this.profile_pictures_index == 0) return
    this.m_swiper.slidePrev()
  }

  private nextProfilePicIndex(): void {

    if (this.profile_pictures_index == (this.user.profile_pictures.length - 1)) {
      return
    } else {
      this.profile_pictures_index++
      this.user.exe_user_default_picture = this.user.profile_pictures[this.profile_pictures_index]
    }

  }

  public nextSlide(): void {
    if (this.profile_pictures_index == (this.user.profile_pictures.length - 1)) return
    this.m_swiper.slideNext()
  }

  public startBackgroundUploader(): void{
    this.spotBackgroundInput.nativeElement.click()
  }

  public uploadBackground(files): void {

    const file_list_length = files.length

    if (file_list_length === 0) {
      this.background_media_message = 'You must upload at least one file.'
      return
    } else if (file_list_length > 1) {
      this.background_media_message = 'Upload only one background image.'
      return
    }

    this.loading = true

    const formData = new FormData()
    
    let file_to_upload
    let upload_size = 0

    for (let i = 0; i < file_list_length; i++) {

      file_to_upload = files[i] as File

      upload_size += file_to_upload.size

      if (upload_size > BACKGROUND_MAX_UPLOAD_SIZE) {
        this.background_media_message = 'Max upload size is 3MB.'
        return
      }

      formData.append('background_picture', file_to_upload, file_to_upload.name)

    }

    this.http.post(BACKGROUND_UPLOAD_API_URL, formData, {reportProgress: true, observe: 'events'}).subscribe(event => {

      if (event.type === HttpEventType.UploadProgress)
        this.background_media_progress = Math.round(100 * event.loaded / event.total)
      else if (event.type === HttpEventType.Response)
        this.backgroundUploadFinished(event.body)

    })

    return

  }

  private backgroundUploadFinished(httpResponse: any): void {

    console.log('backgroundUploadFinished', httpResponse)

    if (httpResponse.success)
      this.user.acc_splash = httpResponse.background_picture
    else
      console.log('backgroundUploadFinished', httpResponse)
    
    this.loading = false

  }

  public setDefault(): void {

    this.loading = true

    if (this.user.exe_user_default_picture == spotbieGlobals.NEW_USER_DEFAULT) {
      this.loading = false
      return
    }

    const new_profile_image = this.user.profile_pictures[this.profile_pictures_index]

    this.profile_header_service.setDefault(new_profile_image).subscribe(
      resp => {
        this.setDefaultCallback(resp)
      }
    )

  }

  public setDefaultCallback(resp: any) {


    if(resp.success){
      
      this.defaultPictureMessage = "Profile Image Changed"
      this.showDefaultPictureMessage = true
      
      setTimeout(function() {
        this.showDefaultPictureMessage = false
      }.bind(this), 2500)
      
      if(resp.default_picture !== undefined){
        localStorage.setItem('spotbie_userDefaultImage', resp.default_picture)
      }

    }
    
    this.loading = false

  }

  public startDefaultUploader() {
    this.spotDefaultInput.nativeElement.click()
  }
  
  public deleteProfilePicture(): void {

    this.loading = true

    const current_profile_image = this.user.profile_pictures[this.profile_pictures_index]

    if (current_profile_image == spotbieGlobals.NEW_USER_DEFAULT) {
      this.loading = false
      return
    }

    this.profile_header_service.deleteDefault(current_profile_image).subscribe( 
      resp => {
        this.deleteDefaultCallback(resp)
      }
    )

  }

  public deleteDefaultCallback(httpResponse: any) {

    if (httpResponse.success) {

      this.user.profile_pictures.splice(this.profile_pictures_index, 1)

      this.user.exe_user_default_picture = httpResponse.new_profile_default

      if (this.user.exe_user_default_picture == spotbieGlobals.NEW_USER_DEFAULT) {

        this.user.profile_pictures = []
        this.user.profile_pictures[0] = this.user.exe_user_default_picture
        this.m_swiper.slideTo(0)

      } else {

        const a = this.user.profile_pictures.indexOf(this.user.exe_user_default_picture)
        this.m_swiper.slideTo(a)

      }

      localStorage.setItem('spotbie_userDefaultImage', httpResponse.new_profile_default)

    } else
      console.log('deleteDefaultCallback', httpResponse)
    
    this.loading = false
    
  }

  public uploadDefault(files): void {

    this.loading = true

    const file_list_length = files.length

    if (file_list_length === 0) {
      this.default_media_message = 'You must upload at least one default image.'
      this.loading = false
      return
    } else if (file_list_length > 1) {
      this.default_media_message = 'Upload only one default image.'
      this.loading = false
      return
    }

    const formData = new FormData()

    let default_picture
    let upload_size = 0

    for (let i = 0; i < file_list_length; i++) {

      default_picture = files[i] as File

      upload_size += default_picture.size

      if (upload_size > DEFAULT_MAX_UPLOAD_SIZE) {
        this.default_media_message = 'Max upload size is 3MB.'
        return
      }

      formData.append('default_picture', default_picture, default_picture.name)

    }

    this.http.post(DEFAULT_UPLOAD_API_URL, formData, {reportProgress: true, observe: 'events'}).subscribe(event => {

      if (event.type === HttpEventType.UploadProgress)
        this.default_media_progress = Math.round(100 * event.loaded / event.total)
      else if (event.type === HttpEventType.Response)
        this.defaultUploadFinished(event.body)

    })

    return
  
  }

  public defaultUploadFinished(httpResponse: any): void {

    if (httpResponse.success) {

      this.cancelDefault()

      this.user.exe_user_default_picture = httpResponse.default_picture

      localStorage.setItem('spotbie_userDefaultImage', this.user.exe_user_default_picture)

      this.user.profile_pictures.unshift(this.user.exe_user_default_picture)
      this.profile_pictures_index = 0
      this.m_swiper.slideTo(this.profile_pictures_index)

      if (this.user.profile_pictures[1].indexOf('user.png') > -1) this.user.profile_pictures.pop()

    } else
      console.log('defaultUploadFinished', httpResponse)

    this.loading = false

  }
  
  get f() { return this.profile_description_form.controls }
  get spotbie_profile_description() {return this.profile_description_form.get('spotbie_profile_description').value }

  public setDescription(): void {

    if (this.description_submitted) return; else this.description_submitted = true

    if (this.profile_description_form.invalid) return

    this.loading = true

    const description = this.spotbie_profile_description

    this.profile_header_service.setDescription(description).subscribe(
      resp =>{
        this.setDescriptionCallback(resp)
      }
    )

  }

  public setDescriptionCallback(reponse: any): void{

    this.description_submitted = false
    this.user.exe_desc = unescape(reponse.description)
    this.cancelDescription()
    
    this.loading = false

  }

  public editDescription(): void {

    this.loading = true

    this.edit_description = true
    
    let profile_description = new SanitizePipe()
    let sanitized_description = profile_description.transform(this.user.exe_desc)

    this.profile_description_form.get('spotbie_profile_description').setValue(sanitized_description)

    this.loading = false
    
  }

  public cancelDescription():void {
    this.edit_description = false
  }

  public newBackground():void {
    this.upload_background = true
  }

  public cancelBackground():void {
    this.upload_background = false
  }

  public cancelDefault():void {
    this.upload_default = false
  }

  public changeProfilePicture():void {
    this.upload_default = true
  }

  public openWindow(window):void {
    window.open = true
  }

  public closeWindow(window){
    window.open = false
  }

  ngOnInit(){

    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn')

    this.webOptionsSubscriber = this.webOptionsService.getWebOptions().subscribe(
      web_options =>{
        if(web_options.bg_color) this.user.exe_background_color = web_options.bg_color
      }
    )

  }

  ngAfterViewInit(){

    if (this.publicProfileInfo !== undefined) {

      this.getMyProfileHeaderCallback(this.publicProfileInfo)
      this.user.id = this.publicProfileInfo.user.id
      this.public_profile = true
      
    } else {

      //Viewing our own profile.

      this.user.id = parseInt(localStorage.getItem('spotbie_userId'))
      this.user.acc_splash = this.current_user_bg

      this.getMyProfileHeader()

    }

  }
}
