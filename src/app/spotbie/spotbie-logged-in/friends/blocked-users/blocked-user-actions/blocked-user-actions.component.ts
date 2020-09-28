import { Component, OnInit, Input } from '@angular/core'
import { DeviceDetectorService } from 'ngx-device-detector'
import { HttpResponse } from '@angular/common/http'
import { BlockedUsersComponent } from '../blocked-users.component'
import { FriendshipsService } from 'src/app/services/friendships.service'

@Component({
  selector: 'app-blocked-user-actions',
  templateUrl: './blocked-user-actions.component.html',
  styleUrls: ['./blocked-user-actions.component.css']
})
export class BlockedUserActionsComponent implements OnInit {

  @Input() blocked_user

  public loading: boolean = false

  public successful_action: boolean = false

  public successful_action_title: string

  public successful_action_description: string
  
  public questions_answer: boolean

  public isMobile: boolean

  public isDesktop: boolean

  constructor(private host: BlockedUsersComponent,
              private friendshipServices: FriendshipsService,
              private  deviceDetector: DeviceDetectorService) { }
  
  report(){}

  public unblockUser(): void{

    this.loading = true

    this.friendshipServices.unblockUser(this.blocked_user.user_info.exe_user_id).subscribe(
      resp =>{
        this.unblockUserCallback(resp)
      }
    )

  }

  public unblockUserCallback(http_response: any){

    if(http_response.message === "success"){

      this.successful_action_title = "User was unblocked."
      this.successful_action_description = `You have unblocked \"${this.blocked_user.user_info.exe_username}\".`
      this.successful_action = true

      let pending_index = this.host.blocked_list.indexOf(this.blocked_user)

      this.host.blocked_list.splice(pending_index, 1)

      setTimeout(function(){
        this.host.show_blocked_actions = false
        this.successful_action = false
      }.bind(this), 2500)

      this.loading = false  

    } else
      console.log("unblockUserCallback", http_response)

  }

  public friendUser(): void{

    this.loading = true

    this.friendshipServices.befriend(this.blocked_user.user_info.exe_user_id).subscribe(
      resp =>{
        this.friendUserCallback(resp)
      }
    )

  }

  public friendUserCallback(http_response: any): void{

    if(http_response.message === 'success'){

        this.successful_action_title = "User friendship requested."
        this.successful_action_description = `You have requested to be friends with \"${this.blocked_user.user_info.exe_username}\".`

        this.successful_action = true

        let pending_index = this.host.blocked_list.indexOf(this.blocked_user)
        this.host.blocked_list.splice(pending_index, 1)

        setTimeout(function(){
          this.host.show_blocked_actions = false
          this.successful_action = false
        }.bind(this), 2500)  

        this.loading = false

    } else
      console.log("friendUserCallback", http_response)

  }

  public friendRequested(): void{

      this.questions_answer = false

      this.successful_action_title = "User friendship requested."
      this.successful_action_description = `You have requested to be friends with \"${this.blocked_user.user_info.exe_username}\".`
      this.successful_action = true

      let pending_index = this.host.blocked_list.indexOf(this.blocked_user)
      this.host.blocked_list.splice(pending_index, 1)

      setTimeout(function(){
        this.host.show_blocked_actions = false
        this.successful_action = false
      }.bind(this), 2500)

      this.loading = false

  }

  public closeWindow(): void{
    this.host.show_blocked_actions = false
  }

  public closeChildWindow(window_to_close): void{
    window_to_close = false
  }

  ngOnInit() {

    if(this.deviceDetector.isMobile())
      this.isMobile = true
    else
      this.isDesktop = true    

  }

}