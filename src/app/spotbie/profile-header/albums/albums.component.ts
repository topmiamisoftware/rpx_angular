import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core'
import { Location } from '@angular/common'
import { Validators, FormBuilder, FormGroup } from '@angular/forms'
import { AlbumService } from './album-services/album.service'
import { Album } from './album-models/album'
import { AlbumMedia } from './album-models/album-media'
import { AlbumMediaUploadResponse } from './album-models/album-media-upload-response'
import { ToastRequest } from 'src/app/helpers/toast-helper/toast-models/toast-request'

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {

  @Input() publicProfileInfo

  @Input() album_id: number
  @Input() album_media_id: number

  @ViewChild('albumMediaInput') albumMediaInput
  @ViewChild('albumMediaFileInfoMessage') albumMediaFileInfoMessage

  public spotbie_user_id: number

  public bg_color: string
  public public_profile: boolean
  public profile_username: string

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

  public albumPage: number = 1

  public albums_load_more: boolean = false

  public album_slider: boolean = false

  public albumItemsPage: number = 1

  public pullMoreAlbumItems: boolean = false

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

  public loadingMore: boolean = false

  constructor(private _formBuilder: FormBuilder,
              private albumService: AlbumService,
              private _platformStrategy: Location) { }


  //@HostListener('window:beforeunload')
  private _deleteAllUnused(): void {

    this.albumService.deleteAllUnused(this.current_album.id).subscribe(
      resp => {
        console.log("deleted unused media.")
      }
    )

  }

  public albumScroll(evt: any): void{
    
    if(this.loadingMore) return

    //In chrome and some browser scroll is given to body tag
    if ((window.innerHeight + evt.srcElement.scrollTop) >= (evt.srcElement.getElementsByClassName('stream-poster-album-media-wrapper')[0].offsetHeight - 500))
      if(typeof this.loadMoreAlbumItems === "function" && this.pullMoreAlbumItems) this.loadMoreAlbumItems()

  }
  
  public editAlbumMedia(album_media: AlbumMedia): void{
    this.current_album_media = album_media
    this.edit_media = true
  }

  public pullAlbumMediaLikes(album_media: AlbumMedia): void{
    this.current_album_media = album_media
    this.media_likes = true
  }

  public shareAlbumMedia(album_media: AlbumMedia): void{
    this.current_album_media = album_media
    this.share_media = true
  }

  public likeAlbumItem(album_media: AlbumMedia): void {

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

    this.albumService.likeAlbumItem(this.current_album_media.album_id, this.current_album_media.album_media_id).subscribe(
      resp =>{
        this.likeAlbumItemCallback(resp)
      }
    )

  }

  private likeAlbumItemCallback(album_media_like_response: any): void{

    const like_response = album_media_like_response.message

    if(like_response == 'added')
      this.current_album_media.likes_count++
    else if(like_response == 'removed')
      this.current_album_media.likes_count--

  }

  public shareAlbum(): void{
    this.share_album = true
  }

  public openMedia(album_media: AlbumMedia): void{
    this.current_album_media = album_media
    this.view_media = true
  }

  public toggleAlbumMakerForm(): void {
    this.show_album_maker_form = !this.show_album_maker_form
    if(this.album_media_array.length == 0 && this.show_album_maker_form == false){
      this.closeWindow()
    }
  }

  public startAlbumMediaUploader(): void{
    this.albumMediaInput.nativeElement.click()
  }

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
    this.albumService.album_media_progress.subscribe(progress =>{
      this.upload_progress = progress
    })

    album_media_upload_response = await this.albumService.attachAlbumMedia(files, null, this.current_album, this.uploadFinished.bind(this))

    if(album_media_upload_response.album_media_message !== 'success'){
      this.album_media_message = album_media_upload_response.album_media_message
      this.loading = false
    }

  }

  private uploadFinished(httpResponse: any): void{

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

    } else {

      this.album_media_uploaded_msg = 'There was an error uploading your files. Refresh the component and try again.'

    }
    
    this.show_upload_progress = false
    this.loading = false

  }

  public removeAlbumItem(file, event: Event): void {

    this.loading = true

    this.albumService.removeAlbumMedia(this.current_album.id, file.file_path, file.album_media_id).subscribe(

      resp =>{
        this.removeAlbumMediaFinished(resp, file, event) 
      }, 
      error => {
        console.log("removeAlbumItem", error)
      }

    )

  }

  public removeAlbumMediaFinished(response: any, file, event): void{

    if (response.message == 'removed') {

      const element_to_pop = this.album_media_array.indexOf(file)
      this.album_media_array.splice(element_to_pop, 1)

      const element_to_pop2 = this.new_album_media_array.indexOf(file)
      this.new_album_media_array.splice(element_to_pop2, 1)

      const elementToRemove = event.srcElement.parentNode
      elementToRemove.parentNode.removeChild(elementToRemove)

    } else {

      this.toast_helper_config.text.info_text = response.message
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper = true

    }

    this.loading = false

  }

  public removeAlbumMediaBeforeUpload(file, event: Event): void{

    this.loading = true

    this.albumService.removeAlbumMediaBeforeUpload(this.current_album.id, file.file_path).subscribe(
      resp =>{
        this.removeAlbumMediaBeforeUploadCallback(resp, file, event)
      },
      error =>{
        console.log("removeAlbumMediaBeforeUpload", error)
      }
    )

  }
  
  private removeAlbumMediaBeforeUploadCallback(response: any, file, event): void{

    if (response.status == 'removed') {

      const element_to_pop = this.album_media_array.indexOf(file)
      this.album_media_array.splice(element_to_pop, 1)

      const element_to_pop2 = this.new_album_media_array.indexOf(file)
      this.new_album_media_array.splice(element_to_pop2, 1)

      const elementToRemove = event.srcElement.parentNode
      elementToRemove.parentNode.removeChild(elementToRemove)

      console.log('the upload array ', this.album_media_array)

    } else
      this.albumMediaFileInfoMessage.nativeElement.innerHTML = response.full_message
    
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

    this.albumService.saveAlbum(this.current_album, album_info).subscribe(
      resp =>{
        this.saveAlbumCallback(resp)
      },
      error =>{
        console.log("saveAlbum", error)
      }
    )

  }

  public saveAlbumCallback(albums_response: any) {

    if (albums_response.message == 'saved') {

        this.album_media_uploaded_msg = 'Your album has saved successfully.'
        this.albumMediaFileInfoMessage.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        this.albumPage = 0
        this.myAlbums()
        setTimeout(function() {this.closeWindow() }.bind(this), 500)

    } else {
      console.log('Save Album', albums_response)
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
    this.albumItemsPage = 1
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
    if(this.loadingMore) return
    this.loadingMore = true
    this.pullSingleAlbum(this.current_album, true)
  }

  public async openAlbum(album: Album) {

    this.pullSingleAlbum(album)

    if (this.public_profile === true)
      this._platformStrategy.replaceState(`/user-profile/${this.profile_username}/albums/${this.album_id}`)

  }

  private pullSingleAlbum(album: Album, load_more = false): void {
    
    if(this.albumItemsPage == 1) this.loading = true

    if (load_more == false) {
      this.current_album = album
      this.albumItemsPage = 1
      this.album_media_array = []
      this.new_album_media_array = []
    }

    let album_id_to_pull = album.id

    if(this.public_profile === true) this.album_id = album_id_to_pull

    this.albumService.pullSingleAlbum(album_id_to_pull, this.albumItemsPage).subscribe(
      resp =>{
        this.pullSingleAlbumCallback(resp)
      }
    )

  }
  
  public pullSingleAlbumCallback(album_response: any): void {

    const album_settings = album_response.album_settings

    if(album_response.message == 'error'){

      this.loading = false
      this.toast_helper_config.text.info_text = "Album does not exist."
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper = true                
      return

    } else if(album_response.message == 'private_content'){

      this.loading = false
      this.toast_helper_config.text.info_text = "This album is private."
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper = true  
      return

    } else if(album_settings === null){
      
      this.view_media = false
      this.toast_helper_config.text.info_text = "Album does not exist."
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper = true        
      return

    }

    if(this.no_album_object){
      this.current_album = album_settings
      this.current_album.description = unescape(album_settings.description)
      this.current_album.name = unescape(album_settings.name)
      this.current_album.privacy = album_settings.privacy      
      this.current_album.is_new = false
    }

    if(this.current_album.cover !== undefined && this.current_album.cover.indexOf('.mp4') > 0){
      let poster = this.current_album.cover.split('.mp4')
      this.current_album.cover = poster[0] + ".jpeg"
    }

    if (this.public_profile === false) this.initAlbumsForm()

    album_response.album_item_list.data.forEach(album_item => {

      if(album_item.media_type == 'video'){
        let poster = album_item.content.split('.mp4')
        album_item.poster = poster[0] + ".jpeg"
      }

      album_item.album_username = this.profile_username

      let album_media_item = new AlbumMedia(album_item, this.albumService)

      this.album_media_array.push(album_media_item)

    })

    if (this.public_profile === false) {
      
      this.album_maker = true
      this.upload_complete = true

    } else
      this.album_slider = true

    const last_page = album_response.album_item_list.last_page
    const current_page = album_response.album_item_list.current_page

    if (current_page < last_page) {

      this.albumItemsPage++
      this.pullMoreAlbumItems = true

    } else
      this.pullMoreAlbumItems = false

    this.loading = false
    this.loadingMore = false

  }

  public myAlbums(): void{

    let peer_id
    let isPublic: boolean = true
    
    this.all_albums_array = []

    if (this.public_profile === true){
      peer_id = this.publicProfileInfo.user.id
    } else {
      peer_id = 'null'
      isPublic = false
    }

    console.log("Peer Id", peer_id)

    this.albumService.myAlbums(this.albumPage, isPublic, peer_id).subscribe(

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

      if(album.likes_count.length > 2) album.likes_count = "99+"

      if(album.comments_count.length > 2) album.comments_count = "99+"
    
    })      

    this.albumPage = this.albumPage + 1

    if (current_page < last_page) this.albums_load_more = true

  }

  public setAlbumCover(file): void{

    this.albumService.setAlbumCover( this.current_album.id, file.file_path, file.album_media_id).subscribe(
      resp =>{
        this.setAsAlbumCoverCallback(resp)
      }, 
      error =>{
        console.log("setAlbumCover", error)
      }
    )
  
  }

  private setAsAlbumCoverCallback(albums_response: any): void{

    if(albums_response.message == 'saved'){

      this.albumPage = 0
      this.toast_helper_config.text.info_text = "Album cover updated successfully."
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper = true       
      this.myAlbums()

    } else {

      this.toast_helper_config.text.info_text = "Failed to update album cover."
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper = true

    }

    this.loading = false

  }

  public initDeleteAlbum(): void{

    this.spotbie_alert_box = true    

  }

  public confirmAlbumDelete(): void {

    this.loading = true
    this.spotbie_alert_box = false
    this.deleteAlbum() 

  }

  public declineAlbumDelete(): void {

    this.spotbie_alert_box = false 

  }

  public deleteAlbum(): void {

    this.albumService.deleteAlbum(this.current_album.id).subscribe(
      resp =>{
        this.deleteAlbumCallback(resp)
      },
      error => {
        console.log("deleteAlbum", error)        
      }
    )

  }

  private deleteAlbumCallback(albums_response: any): void{

    if(albums_response.message = 'deleted'){

      this.toast_helper_config.text.info_text = "Your album was deleted."
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper_config.actions.acknowledge = function(){this.toast_helper = false}.bind(this)
      this.toast_helper = true          

      this.albumPage = 0
      this.myAlbums()

      setTimeout(function(){
        this.closeWindow()
      }.bind(this), 2000)   

    } else if(albums_response.message = 'failed'){

      this.toast_helper_config.text.info_text = "There was an error deleting your album."
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper_config.actions.acknowledge = function(){this.toast_helper = false}.bind(this)
      this.toast_helper = true         

    }

    this.loading = false

  }

  public toggleAlbumDescription(): void{
    this.show_album_description = !this.show_album_description
  }

  get spotbie_album_name() {return this.album_form.get('spotbie_album_name').value }
  get spotbie_album_description() {return this.album_form.get('spotbie_album_description').value }
  get spotbie_album_privacy() {return this.album_form.get('spotbie_album_privacy').value }
  get f() { return this.album_form.controls }

  private pullSingleAlbumItem(album_media_id: number): void{
    
    this.albumService.pullSingleMedia(album_media_id).subscribe(
      resp => {
        this.pullSingleMediaCallback(resp)
      },
      error => {
        console.log("pullSingleAlbumItem", error)
      } 
    )

  }

  private pullSingleMediaCallback(albums_response: any): void{

    if(albums_response.message == 'private_content'){
      this.loading = false
      this.toast_helper_config.text.info_text = "This album is private."
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper = true        
      return
    } else if(albums_response.message == 'error'){
      this.loading = false
      this.toast_helper_config.text.info_text = "Error loading album. Try again."
      this.toast_helper_config.type = "acknowledge"
      this.toast_helper = true
      return
    }

    albums_response.current.file_type = albums_response.current.album_media_type
    albums_response.current.file_path = albums_response.current.album_media_content
    
    if(albums_response.current.file_type == 'video'){

      let poster = albums_response.current.file_path.split('.mp4')
      albums_response.current.poster = poster[0] + ".jpeg"

    }

    albums_response.current.album_item_caption = unescape(albums_response.current.album_item_caption)
    
    this.current_album_media = new AlbumMedia(albums_response.current, this.albumService)
    
    this.view_media = true

  }
  
  ngOnInit() {    

    this.bg_color = localStorage.getItem('spotbie_backgroundColor')
    this.is_logged_in = localStorage.getItem('spotbie_loggedIn')
    this.logged_in_user_id = localStorage.getItem('spotbie_userId')

  }

  async ngAfterViewInit() {

    if (this.publicProfileInfo !== undefined) {

      this.public_profile = true
      this.spotbie_user_id = parseInt(this.publicProfileInfo.user.id)
      this.profile_username = this.publicProfileInfo.user.username
      this.bg_color = this.publicProfileInfo.web_options.bg_color

    } else {

      this.public_profile = false
      this.spotbie_user_id = parseInt(localStorage.getItem('spotbie_userId'))
      this.bg_color = localStorage.getItem('spotbie_backgroundColor')
      this.profile_username = localStorage.getItem('spotbie_userLogin')

    }

    this.myAlbums()
    this.no_album_object = true

    if((this.album_media_id !== null && this.album_media_id !== undefined)
        && (this.album_id !== null && this.album_id !== undefined)){
      
      //open album and album item
      let album = new Album()
      album.id = this.album_id
          
      this.pullSingleAlbum(album)
      
      this.pullSingleAlbumItem(this.album_media_id)

      this._platformStrategy.replaceState(`/user-profile/${this.profile_username}/albums/${this.album_id}/media/${this.album_media_id}`)

      this.no_album_object = false

    } else if((this.album_media_id === null || this.album_media_id === undefined)
              && (this.album_id !== null && this.album_id !== undefined)){

      //only open album
      this.no_album_object = true

      let album = new Album()
      album.id = this.album_id

      this.pullSingleAlbum(album)

      this._platformStrategy.replaceState(`/user-profile/${this.profile_username}/albums/${this.album_id}`)

    }

  }
}