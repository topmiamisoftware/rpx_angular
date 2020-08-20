import { Component, OnInit, ViewChild, Input } from '@angular/core'
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http'
import { HttpResponse } from '../../models/http-reponse'
import { Swiper } from 'swiper/dist/js/swiper.esm.js'
import * as spotbieGlobals from '../../globals'
import { Validators, FormGroup, FormBuilder } from '@angular/forms'
import { SanitizePipe } from '../../pipes/sanitize.pipe'
import { displayError } from '../../helpers/error-helper'
import { Subscription } from 'rxjs'
import { User } from 'src/app/models/user'
import { ColorsService } from 'src/app/services/background-color/colors.service'
import { ProfileHeaderService } from 'src/app/services/profile-header/profile-header.service'

const PROFILE_HEADER_API = spotbieGlobals.API + 'api/settings.service.php'

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

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
              private web_options_service: ColorsService,
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

  private getMyProfileHeaderCallback(profile_header_response: any) {

    if (profile_header_response.status == '200') {
      // populate the header
      // console.log("Profile Header: ", profileHeaderResponse.responseObject)

      const stream_by_info = JSON.parse(profile_header_response.responseObject.stream_by_info)

      const profile_pictures = JSON.parse(profile_header_response.responseObject.profile_pictures)

      //console.log("Stream By Info: ", stream_by_info)

      // console.log("Default Profile Image: ", profile_pictures.current)

      // console.log("All Default Profile Images: ", profile_pictures.all_defaults)

      let current_index = 0

      if (profile_pictures.current.exe_user_default_picture !== 'defaults/user.png') {

        this.user.profile_pictures = profile_pictures.all_defaults

        const current_default = profile_pictures.current.exe_user_default_picture.replace('defaults/' + this.user.exe_user_id + '/', '')

        // console.log("Current Default: ", current_default)

        for (let i = 0; i < this.user.profile_pictures.length; i++) {

          if (this.user.profile_pictures[i] == current_default) {
            current_index = i
            if (i == 0) { this.profile_pictures_index = i } else { this.profile_pictures_index = i - 1 }
          }

          this.user.profile_pictures[i] = spotbieGlobals.RESOURCES + 'defaults/' + this.user.exe_user_id +  '/' + this.user.profile_pictures[i]

        }

        this.user.exe_user_full_name = stream_by_info.exe_user_first_name + " " + stream_by_info.exe_user_last_name
        this.user.username = stream_by_info.username
        this.user.exe_user_default_picture = this.user.profile_pictures[current_index]

      } else {

        this.user.username = stream_by_info.username
        this.user.profile_pictures = profile_pictures.all_defaults
        this.user.exe_user_default_picture = profile_pictures.current.exe_user_default_picture
        current_index = 0

      }

      this.profile_images_loaded = true
      this.user.exe_desc = unescape(stream_by_info.exe_desc)
      this.user.exe_sign = stream_by_info.exe_sign
      this.user.exe_animal = stream_by_info.exe_animal
      this.user.ghost = stream_by_info.ghost
      this.user.privacy = stream_by_info.privacy

      const _this = this
      this.m_swiper = new Swiper('.spotbie-swiper', {
        slidesPerView: 1,
        initialSlide: current_index,
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
    } else
      console.log('Profile Header Error: ', profile_header_response)
  }

  private prevProfilePicIndex() {
    if (this.profile_pictures_index == 0) {
      return
    } else {
      this.profile_pictures_index--
      this.user.exe_user_default_picture = this.user.profile_pictures[this.profile_pictures_index]
    }
    // console.log("current profile picture index: ", this.profile_pictures_index)
  }

  public prevSlide() {
    if (this.profile_pictures_index == 0) return
    this.m_swiper.slidePrev()
  }

  private nextProfilePicIndex() {
    if (this.profile_pictures_index == (this.user.profile_pictures.length - 1)) {
      return
    } else {
      this.profile_pictures_index++
      this.user.exe_user_default_picture = this.user.profile_pictures[this.profile_pictures_index]
    }
    // console.log("current profile picture index: ", this.profile_pictures_index)
  }

  public nextSlide() {
    if (this.profile_pictures_index == (this.user.profile_pictures.length - 1)) return
    this.m_swiper.slideNext()
  }

  public startBackgroundUploader() {
    this.spotBackgroundInput.nativeElement.click()
  }

  public uploadBackground(files) {

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

      // console.log("file to upload: ", file_to_upload)
      // let exif = this.getExif(file_to_upload)
      // console.log("file to Upload EXIF: ", exif)
      formData.append('filesToUpload[]', file_to_upload, file_to_upload.name)
      // console.log("file to upload: ", file_to_upload)

    }

    // console.log("Total Upload Size: ", upload_size)
    //console.log('Files To Upload : ', formData.getAll('filesToUpload[]'))

    this.http.post(BACKGROUND_UPLOAD_API_URL, formData, {reportProgress: true, observe: 'events'}).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.background_media_progress = Math.round(100 * event.loaded / event.total)
      else if (event.type === HttpEventType.Response)
        this.backgroundUploadFinished(event.body)
    }

  )
    return
  }

  backgroundUploadFinished(httpResponse: any) {

    if (httpResponse.status == '200') {
      console.log('Background Image File Path: ', httpResponse.responseObject[0].file_path)
      let background_image = httpResponse.responseObject[0].file_path
      background_image = background_image.split('../')[1]
      this.user.acc_splash = spotbieGlobals.RESOURCES + background_image
    } else
      console.log('Background Image Upload Error:', httpResponse)
    
    this.loading = true

  }

  saveBackground() {

    this.loading = true

    const get_profile_header_object = { exe_api_key: this.exe_api_key, exe_settings_action: 'saveBackground', new_background_image: this.user.acc_splash }

    this.http.post<HttpResponse>(PROFILE_HEADER_API, get_profile_header_object, HTTP_OPTIONS)
    .subscribe( resp => {
      const httpResponse = new HttpResponse ({
        status: resp.status,
        message: resp.message,
        full_message: resp.full_message,
        responseObject: resp.responseObject
      })
      this.saveBackgroundCallback(httpResponse)
    },
      error => {
        this.loading = true
        console.log('Save Background Image Error: ', error)
        displayError(error)
    })
  }

  public setDefault() {

    this.loading = true

    const new_profile_image = this.user.profile_pictures[this.profile_pictures_index].replace('/', '')

    const upload_default_object = { exe_api_key: this.exe_api_key, upload_action: 'setDefault', default_set_path: new_profile_image }

    this.http.post<HttpResponse>(DEFAULT_UPLOAD_API_URL, upload_default_object, HTTP_OPTIONS)
    .subscribe( resp => {
      const httpResponse = new HttpResponse ({
        status: resp.status,
        message: resp.message,
        full_message: resp.full_message,
        responseObject: resp.responseObject
      })
      this.setDefaultCallback(httpResponse)
    },
      error => {
        this.loading = true
        console.log('Save Default Image Error: ', error)
    })
  }

  public setDefaultCallback(httpResponse: HttpResponse) {

    if (httpResponse.status == '200') {      
      this.successful_default_change = true
      const _this = this
      setTimeout(function() {
        _this.successful_default_change = false
      }, 2500)
      console.log('Image uploaded: ', httpResponse)
      localStorage.setItem('spotbie_userDefaultImage', httpResponse.responseObject.new_profile_default)
    } else
      console.log('Save Default Image Error: ', httpResponse)

    this.loading = false

  }

  public startDefaultUploader() {
    this.spotDefaultInput.nativeElement.click()
  }
  
  public deleteProfilePicture() {

    this.loading = true

    const a = this.user.exe_user_default_picture.replace(spotbieGlobals.RESOURCES, '')

    // console.log("trying to delete: ", a)

    if (a == 'defaults/user.png') {
      this.loading = false
      return
    }

    const upload_default_object = { exe_api_key: this.exe_api_key, upload_action: 'deleteCurrentDefault', current_profile_picture: a }

    this.http.post<HttpResponse>(DEFAULT_UPLOAD_API_URL, upload_default_object, HTTP_OPTIONS)
    .subscribe( resp => {
      const httpResponse = new HttpResponse ({
        status: resp.status,
        message: resp.message,
        full_message: resp.full_message,
        responseObject: resp.responseObject
      })
      this.deleteDefaultCallback(httpResponse)
    },
      error => {
        this.loading = true
        console.log('Delete Default Image Error: ', error)
    })

  }

  public deleteDefaultCallback(httpResponse: HttpResponse) {

    if (httpResponse.status == '200') {

      // console.log("Current Index: ", this.profile_pictures_index)

      this.user.profile_pictures.splice(this.profile_pictures_index, 1)

      this.user.exe_user_default_picture = spotbieGlobals.RESOURCES + httpResponse.responseObject.new_profile_default

      // console.log("Returned profile picture:  ", this.user.exe_user_default_picture)
      // console.log("All profile pictures:  ", this.user.profile_pictures)

      if (this.user.exe_user_default_picture == spotbieGlobals.RESOURCES + 'defaults/user.png') {
        this.user.profile_pictures = []
        this.user.profile_pictures[0] = this.user.exe_user_default_picture
        // console.log("profile pictures 2: ", this.user.profile_pictures[0])
        this.m_swiper.slideTo(0)
      } else {
        const a = this.user.profile_pictures.indexOf(this.user.exe_user_default_picture)
        // console.log("Sliding to:  ", a)
        this.m_swiper.slideTo(a)
      }

      localStorage.setItem('spotbie_userDefaultImage', httpResponse.responseObject.new_profile_default)

      // console.log("profile pictures 3: ", this.user.profile_pictures)
      // console.log("Image Deleted: ", httpResponse)

    } else
      console.log('Deleted Default Image Error: ', httpResponse)
    
    this.loading = false
    
  }

  public uploadDefault(files) {

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

    const exe_api_key = localStorage.getItem('spotbie_userApiKey')
    let file_to_upload
    let upload_size = 0

    formData.append('upload_action', 'uploadDefault')
    formData.append('exe_api_key', exe_api_key)

    for (let i = 0; i < file_list_length; i++) {

      file_to_upload = files[i] as File

      upload_size += file_to_upload.size

      if (upload_size > DEFAULT_MAX_UPLOAD_SIZE) {
        this.default_media_message = 'Max upload size is 10MB.'
        return
      }

      // console.log("file to upload: ", file_to_upload)
      // let exif = this.getExif(file_to_upload)
      // console.log("file to Upload EXIF: ", exif)
      formData.append('filesToUpload[]', file_to_upload, file_to_upload.name)
      // console.log("file to upload: ", file_to_upload)

    }

    // console.log("Total Upload Size: ", upload_size)
    // console.log("Files To Upload : ", formData.getAll('filesToUpload[]'))

    this.http.post(DEFAULT_UPLOAD_API_URL, formData, {reportProgress: true, observe: 'events'}).subscribe(event => {

      if (event.type === HttpEventType.UploadProgress)
        this.default_media_progress = Math.round(100 * event.loaded / event.total)
      else if (event.type === HttpEventType.Response)
        this.defaultUploadFinished(event.body)

    }

  )
    return
  }

  defaultUploadFinished(httpResponse: any) {

    if (httpResponse.status == '200') {
      // console.log("Default Image File Path: ", httpResponse.responseObject[0].file_path)
      // console.log("DEfault Iamges:", this.user.profile_pictures)
      this.cancelDefault()
      this.user.exe_user_default_picture = spotbieGlobals.RESOURCES + httpResponse.responseObject[0].file_path
      localStorage.setItem('spotbie_userDefaultImage', httpResponse.responseObject[0].file_path)
      this.user.profile_pictures.unshift(this.user.exe_user_default_picture)
      this.profile_pictures_index = 0
      this.m_swiper.slideTo(this.profile_pictures_index)

      if (this.user.profile_pictures[1].indexOf('defaults/user.png') > -1) this.user.profile_pictures.pop()

      //console.log('Default Image Array ', this.user.profile_pictures)

    } else
      console.log('Background Image Upload Error:', httpResponse)

    this.loading = false

  }

  private saveBackgroundCallback(httpResponse: HttpResponse): void {

    if (httpResponse.status == '200') {
      localStorage.setItem('spotbie_backgroundImage', this.user.acc_splash)
      this.cancelBackground()
    } else
      console.log('Save Background Error: ', httpResponse)    
    
    this.loading = false

  }
  
  get f() { return this.profile_description_form.controls }
  get spotbie_profile_description() {return this.profile_description_form.get('spotbie_profile_description').value }

  saveDescription() {

    if (this.description_submitted) return; else this.description_submitted = true

    if (this.profile_description_form.invalid) return

    this.loading = true

    const new_profile_description = this.spotbie_profile_description
    
    const get_profile_header_object = { exe_api_key: this.exe_api_key,
      exe_settings_action: 'saveProfileDescription',
      spotbie_profile_description: escape(new_profile_description) }

    this.http.post<HttpResponse>(PROFILE_HEADER_API, get_profile_header_object, HTTP_OPTIONS)
    .subscribe( resp => {
      const httpResponse = new HttpResponse ({
        status: resp.status,
        message: resp.message,
        full_message: resp.full_message,
        responseObject: resp.responseObject
      })
      this.saveDescriptionCallback(httpResponse)
    },
      error => {
        this.loading = true
        console.log('Profile Description Error: ', error)
        // alert(error.error.text)
    })

  }

  public saveDescriptionCallback( httpResponse: HttpResponse): void{
    this.loading = false
    if (httpResponse.status == '200') {
      this.description_submitted = false
      this.user.exe_desc = unescape(httpResponse.responseObject.new_profile_description)
      this.cancelDescription()
    } else {
      this.spotbie_description_info.nativeElement.innerHTML = 'There was an error with your request. Try again.'
      console.log('Description Error: ', httpResponse)
    }
  }

  public editDescription(): void {

    //console.log("bg color: ", this.user.exe_background_color);

    this.loading = true

    this.edit_description = true
    
    let profile_description = new SanitizePipe()
    let piped_description = profile_description.transform(this.user.exe_desc)

    this.profile_description_form.get('spotbie_profile_description').setValue(piped_description)

    this.loading = false

  }

  cancelDescription() {
    this.edit_description = false
  }

  newBackground() {
    this.upload_background = true
  }

  cancelBackground() {
    this.upload_background = false
  }

  cancelDefault() {
    this.upload_default = false
  }

  changeProfilePicture() {
    this.upload_default = true
  }

  openWindow(window) {
    window.open = true
  }

  ngOnInit(): void{
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
  }

  ngAfterViewInit(): void {

    if (this.public_profile_info !== undefined) {

      //Viewing another user's profile.

      this.public_profile = true
      this.user.exe_user_id = this.public_profile_info.public_exe_user_id
      this.user.username = this.public_profile_info.public_username
      this.user.acc_splash = this.public_profile_info.public_spotmee_bg
      this.user.exe_background_color = this.public_profile_info.public_bg_color

      

    } else {

      //Viewing our own profile.

      this.user.exe_user_id = parseInt(localStorage.getItem('spotbie_userId'))
      this.user.acc_splash = this.current_user_bg

      this.getMyProfileHeader()

    }

    this.user.exe_background_color = localStorage.getItem('spotbie_backgroundColor')

    this.web_options_subscriber = this.web_options_service.getWebOptions().subscribe(web_options =>{

      if(web_options){
        this.user.exe_background_color = web_options.bg_color
      }

    })

  }
}
