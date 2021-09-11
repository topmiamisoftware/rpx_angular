import { Component, OnInit} from '@angular/core'
import * as spotbieGlobals from '../../../../globals'
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http'
import { NotificationsComponent } from '../notifications.component'
import { Router } from '@angular/router'

const NOTIFICATIONS_API = spotbieGlobals.API + 'api/notifications.service.php'

const HTTP_OPTIONS = {
  withCredentials : true,
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

@Component({
  selector: 'app-friend-notifications',
  templateUrl: './friend-notifications.component.html',
  styleUrls: ['./friend-notifications.component.css']
})
export class FriendNotificationsComponent implements OnInit {

  private exe_api_key: string
  public exe_user_id: string

  public friends_notifications_list = []

  public notifications_ite : number = 0

  public are_now_friends : boolean = false

  public load_more_notifications : boolean = false

  public friendship_in_q

  public no_notis : boolean = false

  public loading : boolean = false

  constructor(private http: HttpClient,
              private host: NotificationsComponent,
              private router: Router) { }
  notificationStyle(notification) {
    if (notification.is_new == '1') {
      return { 'background-color' : 'rgba(0,0,0,.83)'}
    }
  }
  openNotification(notification) {
    switch (notification.relation) {
      case '0':
          // User must accept friend request
          // open accept or decline friend request.
          const friend_action_table = document.getElementById('spotbieFriendNotification' + notification.relation_id)
          friend_action_table.style.display = 'inline-block'
          break
      case '1':
          // User has accepted friend request
          // take user to other user's homepage.
          this.viewProfile(notification)
          break
      case '2':
          // Users both aware that they are friends
          // take user to other user's homepage.
          this.viewProfile(notification)
          break
      default:
    }
  }

  fetchFriendsNotifications() {

    const notifications_object = { exe_api_key : this.exe_api_key, exe_nots_action : 'getFriendsNotifications', exe_nots_ite : this.notifications_ite }

    this.http.post<HttpResponse<any>>(NOTIFICATIONS_API, notifications_object, HTTP_OPTIONS)
    .subscribe( resp => {
      this.populateNotifications(resp)
    },
      error => {
        console.log('Fetch Friends Notifications Error', error)
    })

  }

  populateNotifications(notifications_response : HttpResponse<any>) {

    if (notifications_response.status === 200) {

      const notifications_list = notifications_response.body.responseObject

      notifications_list.forEach(notification => {

        switch (notification.relation) {
            case 'friend_req':
                // User must accept friend request
                notification.text = notification.user_made + ' has sent you a friendship request.'
                break
            case 'accepted_friend':
                // User has accepted friend request
                if (this.exe_user_id == notification.made_by) {
                  notification.text = notification.user_made + ' has accepted your friendship request.'
                } else {
                  notification.text = 'You have accepted ' + notification.user_made + '\'s friend request.'
                }
                break
            case 'now_friends':
                // Users both aware that they are friends
                notification.text = 'You and ' + notification.user_made + ' are now friends.'
                break
            default:
        }
        
        this.friends_notifications_list.push(notification)

      })

      if (notifications_list.length > 6) {
        this.notifications_ite = this.notifications_ite + 6
        this.friends_notifications_list.pop()
        this.load_more_notifications = true
      } else
        this.load_more_notifications = false

      if (this.friends_notifications_list.length == 0)
        this.no_notis = true

      this.loading = false

    } else
      console.log('Friends Notifications Error : ', notifications_response)

  }

  loadMoreNotifications() {
    this.loading = true
    this.fetchFriendsNotifications()
  }

  viewProfile(notification) {
    this.router.navigate(['/user-profile/' + notification.username])
  }

  acceptRequest(notification) {

    this.loading = true

    const notifications_object = { exe_api_key : this.exe_api_key, relation_id : notification.relation_id, exe_nots_action : 'acceptFriendRequest', exe_nots_ite : this.notifications_ite }
    
    this.http.post<HttpResponse<any>>(NOTIFICATIONS_API, notifications_object, HTTP_OPTIONS)
    .subscribe( resp => {
      this.acceptRequestCallback(resp)
    },
    error => {
      console.log('Accept Friend Request Error', error)
    })

  }

  acceptRequestCallback(notifications_response: HttpResponse<any>) {

    if (notifications_response.status === 200) {

      this.are_now_friends = true
      this.friendship_in_q = notifications_response.body.responseObject
      this.loading = false

    } else
      console.log('Friends Decline Request Error : ', notifications_response)

  }

  declineRequest(notification) {

    const notifications_object = { exe_api_key : this.exe_api_key, exe_nots_action : 'declineFriendRequest', exe_nots_ite : this.notifications_ite }
    
    this.http.post<HttpResponse<any>>(NOTIFICATIONS_API, notifications_object, HTTP_OPTIONS)
    .subscribe( resp => {
      this.declineRequestCallback(resp)
    },
    error => {
      console.log('Friends Decline Request Error', error)
    })

  }

  declineRequestCallback(notifications_response: HttpResponse<any>) {

    if (notifications_response.status === 200) {
      this.are_now_friends = true
      this.friendship_in_q = notifications_response.body.responseObject
      this.loading = false
    } else
      console.log('Friends Decline Request Error', notifications_response)

  }

  ngOnInit() {
    this.loading = true
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
    this.exe_user_id = localStorage.getItem('spotbie_userId')
    this.fetchFriendsNotifications()
  }

}
