import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { UserauthService } from '../services/userauth.service'

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  @Output() openSettingsEvt = new EventEmitter()

  public arrow_on: boolean = false

  public bg_image: string

  public userId: string

  public loggedIn: boolean = false

  constructor(private userAuthService: UserauthService){}

  setcurrentUserBgImage(evt: any) {
    this.bg_image = evt.user_bg
  }

  async ngOnInit(){
    const response = await this.userAuthService.checkIfLoggedIn()
    this.userId = response.user_id 
  }

  ngAfterViewInit() {}

}
