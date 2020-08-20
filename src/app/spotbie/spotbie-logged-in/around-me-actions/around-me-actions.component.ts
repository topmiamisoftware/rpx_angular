import { Component, OnInit, Input } from '@angular/core';
import { AroundMeComponent } from '../around-me/around-me.component';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-around-me-actions',
  templateUrl: './around-me-actions.component.html',
  styleUrls: ['./around-me-actions.component.css']
})
export class AroundMeActionsComponent implements OnInit {
  
  @Input() around_me_user;
  
  public loading : boolean = false;

  public isMobile : boolean;

  public isDesktop : boolean;

  constructor(private host : AroundMeComponent, private deviceDetector : DeviceDetectorService) { }

  report(){
    console.log("report");
  }

  block(){
    console.log("block");
  }

  unblock(){
    console.log("unblock");
  }

  closeWindow(){
    this.host.show_around_me_actions = false;
  }

  ngOnInit() {
    //console.log("Blocked User Input : ", this.around_me_user);
    if(this.deviceDetector.isMobile())
      this.isMobile = true;
    else
      this.isDesktop = true;      
  }
}