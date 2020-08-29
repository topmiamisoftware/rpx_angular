import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core'
import { StreamPost } from '../streamer-models/stream-post'
import * as spotbieGlobals from '../../globals'
import { HttpHeaders, HttpClient } from '@angular/common/http'
import { HttpResponse } from '../../models/http-reponse'
import { StreamPostComponent } from '../stream-post/stream-post.component'

const SETTINGS_API = spotbieGlobals.API + 'api/streamer.service.php'

const HTTP_OPTIONS = {
  withCredentials: true,
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Component({
  selector: 'app-reposter',
  templateUrl: './reposter.component.html',
  styleUrls: ['./reposter.component.css', '../streamer.component.scss']
})
export class ReposterComponent implements OnInit {

  @Input() stream_post: StreamPost

  @Input() window_object: any

  @Output() closeWindow: EventEmitter<any> = new EventEmitter()

  @ViewChild('spotbie_post_repost_title') spotbie_post_repost_title: ElementRef

  public input_flag: string = "repost"

  public bg_color: string

  private exe_api_key: string

  private sending_repost = false

  public repost_send_msg: string

  public repost_sent: boolean

  public check_stream_text_timeout: any

  public embed_content: boolean = false
  public current_video_url: string
  public current_embed_video: any

  constructor(private http: HttpClient,
              private host: StreamPostComponent) { }

  public closeWindowX(): void {
    this.closeWindow.emit(this.window_object)
  }

  public repostIt() {

    if (this.sending_repost == true) return

    this.sending_repost = true

    const _this = this
    const post_actions_object = { exe_api_key: this.exe_api_key, 
                                  stream_post_id: this.stream_post.stream_post_id, 
                                  exe_stream_action: 'repostPost' }

    this.http.post<HttpResponse>(SETTINGS_API, post_actions_object, HTTP_OPTIONS)
      .subscribe( resp => {
        // console.log("Settings Response", resp)
          const settings_response = new HttpResponse ({
          status: resp.status,
          message: resp.message,
          full_message: resp.full_message,
          responseObject: resp.responseObject
        })
          _this.postReposted(settings_response)
      },
        error => {
          console.log('error', error)
    })
    
  }

  public postReposted(settings_response: HttpResponse) {
    if (settings_response.status == '200') {

      if (settings_response.responseObject == 'reposted')
        this.repost_send_msg = 'Stream reposted...'
      else if (settings_response.responseObject == 'noexist')
        this.repost_send_msg = 'Post does not exist.'
      
      this.repost_sent = true

      setTimeout(function() {

        this.repost_sent = false
        this.closeWindow()

      }.bind(this), 3500)

    } else {
      this.sending_repost = false
      console.log('Error Sending Report: ', settings_response)
    }
    this.spotbie_post_repost_title.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  ngOnInit() {
    this.bg_color = localStorage.getItem("spotbie_backgroundColor")
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
    //console.log('Stream to re-post: ', this.stream_post)
  }

}
