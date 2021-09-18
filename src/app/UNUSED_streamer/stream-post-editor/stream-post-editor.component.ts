import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core'
import { StreamerComponent } from '../streamer.component'
import { StreamPost } from '../streamer-models/stream-post'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { HttpResponse } from '../../models/http-reponse'
import { StreamerService } from '../streamer-services/streamer.service'
import { DomSanitizer } from '@angular/platform-browser'
import * as streamTextCheck from '../../helpers/video-check'
import { StreamPostComponent } from '../stream-post/stream-post.component'

@Component({
  selector: 'app-stream-post-editor',
  templateUrl: './stream-post-editor.component.html',
  styleUrls: ['./stream-post-editor.component.css', '../streamer.component.scss']
})
export class StreamPostEditorComponent implements OnInit {

  @Input() stream_post : StreamPost

  @Input() window_object : any

  @Output() streamPosted : EventEmitter<any> = new EventEmitter()
  
  @Output() closeWindow : EventEmitter<any> = new EventEmitter()

  public input_flag : string = "edit"

  public bg_color : string
  
  public loading : boolean = false

  constructor(){}

  public closeWindowX() : void{
    this.closeWindow.emit(this.window_object)
  }
  
  public onStreamPosted(stream_post : StreamPost){
    this.stream_post = stream_post
    this.streamPosted.emit(this.stream_post)
  }

  ngOnInit() : void {
    this.bg_color = localStorage.getItem("spotbie_backgroundColor")
  }

}