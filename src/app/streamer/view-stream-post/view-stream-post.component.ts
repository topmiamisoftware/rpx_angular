import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { StreamPost } from '../streamer-models/stream-post'
import { videoEmbedCheck } from '../../helpers/video-check'
import { StreamerComponent } from '../streamer.component'
import { ShareService } from '@ngx-share/core'
import { DomSanitizer } from '@angular/platform-browser'
import { MetaService } from '@ngx-meta/core'

@Component({
  selector: 'app-view-stream-post',
  templateUrl: './view-stream-post.component.html',
  styleUrls: ['../post-share/post-share.component.css', '../streamer.component.scss']
})
export class ViewStreamPostComponent implements OnInit {
  
  @Input() stream_post : StreamPost

  @Input() window_object : any

  @Output() closeWindow : EventEmitter<any> = new EventEmitter()

  public input_flag : string = "view"

  public bg_color : string

  public successful_url_copy : boolean = false

  public stream_post_description : string

  public stream_post_title : string

  constructor(private host : StreamerComponent,
              public share : ShareService,
              private readonly meta : MetaService) { }

  public closeWindowX() : void {
    this.closeWindow.emit(this.window_object)
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

  ngOnInit() {    

    this.stream_post.stream_link = 'https://spotbie.com/user-profile/' + this.stream_post.stream_by.username + '/' + this.stream_post.stream_post_id
    this.stream_post_description = this.stream_post.stream_content
    this.stream_post_title = "Post by " + this.stream_post.stream_by.username + " on " + this.stream_post.dated
    
    this.meta.setTag('og:url', this.stream_post.stream_link)

    this.meta.setTitle(this.stream_post_title)
    this.meta.setTag('twitter:title', this.stream_post_title)
    this.meta.setTag('og:title', this.stream_post_title)
    
    this.meta.setTag('description', this.stream_post_description)
    this.meta.setTag('twitter:description', this.stream_post_title)    
    this.meta.setTag('og:description', this.stream_post_description)
    
  }

  async ngAfterViewInit(){
    
    this.bg_color = this.host.bg_color

  }
}
