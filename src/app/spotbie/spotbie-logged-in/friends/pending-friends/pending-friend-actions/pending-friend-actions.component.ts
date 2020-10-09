import { Component, OnInit, Input } from '@angular/core'
import * as spotbieGlobals from '../../../../../globals'
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { PendingFriendsComponent } from '../pending-friends.component'
import { FriendshipsService } from 'src/app/services/friendships.service'

const FRIENDS_API = spotbieGlobals.API + "api/friends_general.service.php"

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}
@Component({
  selector: 'app-pending-friend-actions',
  templateUrl: './pending-friend-actions.component.html',
  styleUrls: ['./pending-friend-actions.component.css', '../../actions.css']
})
export class PendingFriendActionsComponent implements OnInit {

  @Input() pending_friend

  public loading: boolean = false

  public successful_action: boolean = false

  public successful_action_title: string

  public successful_action_description: string

  public my_id: string

  public isMobile: boolean
  public isDesktop: boolean

  public reportReasonList: Array<any> = [
    { name : "Mature Content", id : 0 },
    { name : "Copyright", id : 1 },
    { name : "Impersonation", id : 2 }
  ]

  public reportReasonsUp: boolean = false

  public bgColor: string
  
  constructor(private host: PendingFriendsComponent,
              private http: HttpClient,
              private friendshipService: FriendshipsService) { }

  public reportReasonsWindow(): void{
    this.reportReasonsUp = !this.reportReasonsUp
  }

  public report(reportReason: number): void{

    this.loading = true

    this.friendshipService.report(this.pending_friend.user.id, reportReason).subscribe( 
        resp => {
        this.reportCallback(resp)
        },
        error => {
        console.log("report", error)
        }
    )

  }

  private reportCallback(httpResponse: any): void{

      if(httpResponse.message === "success"){

          this.successful_action_title = "User was reported succesfully."
          this.successful_action_description = `You have reported \"${this.pending_friend.user.username}\".`

          this.successful_action = true

          setTimeout(function(){
              this.successful_action = false
          }.bind(this), 2500)

          this.loading = false  

      } else
          console.log("reportCallback", httpResponse)

  }

  public blockUser(): void{

    this.loading = true

    this.friendshipService.blockUser(this.pending_friend.user.id).subscribe( 
      resp => {
          this.blockUserCallback(resp)
      },
      error => {
          console.log("blockUser", error)
      }
    )

  }

  private blockUserCallback(http_response: any): void{

    if(http_response.message === 'success'){

      this.successful_action_title = "User was blocked."
      this.successful_action_description = `You have blocked \"${this.pending_friend.user.username}\".`

      this.successful_action = true
      
      let friend_index = this.host.pending_list.indexOf(this.pending_friend)
      this.host.pending_list.splice(friend_index, 1)

      setTimeout(function(){
          this.host.show_friend_actions = false
          this.successful_action = false
      }.bind(this), 2500)

      this.loading = false  

    } else
      console.log("blockUserCallback", http_response)
      
  }

  public acceptRequest(): void{

    this.loading = true

    this.friendshipService.acceptFriend(this.pending_friend.user.id).subscribe(
      resp => {
        this.acceptRequestCallback(resp)
      }
    )

  }

  private acceptRequestCallback(http_response: any): void{

    if(http_response.message === "success"){

      this.successful_action_title = "Friend request accepted."
      this.successful_action_description = `You and \"${this.pending_friend.user.username}\" are now friends.`

      this.successful_action = true

      let pending_index = this.host.pending_list.indexOf(this.pending_friend)

      this.host.pending_list.splice(pending_index, 1)

      setTimeout(function(){
        this.host.show_pending_actions = false
        this.successful_action = false
      }.bind(this), 2500)

      this.loading = false

    } else
      console.log("Accept Request Callback Error", http_response) 

  }

  public cancelRequest(): void{
    
    this.loading = true    
    
    let call_friends_obj = { exe_friend_id: this.pending_friend.user.id }
    
    this.http.post<HttpResponse<any>>(FRIENDS_API, call_friends_obj, HTTP_OPTIONS)
    .subscribe( resp => {
      this.cancelRequestCallback(resp)
    },
      error => {
        console.log("Cancel Friend Request Error", error)
    })

  }
  
  public cancelRequestCallback( http_response: HttpResponse<any>): void{
    
    if(http_response.status === 200 && http_response.body.responseObject == "cancelled"){

      this.successful_action_title = "Friend request cancelled."
      this.successful_action_description = "Your friendship request to \"" + this.pending_friend.user.username + "\" was cancelled."    

      this.successful_action = true

      let pending_index = this.host.pending_list.indexOf(this.pending_friend)

      this.host.pending_list.splice(pending_index, 1)

      setTimeout(function(){
        this.host.show_pending_actions = false
        this.successful_action = false
      }.bind(this), 2500)

      this.loading = false  

    } else
      console.log("Cancel Request Callback Error", http_response)

  }

  closeWindow(){
    this.host.show_pending_actions = false
  }

  ngOnInit() {

    this.bgColor = localStorage.getItem('spotbie_backgroundColor')

    this.my_id = localStorage.getItem('spotbie_userId')
      
  }

}