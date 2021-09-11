import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FriendshipsService } from '../../spotbie-logged-in/UNUSED_friends/friendships.service';

@Component({
  selector: 'app-friend-actions',
  templateUrl: './friend-actions.component.html',
  styleUrls: ['./friend-actions.component.css', '../../spotbie-logged-in/friends/actions.css']
})
export class FriendActionsComponent implements OnInit {

  @Input() publicProfileInfo

  @Output() closeActions = new EventEmitter()

  public successful_action: boolean = false

  public successful_action_title: string

  public successful_action_description: string 

  public reportReasonList: Array<any> = [
    { name : "Mature Content", id : 0 },
    { name : "Copyright", id : 1 },
    { name : "Impersonation", id : 2 }
  ]

  public relationship: number = null

  public reportReasonsUp: boolean = false

  public bgColor: string

  public loading: boolean = false

  public isLoggedIn: string = '0'

  constructor(private friendshipService: FriendshipsService) { }

  public blockUser(): void{

    this.loading = true

    this.friendshipService.blockUser(this.publicProfileInfo.user.id).subscribe( 
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
    this.successful_action_description = `You have blocked \"${this.publicProfileInfo.user.username}\".`

    this.successful_action = true

    setTimeout(function(){
      this.closeActionsx()
      this.successful_action = false
    }.bind(this), 2500)

    this.loading = false  

    } else
      console.log("blockUserCallback", http_response)

  }

  public unblockUser(): void{

    this.loading = true

    this.friendshipService.unblockUser(this.publicProfileInfo.user.id).subscribe( 
      resp => {
        this.unblockUserCallback(resp)
      },
      error => {
        console.log("unblockUser", error)
      }
    )

  }

  private unblockUserCallback(httpResponse: any): void{

    if(httpResponse.success){

    this.successful_action_title = "User was unblocked."
    this.successful_action_description = `You have unblocked \"${this.publicProfileInfo.user.username}\".`

    this.successful_action = true

    setTimeout(function(){
      this.closeActionsx()
      this.successful_action = false
    }.bind(this), 2500)

    this.loading = false  

    } else
      console.log("unblockUserCallback", httpResponse)

  }

  public cancelRequest(): void{
    
    this.loading = true    
    
    this.friendshipService.cancelRequest(this.publicProfileInfo.user.id).subscribe(
      resp => {
        this.cancelRequestCallback(resp)
      }
    )

  }
  
  public cancelRequestCallback(httpResponse: any): void{
    
    if(httpResponse.success){

      this.successful_action_title = "Friend request cancelled."
      this.successful_action_description = `Your friendship request to \"${this.publicProfileInfo.user.username}\" was cancelled.`    

      this.successful_action = true

      setTimeout(function(){
        this.closeActionsx()
        this.successful_action = false
      }.bind(this), 2500)

      this.loading = false  

    } else
      console.log("Cancel Request Callback Error", httpResponse)

  }

  public addFriend(): void{

    this.loading = true

    this.friendshipService.befriend(this.publicProfileInfo.user.id).subscribe( 
      resp => {
        this.addFriendCallback(resp)
      },
      error => {
        console.log("addFriend", error)
      }
    )

  }

  private addFriendCallback(httpResponse: any): void{

    if(httpResponse.success){

      this.successful_action_title = "Friend request sent."
      this.successful_action_description = `You have sent \"${this.publicProfileInfo.user.username}\" a friend request.`

      this.successful_action = true

      setTimeout(function(){
        this.closeActionsx()
        this.successful_action = false
      }.bind(this), 2500)

      this.loading = false  

    } else
      console.log("addFriendCallback", httpResponse) 

  }

  public unfriend(): void{

    this.loading = true

    this.friendshipService.unfriend(this.publicProfileInfo.user.id).subscribe( 
      resp => {
        this.unfriendCallback(resp)
      },
      error => {
        console.log("unfriend", error)
      }
    )

  }

  private unfriendCallback(httpResponse: any): void{

    if(httpResponse.success){

      this.successful_action_title = "User was unfriended."
      this.successful_action_description = `You have unfriended \"${this.publicProfileInfo.user.username}\".`

      this.successful_action = true

      setTimeout(function(){
        this.closeActionsx()
        this.successful_action = false
      }.bind(this), 2500)

      this.loading = false  

    } else
      console.log("unfriendCallback", httpResponse) 

  }

  public reportReasonsWindow(): void{
    this.reportReasonsUp = !this.reportReasonsUp
  }

  public report(reportReason: number): void{

    this.loading = true

    this.friendshipService.report(this.publicProfileInfo.user.id, reportReason).subscribe( 
      resp => {
        this.reportCallback(resp)
      }
    )

  }

  private reportCallback(httpResponse: any): void{

    if(httpResponse.message === "success"){

      this.successful_action_title = "User was reported succesfully."
      this.successful_action_description = `You have reported \"${this.publicProfileInfo.user.username}\".`

      this.successful_action = true

      setTimeout(function(){
        this.successful_action = false
      }.bind(this), 2500)

      this.loading = false  
      this.reportReasonsWindow()

    } else
      console.log("reportCallback", httpResponse)
      
  }

  public checkRelationship(): void{

    this.friendshipService.checkRelationship(this.publicProfileInfo.user.id).subscribe(
      resp => {
        this.relationship = resp.relationship
      }
    )

  }

  public closeActionsx(): void{
    this.closeActions.emit(null)
  }

  ngOnInit() {   

    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn')

    if(this.isLoggedIn == '1') this.checkRelationship()
    
    this.bgColor = this.publicProfileInfo.web_options.bg_color

    console.log("Public Profile Info", this.publicProfileInfo)

  }

}
