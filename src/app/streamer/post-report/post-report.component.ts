import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core'
import { StreamPost } from '../streamer-models/stream-post'
import * as spotbieGlobals from '../../globals'
import { HttpHeaders, HttpClient } from '@angular/common/http'
import { HttpResponse } from '../../models/http-reponse'
import { DomSanitizer } from '@angular/platform-browser'
import { StreamPostComponent } from '../stream-post/stream-post.component'

const STREAMER_API = spotbieGlobals.API + 'api/streamer.service.php'

const HTTP_OPTIONS = {
  withCredentials : true,
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

const report_reason_list = [
  { report_reason_id : 0,  report_reason : 'Hateful Behavior'},
  { report_reason_id : 1,  report_reason : 'Child Abuse'},
  { report_reason_id : 2,  report_reason : 'Incriminating Evidence'},
  { report_reason_id : 3,  report_reason : 'Digital Piracy'},
  { report_reason_id : 4,  report_reason : 'Privacy Concerns'},
  { report_reason_id : 5,  report_reason : 'Animal Cruelty'},
]

@Component({
  selector: 'app-post-report',
  templateUrl: './post-report.component.html',
  styleUrls: ['./post-report.component.css', '../streamer.component.scss']
})
export class PostReportComponent implements OnInit {

  @Input() stream_post : StreamPost

  @Input() window_object : any

  @Output() closeWindow : EventEmitter<any> = new EventEmitter()
  
  @ViewChild('spotbie_post_report_title') spotbie_post_report_title : ElementRef

  @ViewChild('spotbieShareWindow') spotbieShareWindow : ElementRef

  public input_flag : string = "report"

  public bg_color : string

  public report_reason_list = report_reason_list

  private selected_reason = null

  private exe_api_key : string

  public report_sent : boolean = false

  public report_send_msg : string

  private sending_report = false

  constructor(private http : HttpClient) { }

  public closeWindowX() : void {
    this.closeWindow.emit(this.window_object)
  }

  public reportReasonSelect(event : Event, reason) {
    
    const report_reasons = document.getElementsByClassName('spotbie-report-reasons')

    for (let i = 0; i < report_reasons.length; i++) {
      const ele = report_reasons[i] as HTMLElement
      ele.style.backgroundColor = 'rgba(0,0,0,.23)'
    }

    const el = event.srcElement as HTMLElement
    el.style.backgroundColor = 'rgba(0,0,0,.63)'

    this.selected_reason = reason.report_reason_id
  }

  public sendReport() {

    if (this.sending_report == true) return

    this.sending_report = true

    const report_object = { exe_api_key : this.exe_api_key,
                          stream_report_reason : this.selected_reason,
                          stream_post_id : this.stream_post.stream_post_id,
                          exe_stream_action : 'sendReport' }

    this.http.post<HttpResponse>(STREAMER_API, JSON.stringify(report_object), HTTP_OPTIONS)
        .subscribe( resp => {
            // console.log("Settings Response", resp)
            const settings_response = new HttpResponse ({
            status : resp.status,
            message : resp.message,
            full_message : resp.full_message,
            responseObject : resp.responseObject
          })
            this.reportSent(settings_response)
        },
          error => {
            console.log('Error Sending Report : ', error)
    })

  }

  private reportSent(settings_response: HttpResponse) {

    if (settings_response.status == '200') {
      
      if (settings_response.responseObject == 'sent')
        this.report_send_msg = 'Report sent.'
      else if (settings_response.responseObject == 'exists')
        this.report_send_msg = 'Post has been reported.'

      this.report_sent = true

      setTimeout(function() {
        this.report_sent = false
        this.closeWindow()
      }.bind(this), 3500)

    } else {

      this.sending_report = false
      console.log('Error Sending Report : ', settings_response)

    }

    this.spotbie_post_report_title.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }

  ngOnInit() {    
    this.bg_color = localStorage.getItem('spotbie_backgroundColor')
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
    // console.log("Stream to re-post: ", this.stream_post)
  }

  ngAfterViewInit(){
    this.spotbieShareWindow.nativeElement.scrollTop = this.spotbieShareWindow.nativeElement.scrollHeight;
  }

}
