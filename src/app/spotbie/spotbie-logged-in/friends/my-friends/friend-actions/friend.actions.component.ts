import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { FriendshipsService } from '../../friendships.service'
import { MyFriendsComponent } from '../my-friends.component'

@Component({
  selector: 'app-friend-actions',
  templateUrl: './friend-actions.component.html',
  styleUrls: ['./friend-actions.component.css', '../../actions.css']
})
export class FriendActionsComponent implements OnInit {

    @Input() peer

    public loading: boolean = false

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

    constructor(private host: MyFriendsComponent,
                private friendshipService: FriendshipsService,
                private router: Router) { }


    public closeWindow(): void{
        this.host.show_friend_actions = false
    }

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

            this.reportReasonsWindow()
            this.loading = false  

        } else
            console.log("reportCallback", httpResponse)

    }

    public blockUser(): void{

        this.loading = true

        this.friendshipService.blockUser(this.peer.user.id).subscribe( 
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
        this.successful_action_description = `You have blocked \"${this.peer.user.username}\".`

        this.successful_action = true
        
        let friend_index = this.host.friends_list.indexOf(this.peer)
        this.host.friends_list.splice(friend_index, 1)

        setTimeout(function(){
            this.host.show_friend_actions = false
            this.successful_action = false
        }.bind(this), 2500)

        this.loading = false  

        } else
            console.log("blockUserCallback", http_response)
        
    }
  
    public unfriend(): void{

        this.loading = true

        this.friendshipService.unfriend(this.peer.user.id).subscribe( 
            resp => {
                this.unfriendCallback(resp)
            }
        )

    }

    private unfriendCallback(http_response: any): void{

        if(http_response.success){

            this.successful_action_title = "User was unfriended."
            this.successful_action_description = `You have unfriended \"${this.peer.user.username}\".`

            this.successful_action = true

            let friend_index = this.host.friends_list.indexOf(this.peer)
            this.host.friends_list.splice(friend_index, 1)

            setTimeout(function(){
                this.host.show_friend_actions = false
                this.successful_action = false
            }.bind(this), 2500)

            this.loading = false  

        } else
            console.log("unfriendCallback", http_response) 

    }

    public viewProfile(): void{
        this.friendshipService.viewProfile(this)
    }

    ngOnInit() {
        
        this.bgColor = localStorage.getItem('spotbie_backgroundColor')

    }

}