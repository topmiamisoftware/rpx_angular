import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FriendshipsService } from '../../friendships.service'
import { AroundMeComponent } from '../around-me.component'

@Component({
  selector: 'app-around-me-actions',
  templateUrl: './around-me-actions.component.html',
  styleUrls: ['./around-me-actions.component.css', '../../actions.css']
})
export class AroundMeActionsComponent implements OnInit {
  
  @Input() around_me_user

  @Output() closeActions = new EventEmitter()

  public loading : boolean = false
  
  public successful_action: boolean = false

  public successful_action_title: string

  public successful_action_description: string 

  public reportReasonList: Array<any> = [
    { name : "Mature Content", id : 0 },
    { name : "Copyright", id : 1 },
    { name : "Impersonation", id : 2 }
  ]

  public reportReasonsUp: boolean = false

  public bgColor: string

  constructor(private host : AroundMeComponent,
              private friendshipService: FriendshipsService) { }

  public blockUser(): void{

    this.loading = true

    this.friendshipService.blockUser(this.around_me_user.id).subscribe( 
      resp => {
        this.blockUserCallback(resp)
      }
    )

  }

  private blockUserCallback(http_response: any): void{

      if(http_response.message === 'success'){

        this.successful_action_title = "User was blocked."
        this.successful_action_description = `You have blocked \"${this.around_me_user.username}\".`

        this.successful_action = true
        
        let friend_index = this.host.around_me_list.indexOf(this.around_me_user)
        this.host.around_me_list.splice(friend_index, 1)        

        setTimeout(function(){
          this.closeActionsx()
          this.successful_action = false
        }.bind(this), 2500)

        this.loading = false  

      } else
        console.log("blockUserCallback", http_response)
      
  }

  public unfriend(): void{

      this.loading = true

      this.friendshipService.unfriend(this.around_me_user.id).subscribe( 
        resp => {
          this.unfriendCallback(resp)
        }
      )

  }

  private unfriendCallback(http_response: any): void{

      if(http_response.message === "success"){

        this.successful_action_title = "User was unfriended."
        this.successful_action_description = `You have unfriended \"${this.around_me_user.username}\".`

        this.successful_action = true

        let friend_index = this.host.around_me_list.indexOf(this.around_me_user)
        this.host.around_me_list.splice(friend_index, 1)

        setTimeout(function(){
            this.closeActionsx()
            this.successful_action = false
        }.bind(this), 2500)

        this.loading = false  

      } else
        console.log("unfriendCallback", http_response) 

  }
  
  public reportReasonsWindow(): void{
    this.reportReasonsUp = !this.reportReasonsUp
  }

  public report(reportReason: number): void{

    this.loading = true

    this.friendshipService.report(this.around_me_user.id, reportReason).subscribe( 
      resp => {
        this.reportCallback(resp)
      }
    )

  }

  private reportCallback(httpResponse: any): void{

    if(httpResponse.message === "success"){

      this.successful_action_title = "User was reported succesfully."
      this.successful_action_description = `You have reported \"${this.around_me_user.username}\".`

      this.successful_action = true

      setTimeout(function(){
          this.successful_action = false
      }.bind(this), 2500)

      this.loading = false  
      this.reportReasonsWindow()
      
    } else
      console.log("reportCallback", httpResponse)

  }

  public closeActionsx(): void{
    this.closeActions.emit(null)
  }

  ngOnInit() { 

    this.bgColor = localStorage.getItem('spotbie_backgroundColor')

  }
  
}