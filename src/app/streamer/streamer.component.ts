import { Component, OnInit, ViewChild, ElementRef, Input, HostListener } from '@angular/core'
import { StreamerService } from './streamer-services/streamer.service'
import { HttpResponse } from '../models/http-reponse'
import { StreamPost } from './streamer-models/stream-post'
import { videoEmbedCheck } from '../helpers/video-check'
import { DomSanitizer } from '@angular/platform-browser'
import { Subscription } from 'rxjs'
import { ColorsService } from '../services/background-color/colors.service'

@Component({
  selector: 'app-streamer',
  templateUrl: './streamer.component.html',
  styleUrls: ['./streamer.component.scss']
})
export class StreamerComponent implements OnInit {

  @ViewChild('spotbieFriendsStream') spotbieFriendsStream
  @ViewChild('spotbieMyStream') spotbieMyStream
  @ViewChild('spotbieLifeStream') spotbieLifeStream
  @ViewChild('spotbieLikesListWrapper') spotbieLikesListWrapper
  @ViewChild('spotbie_stream_posts_anchor') spotbie_stream_posts_anchor: ElementRef

  @Input() public_profile_info

  @Input() stream_post_id

  public public_exe_user_id: number

  public public_username: string

  public public_profile: boolean = false

  public loading: boolean = false

  public current_stream: any

  public stream_posts = new Array()
  public page: number = 0  
  public stream_next: boolean = false
  public stream_loaded: boolean = false

  public bg_color: string
  public web_options_subscriber: Subscription

  protected exe_api_key: string  

  public load_more_stream: Function

  public stream_type

  public no_posts_text_1: string = 'No posts available in your Friend\'s Stream.'
  public no_posts_text_2: string = 'Try adding or following more profiles.'
  public no_posts_text_3: string = ''
  public no_posts_text_4: string = ''

  public embed_content: boolean = false

  public isLoggedIn: boolean

  public private_stream: boolean = false

  public life_stream_coming_soon: boolean = false
  public coming_soon_text: string

  public stream_by

  public stream_is_loading: boolean = false

  public view_post_window: any = { open: false }

  public spotbie_friends_stream_image = "assets/images/friend_stream.png"
  public spotbie_my_stream_img = "assets/images/my_stream.png"

  public spotbie_life_stream_image = "assets/images/extra_media_image.png"
  public spotbie_extra_media_image = "assets/images/multimedia.png"

  public loading_default = 'assets/images/spotbie_loading_default.png'

  public current_stream_post: StreamPost

  public stream_poster_input_flag: string = "post"

  public loading_bottom_stream_text: boolean = false
    
  constructor(private streamerService: StreamerService,
              private _web_options_service: ColorsService,
              private sanitizer: DomSanitizer) {}

  @HostListener("window:scroll", [])
  onScroll(): void {

    //In chrome and some browser scroll is given to body tag
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 4000)) {
      
      // you're 4000px before the bottom of the page
      if(this.stream_is_loading) return

      this.stream_is_loading = true
      
      if(typeof this.load_more_stream === "function") {
        this.load_more_stream()
      }
    
    }

  }

  public closeWindow(window_object: any){
    window_object.open = false 
  }

  public menuSelectedStream(stream_selector): void {

    if(!this.isLoggedIn && this.public_profile) return

    this.spotbieFriendsStream.nativeElement.style.backgroundColor = 'rgba(0,0,0,.23)'
    this.spotbieMyStream.nativeElement.style.backgroundColor = 'rgba(0,0,0,.23)'
    this.spotbieLifeStream.nativeElement.style.backgroundColor = 'rgba(0,0,0,.23)'

    stream_selector.nativeElement.style.backgroundColor = 'rgba(0,0,0,.65)'

  }

  public myStream(): void {
    
    if(this.page == 0) 
      this.loading = true
    else
      this.loading_bottom_stream_text = true
    
    this.stream_is_loading = true

    if (this.stream_type != 'my_stream') {

      this.stream_posts = []
      this.page = 0
      this.life_stream_coming_soon = false
      this.stream_next = false

    }

    if (this.public_profile) {

      this.no_posts_text_1 = 'No posts available in ' + this.public_username + '\'s stream.'
      this.no_posts_text_2 = ''

    } else {

      this.no_posts_text_1 = 'No posts available in your stream.'
      this.no_posts_text_2 = 'Post something to start sharing.'

    }

    this.stream_type = 'my_stream'

    if (this.page == 0) this.menuSelectedStream(this.spotbieMyStream)

    this.stream_loaded = false

    let userId = null

    if(this.public_profile_info !== undefined){
      userId = this.public_exe_user_id
    }

    const streamObj = { 
      page: this.page,
      user_id: userId
    }

    this.streamerService.getMyStream(streamObj).subscribe(
      resp => {
        this.populateMyStream(resp)
      }
    )

  }

  public updateStreamPosted(): void {
    this.stream_type = ''
    this.myStream()
  }

  private async populateMyStream(httpResponse: any) {

    let stream_posts: Array<StreamPost> = httpResponse.stream_post_list.data

    let last_page = httpResponse.stream_post_list.last_page
    let current_page = httpResponse.stream_post_list.current_page

    this.page = current_page + 1

    const stream_post_length = stream_posts.length

    for(let i = 0; i < stream_post_length; i++){
      
      let stream_post: StreamPost = new StreamPost(stream_posts[i], this.streamerService, this.sanitizer)               

      if(stream_post.extra_media_obj !== undefined){

        stream_post.extra_media_obj.forEach(extra_media => {

          if(extra_media.type == 'video'){

            let poster = extra_media.content.split('.mp4')
            extra_media.poster = poster[0] + ".jpeg"

          }

        })

      }

      stream_posts[i] = stream_post

      this.stream_posts.push(stream_posts[i])

      if(current_page == 0) this.loading_bottom_stream_text = false

    }

    if (current_page < last_page) {
      this.stream_next = true
      this.load_more_stream = function() { this.myStream() }
    } else{
      this.stream_next = false
      this.load_more_stream = null
    }
    
    this.stream_loaded = true
    this.loading_bottom_stream_text = false
    this.loading = false
    this.stream_is_loading = false

  }

  public openStream(ac: number) {

    this.spotbie_stream_posts_anchor.nativeElement.scrollIntoView()

    switch (ac) {
      case 0:
        this.myGeneralStream()
        break
      case 1:
        this.myStream()
        break
    }

  }

  private myGeneralStream(): void{

    if(this.page == 0) 
      this.loading = true
    else
      this.loading_bottom_stream_text = true

    this.stream_is_loading = true
    
    if (this.stream_type != 'friends') {
      this.stream_posts = []
      this.page = 0
      this.life_stream_coming_soon = false
      this.stream_next = false
    }

    this.no_posts_text_1 = 'No posts available in your Friend\'s Stream.'
    this.no_posts_text_2 = 'Try adding or following more profiles.'

    this.stream_type = 'friends'

    if (this.page == 0) this.menuSelectedStream(this.spotbieFriendsStream)
    
    this.stream_loaded = false

    const stream_obj = { page: this.page }

    this.streamerService.getMyGeneralStream(stream_obj).subscribe(
      resp => {
        this.populateMyGeneralStream(resp)
      },
      err => {
        console.log("getMyGeneralStream", err) 
      }
    )
  
  }

  private async populateMyGeneralStream(httpResponse: any) {

    let stream_posts: Array<StreamPost> = httpResponse.stream_post_list.data
    
    const stream_post_length = stream_posts.length

    let last_page = httpResponse.stream_post_list.last_page
    let current_page = httpResponse.stream_post_list.current_page

    this.page = current_page + 1

    if(stream_post_length == 0){
      this.myStream()
      return
    }

    for(let i = 0; i < stream_post_length; i++){
      
      let stream_post: StreamPost = new StreamPost(stream_posts[i], this.streamerService, this.sanitizer)

      if(stream_post.extra_media_obj !== undefined){

        stream_post.extra_media_obj.forEach(extra_media => {

            if(extra_media.type == 'video'){

              let poster = extra_media.content.split('.mp4')
              extra_media.poster = poster[0] + ".jpeg"

            }

        })

      }

      stream_posts[i] = stream_post

      this.stream_posts.push(stream_posts[i])

      if(current_page == 0) {
        this.loading_bottom_stream_text = false
        this.menuSelectedStream(this.spotbieFriendsStream)
      }

    }

    if (current_page < last_page) {
      this.stream_next = true
      this.load_more_stream = function() { this.myGeneralStream() }
    } else{
      this.stream_next = false
      this.load_more_stream = null
    }

    this.stream_loaded = true

    this.loading = false
    this.stream_is_loading = false
    
  }

  public lifeStream(): void {

    this.stream_posts = []
    this.page = 0    
    this.life_stream_coming_soon = true
    this.coming_soon_text = "Life Stream Coming Soon. Life Stream will be a timeline of videos and images you will share with your friends and/or followers."
    
  }
  
  public getLifeStreamCallback(httpResponse: any) {

  }

  public getMedia(): void {

    this.stream_posts = []
    this.page = 0
    this.life_stream_coming_soon = true
    this.coming_soon_text = "Media Stream Coming Soon. Media Stream will be a timeline of all the media you have uploaded from albums to text documents. Only your friends and followers will see this."        
  
  }
  
  getMediaStreamCallback(httpResponse: HttpResponse) {}

  logStream(stream) {}

  populateLifeStream() {}

  private pullSingleStream(): void{

    const stream_obj = {
      stream_post_id: this.stream_post_id
    }
    
    this.streamerService.getStreamPost(stream_obj).subscribe(
      resp =>{
        this.pullStreamPostCallback(resp)
      },
      error =>{
        console.log(error)
      }
    )
      
  }
  
  private async pullStreamPostCallback(streamPullResponse: any){

    if (streamPullResponse.status == '200') {

      let stream_post: any = streamPullResponse.responseObject
      
      if(stream_post.extra_media_obj !== undefined)
        stream_post.extra_media_obj = stream_post.extra_media_obj

      stream_post.stream_content = unescape(decodeURI(stream_post.stream_content))
      let youtube_embed = await videoEmbedCheck(stream_post.stream_content, this.sanitizer)

      if(youtube_embed !== 'no_video'){

        stream_post.youtube_video = true
        stream_post.youtube_embed = youtube_embed

      } else

        stream_post.youtube_video = false

        this.current_stream_post = stream_post
        this.view_post_window.open = true

    }

  }

  public onStreamPostDeleted(stream_post: StreamPost){
    this.page--
    let stream_post_index = this.stream_posts.indexOf(stream_post)
    this.stream_posts.splice(stream_post_index, 1)
  }

  ngOnInit() {

    // console.log("The username to view is: ", this.exe_user_name)
    let is_logged_in = localStorage.getItem('spotbie_loggedIn')
    
    if(is_logged_in == '1'){
      this.isLoggedIn = true
    } else {
      this.isLoggedIn = false
    }

    this.web_options_subscriber = this._web_options_service.getWebOptions().subscribe(web_options =>{

      if(web_options.bg_color){
        this.bg_color = web_options.bg_color
      }

    })

  }

  ngAfterViewInit() {

    if (this.public_profile_info !== undefined) {
      
      //console.log(this.public_profile_info)
      
      this.public_profile = true
      
      this.public_username = this.public_profile_info.user.username
      this.public_exe_user_id = this.public_profile_info.user.id
      this.bg_color = this.public_profile_info.web_options.bg_color

      this.stream_by = null
      
      this.myStream()

    } else {
      this.stream_by = localStorage.getItem('spotbie_userId')
      this.public_exe_user_id = null
      this.myGeneralStream()
    }
    //console.log("Stream post _id: ", this.stream_post_id)

    if(this.stream_post_id !== undefined && this.stream_post_id !== null)
      this.pullSingleStream()
      
  }
}
