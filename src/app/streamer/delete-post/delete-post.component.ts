import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core'
import { StreamPost } from '../streamer-models/stream-post'
import * as spotbieGlobals from '../../globals'
import { HttpHeaders, HttpClient } from '@angular/common/http'
import { HttpResponse } from '../../models/http-reponse'

const SETTINGS_API = spotbieGlobals.API + 'api2/streamer.service.php'

const HTTP_OPTIONS = {
  withCredentials : true,
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

@Component({
  selector: 'app-delete-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./delete-post.component.css', '../streamer.component.scss']
})
export class DeletePostComponent implements OnInit {

  @Input() stream_post : StreamPost

  @Input() window_object : any 

  @Output() streamPostDeleted : EventEmitter<any> = new EventEmitter()

  @Output() closeWindow : EventEmitter<any> = new EventEmitter()
  
  @ViewChild('spotbie_post_repost_title') spotbie_post_repost_title : ElementRef

  public input_flag : string = 'delete'

  public bg_color : string

  public deleted_msg : string

  public check_stream_text_timeout : any

  public embed_content : boolean = false
  public current_video_url : string
  public current_embed_video : any

  public deleting : boolean

  public exe_api_key : string

  public deleted : boolean  

  constructor(private http : HttpClient) { }

  public closeWindowX(){
    this.closeWindow.emit(this.window_object)
  }

  public deleteIt() : void {

    if (this.deleting == true) return

    this.deleting = true

    let callback = this.postDeleted.bind(this)

    const post_actions_object = { exe_api_key : this.exe_api_key, 
                                  stream_post_id : this.stream_post.stream_post_id, 
                                  exe_stream_action : 'deletePost' }

    this.http.post<HttpResponse>(SETTINGS_API, post_actions_object, HTTP_OPTIONS)
      .subscribe( resp => {
          // console.log("Settings Response", resp)
          const settings_response = new HttpResponse ({
          status : resp.status,
          message : resp.message,
          full_message : resp.full_message,
          responseObject : resp.responseObject
        })
          callback(settings_response)
      },
        error => {
          console.log('error', error)
    })

  }

  public postDeleted(settings_response : HttpResponse) : void {

    if (settings_response.status == '200') {

      if (settings_response.responseObject == 'deleted')
        this.deleted_msg = 'Post deleted...'
      else if (settings_response.responseObject == 'noexist')
        this.deleted_msg = 'Post does not exist.'

      this.deleted = true

      setTimeout(function() {
        this.deleted = false
        this.streamPostDeleted.emit(this.stream_post)
        this.closeWindowX()
      }.bind(this), 1500)

    } else {
      this.deleting = false
      console.log('Error Sending Report : ', settings_response)
    }

    this.spotbie_post_repost_title.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }

  ngOnInit() {

    this.bg_color = localStorage.getItem('spotbie_backgroundColor')
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')

  }

}