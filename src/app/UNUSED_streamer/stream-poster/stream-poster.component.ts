import { Component, OnInit, ViewChild, EventEmitter, Output, ɵConsole, HostListener, Input } from '@angular/core'
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http'
import * as spotbieGlobals from '../../globals'
import { StreamerService } from '../streamer-services/streamer.service'
import { DomSanitizer } from '@angular/platform-browser'
import * as mobile_js_i from '../../../assets/scripts/mobile_interface.js'
import { videoEmbedCheck } from '../../helpers/video-check'
import { StreamPost } from '../streamer-models/stream-post'
import { Validators, FormBuilder, FormGroup } from '@angular/forms'
import { ToastRequest } from 'src/app/helpers/toast-helper/toast-models/toast-request'

const EXTRA_MEDIA_UPLOAD_API_URL = spotbieGlobals.API + 'api/extra_media_upload.service.php'

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

const MAX_UPLOAD_SIZE = 5e+8

const file_permissions_android = new Promise<string>((resolve, reject) => {})

@Component({
  selector: 'app-stream-poster',
  templateUrl: './stream-poster.component.html',
  styleUrls: ['./stream-poster.component.css']
})
export class StreamPosterComponent implements OnInit {

  @Input() stream_post: StreamPost

  @Input() input_flag: string

  @Output() closeWindow: EventEmitter<any> = new EventEmitter()

  @ViewChild('') spotbieExtraMediaHolderForPost
  @ViewChild('extraMediaInput') extraMediaInput
  @ViewChild('extraMediaFileInfoMessage') extraMediaFileInfoMessage

  @ViewChild('spotbieStreamPostText') spotbieStreamPostText

  @Output() public onUploadFinished = new EventEmitter()

  @Output() streamPosted = new EventEmitter()

  private exe_api_key: string

  public extra_media_progress: number
  public extra_media_message: string
  
  public emoji_picker_open = false

  public extra_media_array = []

  public upload_complete: boolean = false

  public embed_content: boolean = false

  public friend_tags = 0

  public content_tags = 0

  public current_embed_video

  public loading = false

  public isAndroid: boolean

  public isIphone: boolean

  public check_stream_text_timeout: any

  public post_text_form: FormGroup

  public post_submitted: boolean
  
  public to_remove_on_edit: Array<any> = []

  private saving_post: boolean

  public toast_helper_config: ToastRequest = {
    type: "acknowledge",
    text: {
      info_text: "Your post was updated."
    },
    actions: {
      acknowledge: this.closeToastHelper
    }
  }

  public toast_helper: boolean = false

  constructor(private http: HttpClient,
              private _streamerService: StreamerService,
              private _sanitizer: DomSanitizer,
              private form_builder: FormBuilder) { }
  /**
   * @description: Used to delete all uploaded media which is not saved
   * after user uploaded it.
   */
  @HostListener('window:beforeunload')
  private _deleteAllUnused(): void {

    const exe_api_key = localStorage.getItem('spotbie_userApiKey')

    const media_object = { 
      exe_api_key,
      upload_action: 'deleteAllUnused',
    }    

    this.http.post<any>(EXTRA_MEDIA_UPLOAD_API_URL, media_object).subscribe( 
      resp => {
        console.log('_deleteAllUnused', resp)
      },
      error => {
        console.log('_deleteAllUnused', error)
      }
    )

  }
  
  public closeToastHelper(){
    this.toast_helper = false
  }

  public addEmoji(evt){

    let new_post_txt = this.spotbie_post_text + evt.emoji.native
    this.post_text_form.get('spotbie_post_text').setValue(new_post_txt)
  
  }

  public openEmojiAdd(){
    this.emoji_picker_open = !this.emoji_picker_open
  }

  public closeWindowX(){
    this.closeWindow.emit()
  }

  public checkFriendTags(txt: string){}

  public async checkStreamText(e: any){

    clearTimeout(this.check_stream_text_timeout)

    // will check for tagged users and for embedded links
    const text = e.target.value

    this.check_stream_text_timeout = setTimeout(async function(){

      let youtube_obj: any = await videoEmbedCheck(text, this._sanitizer)

      if(youtube_obj.video_url == this.current_video_url) return

      //console.log("Youtube Embed", youtube_obj)
      
      if(youtube_obj !== 'no_video'){
        this.embed_content = true
        this.current_video_url =  youtube_obj.video_url
        this.current_embed_video = youtube_obj.url_embed
      } else {
        this.embed_content = false
        this.current_video_url = null
        this.current_embed_video = null             
      }
      
    }.bind(this, text), 700)

    this.checkFriendTags(text)

  }

  public async saveEdit() {
    
    this.loading = true

    if(this.to_remove_on_edit.length > 0){
      
      this.removeExtraMediaBeforeUploadEdit().then(
        
        resolved =>{
          this.saveEditPost()
        },
        rejected =>{
          this.toast_helper_config.text.info_text = "Your post couldn't be updated. Please try again."
          this.toast_helper = true
        }

      )

    } else 
      this.saveEditPost()

  }

  public saveEditPost(): void{

    if (this.post_text_form.invalid) return
  
    this.loading = true

    let new_post_text

    if(this.spotbie_post_text.length > 0)
      new_post_text = escape(this.spotbie_post_text)
    else
      new_post_text = ''
    
    this.stream_post.stream_content = new_post_text

    const post_id = this.stream_post.stream_post_id

    const stream_obj = { 
      stream_post_description: new_post_text,
      stream_post_id: post_id
    }

    this._streamerService.saveEdit(stream_obj).subscribe(
      resp => {
        this.editSaveCallback(resp)
      },
      error => {
        console.log("saveEditPost", error)
      }
    )

  }

  public editSaveCallback(save_stream_response: any): void{

    if (save_stream_response.message == 'updated') {

      this.toast_helper_config.text.info_text = "Your post was updated."
      this.toast_helper = true
      this.streamPosted.emit(this.stream_post)

    } else {

      this.toast_helper_config.text.info_text = "Error saving post."
      this.toast_helper = true
    
    }

    this.saving_post = false

    this.loading = false

    setTimeout(function() {     
      this.closeWindowX()
    }.bind(this), 2500)   

  }

  public postToStream(): void {

    if (this.post_text_form.invalid) return

    this.loading = true
    this.saving_post = true

    const encoded_text = escape(this.spotbie_post_text)

    const stream_obj = {
      exe_stream_post_text: encoded_text,
      exe_extra_media_array: this.extra_media_array
    }

    this._streamerService.uploadStream(stream_obj).subscribe(
      resp =>{
        this.streamUploadCallback(resp)
      }, 
      error =>{
        console.log("postToStream", error)
      }
    )

  }
  
  public streamUploadCallback(stream_response: any): void {

    if (stream_response.message == 'posted') {

      this.extra_media_progress = 0
      this.extra_media_message = null
      this.extra_media_array = []
      this.upload_complete = false
      this.embed_content = false
      this.friend_tags = 0
      this.content_tags = 0
      this.current_embed_video = null
      this.post_text_form.get('spotbie_post_text').setValue('')
      this.streamPosted.emit()

    } else 
      console.log('streamUploadCallback', stream_response)

    this.loading = false

  }

  public startExtraMediaUploader(): void {

    /*if(this.isAndroid){
      mobile_js_i.callFilePermissionsAndroid()
    } */

    this.extraMediaInput.nativeElement.click()

  }

  public attachExtraMedia(files) {

    const file_list_length = files.length
    
    const local_media_array = this.extra_media_array.length

    if (file_list_length === 0) {
      this.extra_media_message = 'You must upload at least one file.'
      return
    } else if (file_list_length > 10 || local_media_array > 10) {
      this.extra_media_message = 'You can only upload 10 files at a time.'
      return
    }

    const formData = new FormData()

    const exe_api_key = localStorage.getItem('spotbie_userApiKey')
    
    let file_to_upload
    let upload_size = 0

    formData.append('upload_action', 'uploadExtraMedia')
    formData.append('exe_api_key', exe_api_key)

    for (let i = 0; i < file_list_length; i++) {

      file_to_upload = files[i] as File

      upload_size += file_to_upload.size

      if (upload_size > MAX_UPLOAD_SIZE) {
        this.extra_media_message = 'Max upload size is 100MB.'
        return
      }

      formData.append('filesToUpload[]', file_to_upload, file_to_upload.name)

    }

    this.http.post(EXTRA_MEDIA_UPLOAD_API_URL, formData, {reportProgress: true, observe: 'events'}).subscribe(event => { 

      if (event.type === HttpEventType.UploadProgress) {

        this.extra_media_progress = Math.round(100 * event.loaded / event.total)

        if(this.extra_media_progress == 100){
          this.extra_media_progress = 0
          this.extra_media_message = 'Processing...'
        }

      } else if (event.type === HttpEventType.Response) 
        this.uploadFinished(event.body)        

    }, error => {
      console.log(error)
    })

    return

  }

  getExif() {
    /*
    EXIF.getData(this, function() {

      myData = this

      console.log(myData.exifdata)

    })
    */
  }

  uploadFinished(httpResponse: any) {

    console.log('Upload Response: ', httpResponse)
    
    Array.prototype.push.apply(this.extra_media_array, httpResponse.responseObject)
    
    if(this.input_flag == "edit"){
      this.stream_post.extra_media_obj = this.extra_media_array
      this.stream_post.extra_media = this.extra_media_array.length
    }

    this.upload_complete = true
    this.extra_media_progress = 0
    this.extra_media_message = 'Ready for posting!'
    //console.log('the uplaod finished: ', this.extra_media_array)

  }

  public addToRemoveExtraMediaBeforeUploadEdit(file){

    //we need to remove the image but still keep it until user hits save
    const element_to_pop = this.extra_media_array.indexOf(file)
    this.extra_media_array.splice(element_to_pop, 1)  
    this.to_remove_on_edit.push(element_to_pop)

  }

  private async removeExtraMediaBeforeUploadEdit() {

    if (this.saving_post == true) return true
    
    this.saving_post = true

    const remove_media_object = {
      media_to_remove:  this.to_remove_on_edit
    }

    let promise = new Promise<void>((resolve, reject) =>{

      this.http.post<any>(EXTRA_MEDIA_UPLOAD_API_URL, remove_media_object).subscribe(
        resp => {
          resolve()
        },
        error => {
            console.log('error', error)
            reject()
        }
      )

    })

    return promise

  }

  public removeExtraMediaBeforeUpload(file, event): void {

    const path_to_remove = file.file_path
    const api_key = this.exe_api_key

    const remove_media_object = {
      upload_action: 'removeExtraMediaBeforeUpload',
      path_to_remove 
    }

    this.http.post<any>(EXTRA_MEDIA_UPLOAD_API_URL, remove_media_object).subscribe(
      resp => {
        this.removeExtraMediaBeforeUploadFinished(file, resp, event)
      },
      error => {
        console.log('error', error)
      }
    )

  }

  private removeExtraMediaBeforeUploadFinished(file, response: any, event): void {

    if (response.message == 'removed') {

      const element_to_pop = this.extra_media_array.indexOf(file)
      this.extra_media_array.splice(element_to_pop, 1)

      const elementToRemove = event.srcElement.parentNode
      elementToRemove.parentNode.removeChild(elementToRemove)

    } else
      this.extraMediaFileInfoMessage.nativeElement.innerHTML = response.message

  }

  get f() { return this.post_text_form.controls }
  get spotbie_post_text() {return this.post_text_form.get('spotbie_post_text').value }

  ngOnInit() {

    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')

    this.isAndroid = mobile_js_i.android_i
    this.isIphone = mobile_js_i.iphone_i  
    
    const stream_post_validators = [Validators.maxLength(5000)]
    
    this.post_text_form = this.form_builder.group({
      spotbie_post_text: ['', stream_post_validators],
    })
    
  }

  ngAfterViewInit(){

    switch(this.input_flag){
      case "post":
        break
      case "edit":
        this.post_text_form.get('spotbie_post_text').setValue(this.stream_post.stream_content)
        Array.prototype.push.apply(this.extra_media_array, this.stream_post.extra_media_obj)
        this.upload_complete = true
        break     
    }

  }

}
