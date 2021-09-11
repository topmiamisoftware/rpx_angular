import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { FriendshipsService } from '../../friendships.service'
import { PendingFriendsComponent } from '../pending-friends.component'

@Component({
  selector: 'app-pending-friend-actions',
  templateUrl: './pending-friend-actions.component.html',
  styleUrls: ['./pending-friend-actions.component.css', '../../actions.css']
})
export class PendingFriendActionsComponent implements OnInit {

  @Input() peer

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
              private friendshipService: FriendshipsService,
              private router: Router) { }

  public reportReasonsWindow(): void{
    this.reportReasonsUp = !this.reportReasonsUp
  }

  public report(reportReason: number): void{

    this.loading = true

    this.friendshipService.report(this.peer.user.id, reportReason).subscribe( 
      resp => {
        this.reportCallback(resp)
      }
    )

  }

  private reportCallback(httpResponse: any): void{

      if(httpResponse.message === "success"){

        this.successful_action_title = "User was reported succesfully."
        this.successful_action_description = `You have reported \"${this.peer.user.username}\".`

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

    this.friendshipService.blockUser(this.peer.user.id).subscribe( 
      resp => {
        this.blockUserCallback(resp)
      }
    )

  }

  private blockUserCallback(http_response: any): void{

    if(http_response.message === 'success'){

      this.successful_action_title = "User was blocked."
      this.successful_action_description = `You have blocked \"${this.peer.user.username}\".`

      this.successful_action = true
      
      let friend_index = this.host.pending_list.indexOf(this.peer)
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

    this.friendshipService.acceptFriend(this.peer.user.id).subscribe(
      resp => {
        this.acceptRequestCallback(resp)
      }
    )

  }

  private acceptRequestCallback(http_response: any): void{

    if(http_response.success){

      this.successful_action_title = "Friend request accepted."
      this.successful_action_description = `You and \"${this.peer.user.username}\" are now friends.`

      this.successful_action = true

      let pending_index = this.host.pending_list.indexOf(this.peer)

      this.host.pending_list.splice(pending_index, 1)

      setTimeout(function(){
        this.host.show_pending_actions = false
        this.successful_action = false
      }.bind(this), 2500)

      this.loading = false

    } else
      console.log("acceptRequestCallback", http_response) 

  }

  public cancelRequest(): void{
    
    this.loading = true    
    
    this.friendshipService.cancelRequest(this.peer.user.id).subscribe(
      resp =>{
        this.cancelRequestCallback(resp)
      }
    )

  }
  
  public cancelRequestCallback( httpResponse: any): void{
    
    if(httpResponse.success){

      this.successful_action_title = "Friend request cancelled."
      this.successful_action_description = `Your friendship request to \"${this.peer.user.username }\" was cancelled.`

      this.successful_action = true

      let pending_index = this.host.pending_list.indexOf(this.peer)

      this.host.pending_list.splice(pending_index, 1)

      setTimeout(function(){
        this.host.show_pending_actions = false
        this.successful_action = false
      }.bind(this), 2500)

      this.loading = false  

    } else
      console.log("cancelRequestCallback", httpResponse)

  }

  public viewProfile(): void{
    this.friendshipService.viewProfile(this)
  }

  closeWindow(){
    this.host.show_pending_actions = false
  }

  ngOnInit() {

    console.log("Pending Friend", this.peer)

    this.bgColor = localStorage.getItem('spotbie_backgroundColor')
    this.my_id = localStorage.getItem('spotbie_userId')
      
  }

}