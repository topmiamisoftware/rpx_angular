import { Component, OnInit } from '@angular/core';
import { MenuLoggedInComponent } from '../menu-logged-in.component';

@Component({
  selector: 'app-driver-mode',
  templateUrl: './driver-mode.component.html',
  styleUrls: ['./driver-mode.component.css']
})
export class DriverModeComponent implements OnInit {

  public bg_color : string;

  constructor(private host : MenuLoggedInComponent) { }

  closeWindow(){
    this.host.drivingWindow.open = false;
  }

  ngOnInit() {
    this.bg_color = localStorage.getItem('spotbie_backgroundColor');
  }

}
