import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core'
import { DataService } from 'src/app/services/spotbie-logged-in/messaging/data.service'
import { MessagingChatService, SpotBieChatInfoParams } from 'src/app/services/spotbie-logged-in/messaging/messaging-chat/messaging-chat.service'
import { Message } from 'src/app/models/messaging-models/message'

@Component({
  selector: 'app-messaging-chat',
  templateUrl: './messaging-chat.component.html',
  styleUrls: ['./messaging-chat.component.css']
})
export class MessagingChatComponent implements OnInit {

  @Input() chat_head_info
  
  @Input() chat_index

  @Output() closeThisChat = new EventEmitter()

  @ViewChild("spotbie_chat_options") spotbie_chat_options

  public chat_title : string

  private exe_api_key : string
  
  public loading : boolean

  public sh_spotbie_chat_options : boolean = false

  public bg_color : string

  public chat_url : string

  public chat_loaded : boolean = false

  public chat_message_list: Array<Message>= []

  public styles = {

    position : 'relative',
    display : '',
    left : '',
    top : '',
    width : '',
    minWidth : '',
    maxWidth : '',
    height : '',
    minHeight : '',
    maxHeight : ''

  }

  constructor(private data_service : DataService,
              private msg_chat_service : MessagingChatService) { }

  public sendMessage(): void{

  }

  public receviveMessage(): void{

  }

  public deleteMessage(): void{

  }
  
  public deleteConversation(): void{

  }

  public videoCallUser(): void{

  }

  public videoCallHangUp(): void{

  }

  public voiceCallUser(): void{

  }

  public voiceCallHangUp(): void{

  }

  public reportMessage(): void{

  }

  private getChatInfo() : void {
    
    let msgs_object : SpotBieChatInfoParams = { 
      exe_api_key : this.exe_api_key, 
      request_action : "getChatInfo", 
      peer_user_id : this.chat_head_info.exe_user_id 
    }

    this.msg_chat_service.getChatInfo(msgs_object).subscribe(
      resp => {
        this.populateChatInfo(resp)
        console.log("Chat Info Response ", resp)
    })

  }

  private populateChatInfo(chat_info : any){

  }

  private getChatMsgs(){

  }

  public chatStyles() : any{

    return { 
      'position' : this.styles.position, 
      'top' : this.styles.top,
      'left' : this.styles.left,
      'width' : this.styles.width, 
      'min-width' : this.styles.minWidth, 
      'max-width' : this.styles.maxWidth,
      'height' : this.styles.height, 
      'min-height' : this.styles.minHeight, 
      'max-height' : this.styles.maxHeight,        
      'background-color' : this.bg_color
    }

  }

  public closeChat(): void {    
    this.closeThisChat.emit(this.chat_index)
  }

  public expandWindow(): void {

    this.styles.position = 'fixed'
    this.styles.top = '0'
    this.styles.left = '0'
    this.styles.display = 'block'
    this.styles.width = '100%'
    this.styles.minWidth = '100%'
    this.styles.maxWidth = '100%'
    this.styles.height = '100%'
    this.styles.minHeight = '100%'
    this.styles.maxHeight = '100%'

  }

  ngOnInit() {

    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
    this.bg_color = localStorage.getItem('spotbie_backgroundColor')

    this.chat_title = this.chat_head_info.exe_username

    this.getChatInfo()
    this.getChatMsgs()

    this.data_service.setupSocketConnection()

  }

  ngOnDestroy(){
    this.data_service.closeConnection()
  }

}