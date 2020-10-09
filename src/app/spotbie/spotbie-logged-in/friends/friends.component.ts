import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  
  @Input() window_obj

  @Output() closeWindow = new EventEmitter

  public bgColor
  public fontColor

  public loading = false

  public friends: boolean
  public pending: boolean
  public blocked: boolean
  public around_me: boolean

  constructor() {}

  public closeWindowX(): void {
    this.closeWindow.emit(this.window_obj)
  }

  public styleFriendsTab(ac) {

    switch (ac) {
      case 0:
        if (this.friends === true) { return {'background-color' : 'rgba(0,0,0,.5)'} }
        break
      case 1:
        if (this.pending === true) { return {'background-color' : 'rgba(0,0,0,.5)'} }
        break
      case 2:
        if (this.blocked === true) { return {'background-color' : 'rgba(0,0,0,.5)'} }
        break
      case 3:
        if (this.around_me === true) { return {'background-color' : 'rgba(0,0,0,.5)'} }
        break
    }
    
  }

  public switchFriends(ac): void {

    this.friends = false
    this.pending = false
    this.blocked = false
    this.around_me = false

    switch (ac) {
      case 0:
        this.myFriends()
        break
      case 1:
        this.myPending()
        break
      case 2:
        this.myBlocked()
        break
      case 3:
        this.myAroundMe()
        break
    }

  }

  myFriends() {
    this.friends = !this.friends
  }

  myPending() {
    this.pending = !this.pending
  }

  myBlocked() {
    this.blocked = !this.blocked
  }

  myAroundMe() {
    this.around_me = !this.around_me
  }

  ngOnInit() {

    this.bgColor = localStorage.getItem('spotbie_backgroundColor')

    if (this.bgColor == '') this.bgColor = 'dimgrey'

    this.myFriends()

  }

}
