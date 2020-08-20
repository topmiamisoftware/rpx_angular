import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core'
import { StreamPost } from '../streamer-models/stream-post'
import { ShareService } from '@ngx-share/core'

@Component({
  selector: 'app-post-share',
  templateUrl: './post-share.component.html',
  styleUrls: ['./post-share.component.css', '../streamer.component.scss']
})
export class PostShareComponent implements OnInit {

  @Input() stream_post : StreamPost

  @Input() window_object : any

  @Output() closeWindow : EventEmitter<any> = new EventEmitter()

  @ViewChild('spotbieShareWindow') spotbieShareWindow : ElementRef

  public bg_color : string

  public successful_url_copy : boolean = false

  public stream_post_description : string

  public stream_post_title : string

  public input_flag : string = "share"

  constructor(public share : ShareService) { }

  public closeWindowX(): void {
    this.closeWindow.emit(this.window_object)
  }

  public linkCopy(input_element) {

    input_element.select()

    document.execCommand('copy')

    input_element.setSelectionRange(0, input_element.value.length)

    this.successful_url_copy = true

    setTimeout(function() {
      this.successful_url_copy = false
    }.bind(this), 2500)

  }

  ngOnInit() {

    this.bg_color = localStorage.getItem("spotbie_backgroundColor")

    // console.log("Stream to share: ", this.stream_post)
    this.stream_post.stream_link = 'https://www.spotbie.com/user-profile/' + this.stream_post.stream_by.username + '/posts/' + this.stream_post.stream_post_id
    this.stream_post_description = "Post by " + this.stream_post.stream_by.username + " on " + this.stream_post.dated + ": " + this.stream_post.stream_content
    this.stream_post_title = "Post by " + this.stream_post.stream_by.username + " on " + this.stream_post.dated
  
  }

  ngAfterViewInit(){
    this.spotbieShareWindow.nativeElement.scrollTop = this.spotbieShareWindow.nativeElement.scrollHeight;
  }

}
