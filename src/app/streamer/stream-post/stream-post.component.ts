import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { StreamPost } from '../streamer-models/stream-post'
import { ShareService } from '@ngx-share/core'
import { MetaService } from '@ngx-meta/core'
import { StreamerService } from '../streamer-services/streamer.service'
import { HttpResponse } from 'src/app/models/http-reponse'

@Component({
  selector: 'app-stream-post',
  templateUrl: './stream-post.component.html',
  styleUrls: ['./stream-post.component.css', '../streamer.component.scss']
})
export class StreamPostComponent implements OnInit {
  
  @Input() stream_post: StreamPost

  @Input() input_flag: string

  @Output() streamPostDeleted: EventEmitter<any> = new EventEmitter()

  public bg_color: string

  public successful_url_copy: boolean = false

  public stream_post_description: string

  public stream_post_title: string

  public check_stream_text_timeout: any

  public embed_content: boolean = false
  public current_video_url: string
  public current_embed_video: any

  public stream_post_like_list = new Array()
  public likes_iter: number = 0
  public likes_iterator: number = 2
  public likes_list_loaded: boolean = false
  public stream_post_likes_next: boolean = false

  public current_stream_post: StreamPost

  public open_comments: boolean = false

  public stream_post_actions: any = false

  public post_reposter_window: any = { open : false }
  public share_post_window: any = { open : false }
  public post_report_window: any = { open : false }
  public post_delete_window: any = { open : false }
  public post_editor_window: any = { open : false }

  public current_stream: any
  
  public exe_api_key: string

  public loading_done: boolean

  public stream_id: number

  public stream_by: string
  
  public comments_config = {
    styling : {
      submit_button : {
        "background-color" : "rgba(0,0,0,.23)",
      },
      textarea_placeholder : {
        "color" : "white"
      },
    },
    info_text : {
      post_comment_text : "Upload a comment for this post.",
      no_comments_text : "No comments available for this post."
    }
  }

  constructor(public share: ShareService,
              private readonly meta: MetaService,
              private _streamer_service: StreamerService) { }
  
  public updateStreamPosted(stream_post : StreamPost){
    //console.log("New Stream Post : ", stream_post)
    this.stream_post = stream_post
  }

  public onStreamPostDeleted(stream_post : StreamPost){
      this.streamPostDeleted.emit(stream_post)
  }

  public closeWindow(window_object : any) : void {
    //console.log("Closing Window", window_object)
    window_object.open = false
  }
  
  public openLikes(stream_id : number = null) : void {

    this.loading_done = false

    // stream id can be null if we are loading from "load more"
    if (stream_id != null) {
      this.stream_id = stream_id
    }

    const exe_api_key = this.exe_api_key

    const stream_obj = { exe_api_key, exe_stream_action : 'pullLikesList', stream_post_id : this.stream_id, stream_likes_iter : this.likes_iter }

    //this._streamer_service.getMyStream(stream_obj, this.populateLikesList.bind(this))

  }

  public insertLike(stream : StreamPost) : void {

    this.current_stream_post = stream

    const liked_by_me = stream.liked_by_me

    if (liked_by_me == '1')
      stream.liked_by_me = '0'
    else
      stream.liked_by_me = '1'

    this.updateLikeUI(stream.stream_post_id, liked_by_me)

    const stream_obj = { exe_api_key : this.exe_api_key, exe_stream_action : 'likeStreamPost', stream_post_id : stream.stream_post_id}
    
    /*this._streamer_service.getMyStream(stream_obj).subscribe(
      resp => {
        this.insertLikeCallback(resp)
      },
      error => {
        console.log("insertLike Error", error)
      }

    )*/

  }

  private insertLikeCallback(httpResponse : HttpResponse) {
    if (httpResponse.status == '200') {
      return
    } else {

      const stream = this.current_stream
      const stream_post_id = stream.stream_post_id
      const liked_by_me = stream.liked_by_me
      if (liked_by_me == '1') {
        stream.liked_by_me = '0'
      } else {
        stream.liked_by_me = '1'
      }
      this.updateLikeUI(stream_post_id, liked_by_me)

      // console.log("Error adding like", httpResponse)
    }
  }

  private populateLikesList(httpResponse : HttpResponse) {

    if (httpResponse.status == '200') {

      const stream_post_like_list =  httpResponse.responseObject
      // console.log("Stream Post Likes", this.stream_post_like_list)
      
      if (stream_post_like_list.length == this.likes_iterator) {
        this.likes_iter = this.likes_iter + this.likes_iterator - 1
        this.stream_post_likes_next = true
        stream_post_like_list.pop()
      } else
        this.stream_post_likes_next = false

      this.stream_post_like_list.push.apply(this.stream_post_like_list, stream_post_like_list)

      this.likes_list_loaded = true

    }
    this.loading_done = true
    // console.log("The likes stream is: ", _this.stream_post_like_list)
  }

  public switchToExtraMedia(stream_post : StreamPost, extra_media : any) : void {
    let item = stream_post.extra_media_obj.splice(stream_post.extra_media_obj.indexOf(extra_media), 1)
    stream_post.extra_media_obj.unshift(item[0])
  }
  
  public openComments(stream_post : StreamPost) : void {
    stream_post.open_comments = true
    this.current_stream_post = stream_post 
  }

  public linkCopy(input_element) : void {

    input_element.select()
    document.execCommand('copy')
    input_element.setSelectionRange(0, input_element.value.length)
    this.successful_url_copy = true

    setTimeout(function() {
      this.successful_url_copy = false
    }.bind(this), 2500)

  }

  public closeLikesList() : void {

    this.stream_post_like_list = new Array()
    this.likes_iter = 0
    this.likes_list_loaded = false
    this.stream_post_likes_next = false

  }

  public updateLikeUI(stream_post_id, liked_by_me) : void {

    const like_counter = document.getElementById('spotbieLikeStreamPost' + stream_post_id) as HTMLElement
    
    let new_like_count = 0

    if (liked_by_me == '1') {
      liked_by_me = '0'
      new_like_count = parseInt(like_counter.innerHTML) - 1
    } else {
      liked_by_me = '1'
      new_like_count = parseInt(like_counter.innerHTML) + 1
    }

    like_counter.innerHTML = new_like_count.toString()

  }

  public showActions(stream_post : StreamPost) : void {

    stream_post.stream_actions = !stream_post.stream_actions

  }

  public deletePost(stream_post : StreamPost) : void {

    this.showActions(stream_post)
    this.current_stream_post = stream_post
    this.post_delete_window.open = true

  }

  public repostStream(stream_post : StreamPost) : void {

    this.showActions(stream_post)
    this.current_stream_post = stream_post
    this.post_reposter_window.open = true

  }

  public editPost(stream_post : StreamPost) : void {

    stream_post.stream_actions = false
    this.current_stream_post = stream_post
    this.post_editor_window.open = true

  }

  public sharePost(stream_post : StreamPost) : void {

    this.showActions(stream_post)
    this.current_stream_post = stream_post
    this.share_post_window.open = true

  }

  public reportPost(stream_post : StreamPost) : void {

    this.showActions(stream_post)
    this.current_stream_post = stream_post
    this.post_report_window.open = true

  }

  ngOnInit() {  
      
    /*
    this.stream_post.stream_by_info = this.stream_post.stream_by_info

    this.stream_post.stream_link = 'https://www.spotbie.com/user-profile/' + this.stream_post.stream_by_info.exe_username + '/' + this.stream_post.stream_post_id
    this.stream_post_description = this.stream_post.stream_content
    this.stream_post_title = "Post by " + this.stream_post.stream_by_info.exe_username + " on " + this.stream_post.dated
    
    this.meta.setTag('og:url', this.stream_post.stream_link)

    this.meta.setTitle(this.stream_post_title)
    this.meta.setTag('twitter:title', this.stream_post_title)
    this.meta.setTag('og:title', this.stream_post_title)
    
    this.meta.setTag('description', this.stream_post_description)
    this.meta.setTag('twitter:description', this.stream_post_title)    
    this.meta.setTag('og:description', this.stream_post_description)
    */

  }

  async ngAfterViewInit(){
    
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
    this.bg_color = localStorage.getItem('spotbie_backgroundColor')
    this.stream_by = localStorage.getItem('spotbie_userId')

    //console.log("Input Flag : ", this.input_flag);
    //console.log("Stream Post", this.stream_post)

  }
}
