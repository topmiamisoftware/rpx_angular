import { Component, OnInit, Input } from '@angular/core'
import { AroundMeComponent } from '../around-me.component'

@Component({
  selector: 'app-around-me-actions',
  templateUrl: './around-me-actions.component.html',
  styleUrls: ['./around-me-actions.component.css']
})
export class AroundMeActionsComponent implements OnInit {
  
  @Input() around_me_user
  
  public loading : boolean = false
  public isDesktop : boolean

  constructor(private host : AroundMeComponent) { }

  report(){
    console.log("report")
  }

  block(){
    console.log("block")
  }

  unblock(){
    console.log("unblock")
  }

  closeWindow(){
    this.host.show_around_me_actions = false
  }

  ngOnInit() { }
  
}