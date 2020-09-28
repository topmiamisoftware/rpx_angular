import { Component, OnInit } from '@angular/core'
import * as spotbieGlobals from '../../../../globals'
import { FriendshipsService } from 'src/app/services/friendships.service'

@Component({
  selector: 'app-around-me',
  templateUrl: './around-me.component.html',
  styleUrls: ['../friends.component.css', './around-me.component.css']
})
export class AroundMeComponent implements OnInit {

  private page: number = 1

  public around_me_list = [] 

  public load_more_around_me: boolean = false

  public loading: boolean = false

  public no_spotbie_around_me: boolean = false

  public show_around_me_actions: boolean = false

  public current_around_me

  public loc_x: number
  public loc_y: number

  constructor(private friendship_service: FriendshipsService){}

  public setCurrentAroundMe(friend): void{
    this.current_around_me = friend
    this.show_around_me_actions = true    
  }

  public initAroundMe(): void{    

    this.loading = true

    let call_friends_obj = { 
      loc_x: this.loc_x,
      loc_y: this.loc_y,
      page: this.page
    }

    this.friendship_service.aroundMe(call_friends_obj).subscribe(
      resp => {
        this.aroundMeCallback(resp)
      },
      error => {
        console.log("initAroundMe", error)
      }
    ) 

  }

  private aroundMeCallback(httpResponse: any){

    console.log("aroundMeCallback", httpResponse)

    if(httpResponse.message === "success"){      

      const current_page = httpResponse.around_me_friend_list.current_page
      const last_page = httpResponse.around_me_friend_list.last_page

      httpResponse.around_me_friend_list.data.forEach(friend => {
        friend = friend
        this.around_me_list.push(friend)
      })      

      if(current_page < last_page){
        this.page++
        this.load_more_around_me = true
      } else
        this.load_more_around_me = false

      if(this.around_me_list.length == 0) this.no_spotbie_around_me = true

      this.loading = false

    } else
      console.log("arouneMeCallback: ", httpResponse)
    
  }

  public getLocation(): void{
  
    if (window.navigator.geolocation)
      window.navigator.geolocation.getCurrentPosition(this.savePosition.bind(this))
  
  }

  private savePosition(position): void {

    this.loc_x = position.coords.latitude
    this.loc_y = position.coords.longitude
    this.initAroundMe()
  
  }

  public loadMoreAroundMe(): void{
    this.getLocation()
  }

  ngOnInit() {
    this.getLocation()  
  }

}