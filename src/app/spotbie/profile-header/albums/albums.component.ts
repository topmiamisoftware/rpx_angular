import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core'
import { Location } from '@angular/common';
import { Validators, FormBuilder, FormGroup } from '@angular/forms'
import { AlbumService } from './album-services/album.service';
import { Album } from './album-models/album';
import { AlbumMedia } from './album-models/album-media';
import { AlbumMediaUploadResponse } from './album-models/album-media-upload-response';
import { HttpResponse } from '../../../models/http-reponse';
import { ToastRequest } from 'src/app/helpers/toast-helper/toast-models/toast-request';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {

  @Input() public_profile_info

  @Input() album_id: number
  @Input() album_media_id: number

  @ViewChild('albumMediaInput') albumMediaInput
  @ViewChild('albumMediaFileInfoMessage') albumMediaFileInfoMessage

  public spotbie_user_id: number

  public bg_color: string
  public public_profile: boolean
  public profile_username: string
  public exe_api_key: string

  public is_logged_in: string

  public logged_in_user_id: string

  public album_maker: boolean  = false

  public upload_complete: boolean = false

  public album_privacy_help: boolean = false

  public show_album_maker_form: boolean = false

  public album_privacy_state: string = 'OFF'

  public privacy_help: string = 'By making your album private, you will only allow friends to see it.'

  public loading: boolean = true

  public album_form: FormGroup

  public submitted: boolean = false

  public album_media_progress: number
  
  public album_media_message: string

  public album_media_array: Array<AlbumMedia> = []

  public current_album: Album

  public album_media_uploaded_msg: string

  public all_albums_array: Array<Album> = []

  public new_album_media_array = []

  public album_page: number = 0

  public albums_load_more: boolean = false

  public album_slider: boolean = false

  public media_ite: number = 0

  public pull_more_album_items: boolean = false

  public edit_media: boolean = false
  public share_media: boolean = false
  public share_album: boolean = false
  public view_media: boolean = false
  public media_likes: boolean  = false

  public media_item_like_ite: number = 0

  public current_album_media: AlbumMedia

  public no_album_object: boolean = false

  public show_album_description: boolean = false

  public spotbie_alert_box: boolean = false

  public toast_helper: boolean = false

  public album_name: string

  public album_description: string

  public show_upload_progress: boolean = false

  public toast_helper_config: ToastRequest = {
      type: "confirm",
      text: {
        info_text: "Are you sure you want to delete this comment?",
        confirm: "Yes",
        decline: "No",
      },
      actions: {}
  }

  public upload_progress: number = 0

  public loading_more: boolean = false

  constructor(private _formBuilder: FormBuilder,
              private _album_service: AlbumService,
              private _platformStrategy: Location) { }

  /**
   * @description: Used to delete all uploaded media which is not saved
   * after user uploaded it.
   */
  @HostListener('window:beforeunload')
  private _deleteAllUnused(): void {
    const settings_object = { exe_api_key: this.exe_api_key,
      upload_action: 'deleteAllUnused',
      current_album: this.current_album 
    }    
    this._album_service.deleteAllUnused(settings_object)
  }

  public albumScroll(evt: any){

    if((window.innerHeight - evt.srcElement.scrollTop) <= (evt.srcElement.getElementsByClassName('stream-poster-album-media-wrapper')[0].offsetHeight - 2000)){
      if(this.pull_more_album_items){
        this.loadMoreAlbumItems()
      }
    }

  }
  
  /**
   * @description: Used to awake app-edit-media to bring forth the
   * single media editor in the UI.
   */
  public editAlbumMedia(album_media: AlbumMedia, event: Event): void{
    event.stopPropagation()
    this.current_album_media = album_media
    this.edit_media = true
  }

  /**
   * @description: Used to view which users have liked an album item.
   * Only users who own the item can use this function.
   */
  public pullAlbumMediaLikes(album_media: AlbumMedia, event: Event): void{
    event.stopPropagation()
    this.current_album_media = album_media
    this.media_likes = true
  }

  /**
   * @description: Used to awake app-share-albm to bring forth the
   * single media Album Sharer in the UI.
   */
  public shareAlbumMedia(album_media: AlbumMedia, event: Event): void{
    if(event !== null) event.stopPropagation()
    this.current_album_media = album_media
    this.share_media = true
  }

  /**
   * @description: Used to send or remove a like on 
   * an album media item.
   */
  public likeAlbumMedia(album_media: AlbumMedia, event: Event): void {
    event.stopPropagation()

    this.current_album_media = album_media

    if(this.is_logged_in == '0'){
      //return if user is not logged in
      this.toast_helper_config.text.info_text = "Must be logged in to like something."
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper = true      
      return
    } else if(this.logged_in_user_id == this.current_album_media.album_by){
      //return if user is trying to like their own album item.
      this.toast_helper_config.text.info_text = "Cannot like your own content."
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper = true      
      return
    }
    
    const album_media_like_object = {
      upload_action: "likeAlbumMedia",
      exe_api_key: this.exe_api_key,
      current_album: this.current_album_media.album_id,
      current_media_id: this.current_album_media.album_media_id
    }
    this._album_service.likeAlbumMedia(album_media_like_object, this.likeAlbumMediaCallback.bind(this))
  }

  /**
   * @description: Used to update UI after user likes a media item.
   */
  private likeAlbumMediaCallback(album_media_like_response: HttpResponse){
    if (album_media_like_response.status == '200') {
      //console.log("Album Settings Response ", settings_response)
      const like_response = album_media_like_response.responseObject
      if(like_response == '1'){
        //like was added
        this.current_album_media.total_likes++
      } else if(like_response == '0'){
        //like was removed
        this.current_album_media.total_likes--
      }
    } else
      console.log('error', album_media_like_response)
  }

  /**
   * @description: Used to bring forth the app-album-share
   * UI which will allow users to share an album.
   */
  public shareAlbum(): void{
    this.share_album = true
  }

  /**
   * @description: Used to bring forth the app-view-media
   * UI which will allow users to view media in full screen.
   */
  public openMedia(album_media: AlbumMedia): void{
    this.current_album_media = album_media
    this.view_media = true
  }

  /**
   * @description: Used to toggle the Album Maker which
   * is also part of the Albums component and only available
   * to users through their own profiles.
   */
  public toggleAlbumMakerForm(): void {
    this.show_album_maker_form = !this.show_album_maker_form
    if(this.album_media_array.length == 0 && this.show_album_maker_form == false){
      this.closeWindow()
    }
  }

  /**
   * @description: Will start the album media uploader.
   * Used to proxy the click event in the UI.
   */
  public startAlbumMediaUploader(): void{
    this.albumMediaInput.nativeElement.click()
  }

  /**
   * @description: Will attach album media for upload.
   */
  public async attachAlbumMedia(files: FileList){

    this.loading = true

    const file_list_length = files.length

    if (file_list_length === 0) {
      this.album_media_message = 'You must upload at least one file.'
      this.loading = false
      return
    } else if (file_list_length > 100) {
      this.album_media_message = 'You can only upload 100 files at a time.'
      this.loading = false
      return
    }

    let album_media_upload_response: AlbumMediaUploadResponse =  new AlbumMediaUploadResponse()
    
    this.show_upload_progress = true
    this._album_service.album_media_progress.subscribe(progress =>{
      this.upload_progress = progress
    })

    album_media_upload_response = await this._album_service.attachAlbumMedia(files, this.exe_api_key, this.current_album, this.uploadFinished.bind(this))

    if(album_media_upload_response.album_media_message !== 'success'){
      this.album_media_message = album_media_upload_response.album_media_message
      this.loading = false
    }

  }

  private uploadFinished(httpResponse: any): void{

    // console.log("Upload Response: ", httpResponse)

    if (httpResponse.status == '200') {

      if(httpResponse.responseObject == '2xz'){
        this.album_media_uploaded_msg = 'You are already uploading files to your albums...'
        this.upload_complete = true
        this.albumMediaFileInfoMessage.nativeElement.scrollIntoView()
        this.show_upload_progress = false
        this.loading = false        
        return;
      }

      let new_album_media_array = httpResponse.responseObject
      
      new_album_media_array.forEach(media => {
        if(media.file_type == 'video'){
          let poster = media.file_path.split('.mp4')
          media.poster = poster[0] + ".jpeg"
        }
      })

      this.album_media_uploaded_msg = 'Your media has been uploaded. Don\'t forget to save this album.'
      Array.prototype.unshift.apply(this.album_media_array, new_album_media_array)
      Array.prototype.unshift.apply(this.new_album_media_array, httpResponse.responseObject)
      this.upload_complete = true
      this.albumMediaFileInfoMessage.nativeElement.scrollIntoView()
      
      //console.log("the uplaod finished: ", this.album_media_array)

    } else {
      console.log('Upload File Error: ', httpResponse)
      this.album_media_uploaded_msg = 'There was an error uploading your files. Refresh the component and try again.'
    }
    
    this.show_upload_progress = false
    this.loading = false

  }

  public removeAlbumItem(file, event: Event): void {

    event.stopPropagation()

    this.loading = true
    const path_to_remove = file.file_path

    const remove_media_object = { exe_api_key: this.exe_api_key,
      upload_action: 'removeAlbumItem',
      current_album: this.current_album.id,
      path_to_remove,
      file_id: file.album_media_id
    }

    this._album_service.removeAlbumMedia(remove_media_object, file, this.removeAlbumMediaFinished.bind(this), event)

  }

  removeAlbumMediaFinished(file, httpResponse, event): void{

    if (httpResponse.status == '200') {

      const element_to_pop = this.album_media_array.indexOf(file)
      this.album_media_array.splice(element_to_pop, 1)

      const element_to_pop2 = this.new_album_media_array.indexOf(file)
      this.new_album_media_array.splice(element_to_pop2, 1)

      const elementToRemove = event.srcElement.parentNode
      elementToRemove.parentNode.removeChild(elementToRemove)

    } else{
      this.toast_helper_config.text.info_text = httpResponse.full_message
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper = true
    }

    this.loading = false

  }

  public removeAlbumMediaBeforeUpload(file, event: Event): void{

    event.stopPropagation()
    this.loading = true

    const path_to_remove = file.file_path

    const remove_media_object = { exe_api_key: this.exe_api_key,
      upload_action: 'removeAlbumMediaBeforeUpload',
      current_album: this.current_album,
      path_to_remove 
    }

    this._album_service.removeAlbumMediaBeforeUpload(file, event, remove_media_object, this.removeAlbumMediaBeforeUploadCallback.bind(this))
  
  }
  
  private removeAlbumMediaBeforeUploadCallback(file, httpResponse: HttpResponse, event): void{

    if (httpResponse.status == '200') {

      const element_to_pop = this.album_media_array.indexOf(file)
      this.album_media_array.splice(element_to_pop, 1)

      const element_to_pop2 = this.new_album_media_array.indexOf(file)
      this.new_album_media_array.splice(element_to_pop2, 1)

      const elementToRemove = event.srcElement.parentNode
      elementToRemove.parentNode.removeChild(elementToRemove)

      console.log('the upload array ', this.album_media_array)

    } else
      this.albumMediaFileInfoMessage.nativeElement.innerHTML = httpResponse.full_message
    
    this.loading = false
    
  }

  public createAlbum(): void {
    this.current_album = new Album()
    this.current_album.is_new = true
    this.album_maker = true
    this.toggleAlbumMakerForm()
    this.initAlbumsForm()
  }

  public saveAlbum(): void{

    this.loading = true
    this.submitted = true

    if (this.album_form.invalid) {
      this.loading = false
      this.albumMediaFileInfoMessage.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    const album_info = {
      album_description: unescape(this.spotbie_album_description),
      album_name: unescape(this.spotbie_album_name),
      album_privacy: this.spotbie_album_privacy,
      album_items: this.new_album_media_array,
    }

    const exe_album_object =  album_info
    //console.log("Current Album: ", this.current_album)
    const settings_object = { exe_api_key: this.exe_api_key,
                            upload_action: 'saveAlbum',
                            current_album: this.current_album,
                            exe_album_object
                          }
    this._album_service.saveAlbum(settings_object, this.saveAlbumCallback.bind(this))
  }

  public saveAlbumCallback(albums_response: HttpResponse) {
    if (albums_response.status == '200') {
      const album_response_object = albums_response.responseObject
      if (album_response_object.status == 'saved') {
        // our album was saved
        this.album_media_uploaded_msg = 'Your album has saved successfully.'
        this.albumMediaFileInfoMessage.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // console.log('Your new Album ID: ', album_response_object.album_id)
        this.album_page = 0
        this.myAlbums()
        setTimeout(function() {this.closeWindow() }.bind(this), 500)
      }
    } else {
      console.log('Save Album Error: ', albums_response)
    }
  }

  public toggleAlbumPrivacy(): void{

    let spotbie_privacy: number

    if (this.spotbie_album_privacy == 1) {
      this.album_privacy_state = 'OFF'
      spotbie_privacy = 0
    } else {
      this.album_privacy_state = 'ON'
      spotbie_privacy = 1
    }
    this.album_form.get('spotbie_album_privacy').setValue(spotbie_privacy)

  }

  public toggleHelp(): void {
    this.album_privacy_help = true
  }

  public getLight(light_name: any){
    if (light_name == 1) { return {'background-color': 'green'} } else { return {'background-color': 'red'} }
  }

  public closeWindow(): void {
    
    if (this.current_album.is_new !== true) {
      this.album_media_array = []
      this.new_album_media_array = []
    }

    if(this.public_profile === true)
      this._platformStrategy.replaceState('/user-profile/' + this.profile_username + '/')

    this.show_album_maker_form = false
    this.current_album.is_new = true
    this.media_ite = 0
    this.album_maker = false
    this.album_slider = false
    this.toast_helper = false

  }

  private initAlbumsForm(): void {
    
    // will set validators for form and take care of animations
    const album_name_validators = [Validators.required, Validators.maxLength(35)]
    const album_description_validators = [Validators.required, Validators.maxLength(350)]
    const album_privacy_validators = [Validators.required]

    this.album_form = this._formBuilder.group({
      spotbie_album_name: ['', album_name_validators],
      spotbie_album_description: ['', album_description_validators],
      spotbie_album_privacy: ['', album_privacy_validators]
    })

    if (this.current_album.is_new === true) {
      this.album_form.get('spotbie_album_privacy').setValue(0)
      return
    } else {
      this.album_form.get('spotbie_album_privacy').setValue(this.current_album.privacy)
      this.album_form.get('spotbie_album_name').setValue(this.current_album.name)
      this.album_form.get('spotbie_album_description').setValue(this.current_album.description)      
    }

  }

  public loadMoreAlbumItems(): void {
    if(this.loading_more !== false) return
    this.loading_more = true
    this.pullSingleAlbum(this.current_album, true)
  }

  public async openAlbum(album: Album) {
    this.pullSingleAlbum(album)
    this._album_service.getAlbumSettings(album.id, this.exe_api_key, this.getAlbumSettingsCallback.bind(this))
    if (this.public_profile === true)
      this._platformStrategy.replaceState('/user-profile/' + this.profile_username + '/albums/' + this.album_id)
  }

  /**
   * @description: Used to populate album properties after getAlbumSettings is called
   * from AlbumService
   */
  public getAlbumSettingsCallback(settings_response: HttpResponse) {

    if (settings_response.status == '200') {
      
      //console.log("Album Settings Response ", settings_response)
      
      const album_settings = settings_response.responseObject

      if(album_settings === null){
        this.view_media = false
        this.toast_helper_config.text.info_text = "Album does not exist."
        this.toast_helper_config.type = "acknowledge"
        this.toast_helper = true        
        return
      } else if(album_settings == 'prviate_content'){
        return
      }

      this.current_album.description = unescape(album_settings.exe_album_description)
      this.current_album.name = unescape(album_settings.exe_album_name)
      this.current_album.privacy = album_settings.album_privacy

      if(this.no_album_object){
        this.current_album = settings_response.responseObject
        this.current_album.is_new = false
      }

      if(this.current_album.cover !== undefined && this.current_album.cover.indexOf('.mp4') > 0){
        let poster = this.current_album.cover.split('.mp4')
        this.current_album.cover = poster[0] + ".jpeg"
      }

      if (this.public_profile === false) this.initAlbumsForm()

    } else
      console.log('error', settings_response)

  }

  /**
   * @description: Function will pull a single album from the database.
   * @param album 
   * @param load_more 
   */
  private pullSingleAlbum(album: Album, load_more = false): void {
    
    if(this.media_ite == 0) this.loading = true

    if (load_more == false) {
      this.current_album = album
      this.media_ite = 0
      this.album_media_array = []
      this.new_album_media_array = []
    }

    let user_id
    let album_id_to_pull = album.id

    if (this.public_profile === true){
      user_id = this.spotbie_user_id
      this.album_id = album_id_to_pull
    } else
      user_id = 'null'

    const albums_object = { exe_api_key: this.exe_api_key,
      upload_action: 'pullSingleAlbum',
      current_album: album_id_to_pull,
      media_ite: this.media_ite
    }
    
    //console.log("Album Request Object: ", albums_object)
    this._album_service.pullSingleAlbum(albums_object, this.pullSingleAlbumCallback.bind(this))

  }
  /**
   * @description: Used to populate album component after pullSingleAlbum function returns a response.
   * @param album_response 
   */
  public pullSingleAlbumCallback(album_response: HttpResponse) {

    if (album_response.status == '200') {

      if(album_response.responseObject == 'error'){
        this.loading = false
        this.toast_helper_config.text.info_text = "Album does not exist."
        this.toast_helper_config.type = "acknowledge"
        this.toast_helper = true                
        return
      } else if(album_response.responseObject == 'private_content'){
        this.loading = false
        this.toast_helper_config.text.info_text = "This album is private."
        this.toast_helper_config.type = "acknowledge"
        this.toast_helper = true  
        return
      }

      album_response.responseObject.forEach(album_media => {
        
        //console.log("album media: ", album_media)
        album_media.file_type = album_media.album_media_type
        album_media.file_path = album_media.album_media_content

        if(album_media.file_type == 'video'){
          let poster = album_media.file_path.split('.mp4')
          album_media.poster = poster[0] + ".jpeg"
        }

        album_media.album_item_caption = unescape(album_media.album_item_caption)

        album_media.album_username = this.profile_username

        let album_media_item = new AlbumMedia(album_media, this._album_service)
        this.album_media_array.push(album_media_item)

      })

      //console.log('Album Response: ', this.album_media_array)
      
      if (this.public_profile === false) {
        this.album_maker = true
        this.upload_complete = true
      } else {
        this.album_slider = true
      }

      if (album_response.responseObject.length > 10) {
        this.album_media_array.pop()
        this.media_ite = this.media_ite + 10
        this.pull_more_album_items = true
      } else
        this.pull_more_album_items = false

    } else
      console.log('error', album_response)

    this.loading = false
    this.loading_more = false

  }

  public myAlbums(): void{

    let user_id

    this.all_albums_array = []

    if (this.public_profile === true)
      user_id = this.spotbie_user_id
    else
      user_id = 'null'
    
    const albums_object = { page: this.album_page }

    this._album_service.myAlbums(albums_object).subscribe(
      resp => {
        this.myAlbumsCallback(resp)
      },
      error =>{
        console.log("myAlbums", error)
      } 
    )

    this.loading = false
    
  }

  private myAlbumsCallback(albums_response: any): void {

    let current_page = albums_response.album_list.current_page
    let last_page = albums_response.album_list.last_page

    Array.prototype.push.apply(this.all_albums_array, albums_response.album_list.data)

    this.all_albums_array.forEach(album => {

      album.name = unescape(album.name)
      album.description = unescape(album.description)

      album.likes_count = album.likes_count.toString()
      
      album.comments_count = album.comments_count.toString()

      album.is_new = false

      if(album.cover.indexOf('mp4') > 0){
        let poster = album.cover.split('.mp4')
        album.cover = poster[0] + ".jpeg"
      }

      if(album.likes_count.length > 2){
        album.likes_count = "99+"
      }

      if(album.comments_count.length > 2){
        album.comments_count = "99+"
      }
    
    })      

    this.album_page = this.album_page + 1

    if (current_page < last_page) {
      this.albums_load_more = true
    }

  }

  public setAlbumCover(file, event: Event): void{
    event.stopPropagation()

    const albums_object = {
      exe_api_key: this.exe_api_key,
      upload_action: 'setAlbumCover',
      current_album: this.current_album.id,
      file_path: file.file_path,
      file_id: file.album_media_id,
    }

    this._album_service.setAlbumCover(albums_object, this.setAsAlbumCoverCallback.bind(this))
  
  }

  private setAsAlbumCoverCallback(albums_response: HttpResponse): void{
    //console.log("Set Album Cover Response: ", albums_response)
    if(albums_response.status == '200'){
      this.album_page = 0
      this.toast_helper_config.text.info_text = "Album cover updated successfully."
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper = true       
      this.myAlbums()
    } else {
      this.toast_helper_config.text.info_text = "Failed to update album cover."
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper = true      
      //console.log("Set Album Cover Error: ", albums_response)
    }
    this.loading = false
  }

  public initDeleteAlbum(){
    this.spotbie_alert_box = true    
  }

  public confirmAlbumDelete(){
    this.loading = true
    this.spotbie_alert_box = false
    this.deleteAlbum() 
  }

  public declineAlbumDelete(){
    this.spotbie_alert_box = false   
  }

  public deleteAlbum(){
    const delete_album_object = {
      exe_api_key: this.exe_api_key,
      upload_action: 'deleteAlbum',
      current_album: this.current_album.id
    }
    this._album_service.deleteAlbum(delete_album_object, this.deleteAlbumCallback.bind(this))
  }

  private deleteAlbumCallback(albums_response: HttpResponse){

    //console.log("deleteAlbumCallback Response: ", albums_response)
    if(albums_response.status == '200'){

      if(albums_response.responseObject = 'deleted'){

        this.toast_helper_config.text.info_text = "Your album was deleted."
        this.toast_helper_config.type = "acknowledge"
        this.toast_helper_config.actions.acknowledge = function(){this.toast_helper = false}.bind(this)
        this.toast_helper = true          

        this.album_page = 0
        this.myAlbums()

        setTimeout(function(){
          this.closeWindow()
        }.bind(this), 2000)   

      } else if(albums_response.responseObject = 'failed'){
        this.toast_helper_config.text.info_text = "There was an error deleting your album."
        this.toast_helper_config.type = "acknowledge"
        this.toast_helper_config.actions.acknowledge = function(){this.toast_helper = false}.bind(this)
        this.toast_helper = true           
      }

    } else
      console.log("deleteAlbumCallback Error: ", albums_response)

    this.loading = false

  }

  public toggleAlbumDescription(): void{
    this.show_album_description = !this.show_album_description
  }

  get spotbie_album_name() {return this.album_form.get('spotbie_album_name').value }
  get spotbie_album_description() {return this.album_form.get('spotbie_album_description').value }
  get spotbie_album_privacy() {return this.album_form.get('spotbie_album_privacy').value }
  get f() { return this.album_form.controls }

  private pullSingleAlbumItem(album_media_id): void{

    let current_id = album_media_id

    const albums_object = { exe_api_key: null,
      upload_action: 'pullSingleMedia',
      current_media_id: current_id,
      current_album: this.album_id
    }
    
    this._album_service.pullSingleMedia(albums_object, this.pullSingleMediaCallback.bind(this))

  }

  private pullSingleMediaCallback(albums_response){
    
    //console.log("pullSingleMedia Response: ", albums_response)
    
    if(albums_response.status == '200'){

      if(albums_response.responseObject == 'private_content'){
        this.loading = false
        this.toast_helper_config.text.info_text = "This album is private."
        this.toast_helper_config.type = "acknowledge"
        this.toast_helper = true        
        return
      } else if(albums_response.responseObject == 'error'){
        this.loading = false
        this.toast_helper_config.text.info_text = "Error loading album. Try again."
        this.toast_helper_config.type = "acknowledge"
        this.toast_helper = true
        return
      }

      albums_response.responseObject.current.file_type = albums_response.responseObject.current.album_media_type
      albums_response.responseObject.current.file_path = albums_response.responseObject.current.album_media_content
      
      if(albums_response.responseObject.current.file_type == 'video'){
        let poster = albums_response.responseObject.current.file_path.split('.mp4')
        albums_response.responseObject.current.poster = poster[0] + ".jpeg"
      }

      albums_response.responseObject.current.album_item_caption = unescape(albums_response.responseObject.current.album_item_caption)
      
      this.current_album_media = new AlbumMedia(albums_response.responseObject.current, this._album_service)
      
      this.view_media = true
      
    } else
      console.log("pullSingleMedia Error: ", albums_response)

  }
  
  ngOnInit() {    
    this.bg_color = localStorage.getItem('spotbie_backgroundColor')
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
    this.is_logged_in = localStorage.getItem('spotbie_loggedIn')
    this.logged_in_user_id = localStorage.getItem('spotbie_userId')
  }

  async ngAfterViewInit() {

    //console.log("Public user id: ", this.public_profile_info)

    if (this.public_profile_info !== undefined) {
      this.public_profile = true
      this.spotbie_user_id = parseInt(this.public_profile_info.public_exe_user_id)
      this.profile_username = this.public_profile_info.public_username
      this.bg_color = this.public_profile_info.public_bg_color
    } else {
      this.public_profile = false
      this.spotbie_user_id = parseInt(localStorage.getItem('spotbie_userId'))
      this.bg_color = localStorage.getItem('spotbie_backgroundColor')
      this.profile_username = localStorage.getItem('spotbie_userLogin')
    }

    // console.log("Public profile Info: ", this.public_profile_info)
    this.myAlbums()
    this.no_album_object = true

    if((this.album_media_id !== null && this.album_media_id !== undefined)
        && (this.album_id !== null && this.album_id !== undefined)){
      
      //open album and album item
      let album = new Album()
      album.id = this.album_id
          
      this.pullSingleAlbum(album)
      this._album_service.getAlbumSettings(album.id, this.exe_api_key, this.getAlbumSettingsCallback.bind(this))
      this.pullSingleAlbumItem(this.album_media_id)

      this._platformStrategy.replaceState('/user-profile/' + this.profile_username + '/albums/' + this.album_id + '/media/' + this.album_media_id)

      this.no_album_object = false

    } else if((this.album_media_id === null || this.album_media_id === undefined)
              && (this.album_id !== null && this.album_id !== undefined)){

      //only open album
      this.no_album_object = true

      let album = new Album()
      album.id = this.album_id

      this.pullSingleAlbum(album)
      this._album_service.getAlbumSettings(album.id, this.exe_api_key, this.getAlbumSettingsCallback.bind(this))

      this._platformStrategy.replaceState('/user-profile/' + this.profile_username + '/albums/' + this.album_id)

    }

  }
}