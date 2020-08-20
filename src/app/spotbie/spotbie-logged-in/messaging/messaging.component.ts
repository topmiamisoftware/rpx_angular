import { Component, OnInit, Output, EventEmitter} from '@angular/core'
import { MessagingService } from 'src/app/services/spotbie-logged-in/messaging/messaging.service'
import { Notification } from 'src/app/models/notification-models/notification'
import { ChatHead } from 'src/app/models/messaging-models/chat-head'

const NO_MSGS = "You have no messages."
const NO_UNREAD_MSGS = "You have no unread messages."
const NO_READ_MSGS = "You have no read messages."

const PRESSED_COLOR ='rgba(0,0,0,.5)'

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {

  @Output() closeWindow = new EventEmitter()

  private exe_api_key: string
  
  private exe_user_id: number

  public loading: boolean

  public bg_color: string

  public all_msgs_list: Array<Notification> = []

  private all_msgs: boolean = true
  private read_msgs: boolean = false
  private unread_msgs: boolean = false

  public msgs_ite: number = 0

  public load_more_msgs: boolean = false

  public no_msgs_text: string = NO_MSGS

  public chat_head_ite: number = 0

  public chat_head_list: Array<ChatHead> = []

  public open_chat_list: Array<ChatHead> = []

  public open_chat_id_list: Array<number> = []

  public no_chat_heads: boolean = false

  public load_more_chat_heads: boolean

  public pressed_color = PRESSED_COLOR

  constructor(private messaging_service: MessagingService) { }

  public switchMsgs(action: number): void {

    this.loading = true

    this.all_msgs = false
    this.read_msgs = false
    this.unread_msgs = false

    this.msgs_ite = 0
    this.all_msgs_list = []

    switch (action) {
      case 0:
        this.getAllMessages()
        this.no_msgs_text = NO_MSGS
        break
      case 1:
        this.getUnreadMessages()
        this.no_msgs_text = NO_UNREAD_MSGS
        break
      case 2:
        this.getReadMessages()
        this.no_msgs_text = NO_READ_MSGS
        break
    }

  }

  public styleMsgsTab(ac): any {

    let pressed_color = this.pressed_color

    switch (ac) {

      case 0:
        if (this.all_msgs === true) return { 'background-color' : pressed_color }
        break
      case 1:
        if (this.read_msgs === true) return { 'background-color' : pressed_color }
        break
      case 2:
        if (this.unread_msgs === true) return { 'background-color' : pressed_color }
        break

    }

  }

  public messageStyle(msg): any {

    if (msg.noti_read == '1') return { 'background-color' : this.pressed_color }

  }

  public loadMoreMsgs(): void {

    this.loading = true

    this.load_more_msgs = false

    if (this.all_msgs)
      this.getAllMessages()
    else if (this.unread_msgs)
      this.getUnreadMessages()
    else if (this.read_msgs)
      this.getReadMessages()

  }

  public getAllMessages():void {

    this.loading = true

    this.all_msgs = true

    const msgs_params = { exe_api_key : this.exe_api_key, 
      request_action : 'allMessages',
      exe_msgs_ite : this.msgs_ite 
    }

    this.messaging_service.getAllMessages(msgs_params).subscribe(
      resp => {
        this.populateAllMessages(resp)
      },
      error => {
        console.log("getAllMessages", error)
    })

  }

  private populateAllMessages(all_messages_list : Array<Notification>) {

      all_messages_list.forEach(msg_notification => {

        msg_notification.content = `${msg_notification.user.username} : ${msg_notification.content}`
        this.all_msgs_list.push(msg_notification)

      })

      if (all_messages_list.length > 6) {
        this.msgs_ite = this.msgs_ite + 6
        this.all_msgs_list.pop()
        this.load_more_msgs = true
      } else
        this.load_more_msgs = false

      this.loading = false

  }

  public getReadMessages():void {

    this.read_msgs = true

    const msgs_params = { exe_api_key : this.exe_api_key, 
      request_action : 'readMessages', 
      exe_msgs_ite : this.msgs_ite 
    }

    this.messaging_service.getReadMessages(msgs_params).subscribe(
      resp => {
        this.populateReadMessages(resp)
      },
      error => {
        console.log("getReadMessages", error)
    })

  }

  private populateReadMessages(read_messages_list : Array<Notification>) {

      read_messages_list.forEach(message_notification => {

        message_notification.content = `${message_notification.user.username} : ${message_notification.content}`
        this.all_msgs_list.push(message_notification)

      })

      if (read_messages_list.length > 6) {
        this.msgs_ite = this.msgs_ite + 6
        this.all_msgs_list.pop()
        this.load_more_msgs = true
      } else
        this.load_more_msgs = false

      this.loading = false

  }

  public getUnreadMessages(): void {

    this.unread_msgs = true

    const msgs_params = { exe_api_key : this.exe_api_key, 
      request_action : 'unreadMessages', 
      exe_msgs_ite : this.msgs_ite 
    }

    this.messaging_service.getUnreadMessages(msgs_params).subscribe(
      resp => {
        this.populateUnreadMessages(resp)
      },
      error => {
        console.log("getUnreadMessages", error)
    })

  }

  public populateUnreadMessages(unread_messages_list : Array<Notification>) {

      unread_messages_list.forEach(message_notification => {
        message_notification.content = `${message_notification.user.username} : ${message_notification}`
        this.all_msgs_list.push(message_notification)
      })

      if (unread_messages_list.length > 6) {

        this.msgs_ite = this.msgs_ite + 6
        this.all_msgs_list.pop()
        this.load_more_msgs = true

      } else
        this.load_more_msgs = false

      this.loading = false

  }

  private getChatHeads(): void {

    this.chat_head_list = []

    const msgs_params = { exe_api_key : this.exe_api_key, 
      request_action : 'getChatHeads', 
      exe_msgs_ite : this.chat_head_ite 
    }

    this.messaging_service.getChatHeads(msgs_params).subscribe(
      resp => {
        this.populateChatHeads(resp)
      },
      error => {
        console.log("getChatHeads", error)
    })

  }

  public loadMoreChatHeads() {
    this.load_more_chat_heads = false
    this.getChatHeads()
  }

  private populateChatHeads(chat_head_list : Array<ChatHead>) {

    chat_head_list.forEach(chat_head => {

      this.chat_head_list.push(chat_head)

    })

    if (chat_head_list.length > 6) {
      this.chat_head_ite = this.chat_head_ite + 6
      this.chat_head_list.pop()
      this.load_more_chat_heads = true
    } else {
      this.load_more_chat_heads = false
    }

    this.loading = false

  }



  public openChat(chat_head): void {

    if (this.open_chat_id_list.indexOf(chat_head.exe_user_id) > -1) { return }
    this.open_chat_list.push(chat_head)
    this.open_chat_id_list.push(chat_head.exe_user_id)

  }

  public openChatFromNotification(notification: Notification) {

    let the_id

    (this.exe_user_id == notification.made_to) ? 
      the_id = notification.made_by :
      the_id = notification.made_to

    if(this.open_chat_id_list.indexOf(the_id) > -1) return

    const chat_head = {
      exe_user_default_picture : notification.user.exe_user_default_picture,
      exe_user_id : notification.user.exe_user_id,
      exe_username : notification.user.username
    }

    this.open_chat_list.push(chat_head)
    this.open_chat_id_list.push(the_id)

  }

  public closeChat(chat_index) {

    this.open_chat_list.splice(chat_index, 1)
    this.open_chat_id_list.splice(chat_index, 1)
    
  }

  public closeAllChats() {
    
    this.open_chat_list = []
    this.open_chat_id_list = []

  }

  public closeWindowX() {
    this.closeWindow.emit(null)
  }

  ngOnInit() {

    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
    this.exe_user_id = parseInt(localStorage.getItem('spotbie_userId'))
    this.bg_color = localStorage.getItem('spotbie_backgroundColor')

    if (this.bg_color == '') this.bg_color = 'dimgrey'

    this.getAllMessages()
    this.getChatHeads()

  }

}
