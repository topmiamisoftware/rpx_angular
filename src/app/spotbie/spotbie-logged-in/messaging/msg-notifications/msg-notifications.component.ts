import { Component, OnInit } from '@angular/core'
import * as spotbieGlobals from '../../../../globals'
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http'

const NOTIFICATIONS_API = spotbieGlobals.API + 'api/notifications.service.php'

const HTTP_OPTIONS = {
  withCredentials : true,
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

@Component({
  selector: 'app-msg-notifications',
  templateUrl: './msg-notifications.component.html',
  styleUrls: ['./msg-notifications.component.css']
})
export class MsgNotificationsComponent implements OnInit {

  private exe_api_key: string
  public exe_user_id: string

  public msgs_list = []

  public notifications_ite = 0

  public load_more_notifications = false

  public loading = false

  constructor(private http: HttpClient) { }

  notificationStyle(notification) {
    if (notification.noti_read == '0') {
      return { 'background-color' : 'rgba(0,0,0,.83)'}
    }
  }

  openNotification(notification) {

  }

  loadMoreNotifications() {
    this.loading = true
    this.fetchMsgsNotifications()
  }

  fetchMsgsNotifications() {
    
    this.loading = true
    
    const notifications_object = { exe_api_key : this.exe_api_key, exe_nots_action : 'getMsgsNotifications', exe_nots_ite : this.notifications_ite }
    
    this.http.post<HttpResponse<any>>(NOTIFICATIONS_API, notifications_object, HTTP_OPTIONS)
    .subscribe( resp => {
      this.populateNotifications(resp)
    },
      error => {
        console.log('Fetch Msgs Notifications Error', error)
    })

  }

  populateNotifications(notifications_response: HttpResponse<any>) {

    if (notifications_response.status === 200) {

      const notifications_list = notifications_response.body.responseObject
      
      notifications_list.forEach(notification => {
        notification.text = notification.user_info.exe_username  + ' : ' + unescape(notification.msg)
        this.msgs_list.push(notification)
      })

      if (notifications_list.length > 6) {
        this.notifications_ite = this.notifications_ite + 6
        this.msgs_list.pop()
        this.load_more_notifications = true
      } else
        this.load_more_notifications = false

      this.loading = false

    } else
      console.log('Populate Notifications Error', notifications_response)

  }

  ngOnInit() {
    this.loading = true
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
    this.exe_user_id = localStorage.getItem('spotbie_userId')
    this.fetchMsgsNotifications()
  }

}
