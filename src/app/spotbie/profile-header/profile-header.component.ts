import { Component, OnInit, ViewChild, Input } from '@angular/core'
import { HttpClient, HttpEventType } from '@angular/common/http'
import { Swiper } from 'swiper/dist/js/swiper.esm.js'
import * as spotbieGlobals from '../../globals'
import { Validators, FormGroup, FormBuilder } from '@angular/forms'
import { SanitizePipe } from '../../pipes/sanitize.pipe'
import { Subscription } from 'rxjs'
import { User } from 'src/app/models/user'
import { ProfileHeaderService } from 'src/app/services/profile-header/profile-header.service'

const PROFILE_HEADER_API = spotbieGlobals.API + 'api/settings.service.php'

const BACKGROUND_UPLOAD_API_URL = spotbieGlobals.API + 'api/background_image_upload.service.php'
const BACKGROUND_MAX_UPLOAD_SIZE = 1e+7

const DEFAULT_UPLOAD_API_URL = spotbieGlobals.API + 'api/default_image_upload.service.php'
const DEFAULT_MAX_UPLOAD_SIZE = 1e+7

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css']
})
export class ProfileHeaderComponent implements OnInit {

  @Input() public_profile_info

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

  public successful_default_change: boolean = false
  private profile_pictures_index: number = 0

  public m_swiper: Swiper
  public profile_images_loaded: boolean

  public exe_api_key: string

  public web_options_subscriber: Subscription

  public edit_description: boolean = false

  public profile_description_form: FormGroup
  public new_profile_description: string
  public description_submitted: boolean = false

  public upload_background: boolean = false
  public upload_default: boolean = false

  public questionsWindow = { open: false }
  public contactMeWindow = { open: false }

  public loading: boolean = false

  constructor(private http: HttpClient,
              private formBuilder: FormBuilder,
              private profile_header_service: ProfileHeaderService) {}

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

  private getMyProfileHeaderCallback(profile_header_response: any): void{

    const user = profile_header_response.user
    const spotbie_user = profile_header_response.spotbie_user
    const default_images = profile_header_response.default_images

    let current_index = 0

    this.user.profile_pictures = default_images.map(default_image => default_image.default_image_url)

    if(this.user.profile_pictures.length > 0){

      this.user.profile_pictures.forEach(profile_picture =>{
      
        current_index = this.user.profile_pictures.indexOf(profile_picture)
  
        if(this.user.profile_pictures[current_index] == spotbie_user.default_picture)
          this.profile_pictures_index = current_index
  
      }) 

    } else
      this.user.profile_pictures[current_index] = 'defaults/user.png'

    this.user.exe_user_default_picture = spotbie_user.default_picture

    this.user.exe_user_full_name = spotbie_user.first_name + " " + spotbie_user.last_name
    this.user.username = user.username

    this.profile_images_loaded = true
    this.user.exe_desc = unescape(spotbie_user.description)
    this.user.exe_animal = spotbie_user.animal
    this.user.ghost = spotbie_user.ghost_mode
    this.user.privacy = spotbie_user.privacy

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

    const exe_api_key = localStorage.getItem('spotbie_userApiKey')
    
    let file_to_upload
    let upload_size = 0

    formData.append('upload_action', 'uploadBackground')
    formData.append('exe_api_key', exe_api_key)

    for (let i = 0; i < file_list_length; i++) {

      file_to_upload = files[i] as File

      upload_size += file_to_upload.size

      if (upload_size > BACKGROUND_MAX_UPLOAD_SIZE) {
        this.background_media_message = 'Max upload size is 10MB.'
        return
      }

      formData.append('filesToUpload[]', file_to_upload, file_to_upload.name)

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

    if (httpResponse.status == '200') {
      console.log('Background Image File Path: ', httpResponse.responseObject[0].file_path)
      let background_image = httpResponse.responseObject[0].file_path
      background_image = background_image.split('../')[1]
      this.user.acc_splash = spotbieGlobals.RESOURCES + background_image
    } else
      console.log('Background Image Upload Error:', httpResponse)
    
    this.loading = true

  }

  public saveBackground(): void {

    this.loading = true

    const get_profile_header_object = {
      new_background_image: this.user.acc_splash 
    }

    this.http.post<any>(PROFILE_HEADER_API, get_profile_header_object)
    .subscribe( resp => {
      this.saveBackgroundCallback(resp)
    },
      error => {
        this.loading = true
        console.log('Save Background Image Error: ', error)
    })

  }

  public setDefault(): void {

    this.loading = true

    if (this.user.exe_user_default_picture == 'defaults/user.png') {
      this.loading = false
      return
    }

    const new_profile_image = this.user.profile_pictures[this.profile_pictures_index]

    this.profile_header_service.setDefault(new_profile_image).subscribe(
      resp => {
        this.setDefaultCallback(resp)
      },
      error => {
        console.log('setDefault', error)
      }
    )

  }

  public setDefaultCallback(resp: any) {

    this.successful_default_change = true

    setTimeout(function() {
      this.successful_default_change = false
    }.bind(this), 2500)
    
    if(resp.default_picture !== undefined){
      localStorage.setItem('spotbie_userDefaultImage', resp.default_picture)
    }
    
    this.loading = false

  }

  public startDefaultUploader() {
    this.spotDefaultInput.nativeElement.click()
  }
  
  public deleteProfilePicture() {

    this.loading = true

    const current_profile_image = this.user.profile_pictures[this.profile_pictures_index]

    if (current_profile_image == 'defaults/user.png') {
      this.loading = false
      return
    }

    this.profile_header_service.deleteDefault(current_profile_image).subscribe( 
      resp => {
        this.deleteDefaultCallback(resp)
      },
      error => {
        console.log('Delete Default Image Error: ', error)
      }
    )

  }

  public deleteDefaultCallback(httpResponse: any) {

    if (httpResponse.status == 'success') {

      this.user.profile_pictures.splice(this.profile_pictures_index, 1)

      this.user.exe_user_default_picture = spotbieGlobals.RESOURCES + httpResponse.new_profile_default

      if (this.user.exe_user_default_picture == 'defaults/user.png') {

        this.user.profile_pictures = []
        this.user.profile_pictures[0] = this.user.exe_user_default_picture
        this.m_swiper.slideTo(0)

      } else {

        const a = this.user.profile_pictures.indexOf(this.user.exe_user_default_picture)
        this.m_swiper.slideTo(a)

      }

      localStorage.setItem('spotbie_userDefaultImage', httpResponse.new_profile_default)

    } else
      console.log('Deleted Default Image Error: ', httpResponse)
    
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

    let file_to_upload
    let upload_size = 0

    formData.append('upload_action', 'uploadDefault')

    for (let i = 0; i < file_list_length; i++) {

      file_to_upload = files[i] as File

      upload_size += file_to_upload.size

      if (upload_size > DEFAULT_MAX_UPLOAD_SIZE) {
        this.default_media_message = 'Max upload size is 10MB.'
        return
      }

      formData.append('filesToUpload[]', file_to_upload, file_to_upload.name)

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

    if (httpResponse.message == 'success') {

      this.cancelDefault()

      this.user.exe_user_default_picture = spotbieGlobals.RESOURCES + httpResponse.default_picture
      localStorage.setItem('spotbie_userDefaultImage', this.user.exe_user_default_picture)

      this.user.profile_pictures.unshift(this.user.exe_user_default_picture)
      this.profile_pictures_index = 0
      this.m_swiper.slideTo(this.profile_pictures_index)

      if (this.user.profile_pictures[1].indexOf('defaults/user.png') > -1) this.user.profile_pictures.pop()

    } else
      console.log('defaultUploadFinished', httpResponse)

    this.loading = false

  }

  private saveBackgroundCallback(httpResponse: any): void {

    if (httpResponse.status == 'success') {

      localStorage.setItem('spotbie_backgroundImage', this.user.acc_splash)

      this.cancelBackground()

    } else
      console.log('saveBackgroundCallback', httpResponse)    
    
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

  ngOnInit(){
    
    this.user.exe_background_color = localStorage.getItem('spotbie_backgroundColor')

  }

  ngAfterViewInit(){

    if (this.public_profile_info !== undefined) {

      this.getMyProfileHeaderCallback(this.public_profile_info)
      this.public_profile = true
      
    } else {

      //Viewing our own profile.

      this.user.id = parseInt(localStorage.getItem('spotbie_userId'))
      this.user.acc_splash = this.current_user_bg

      this.getMyProfileHeader()

    }

  }
}
