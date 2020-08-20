import { Component, OnInit } from '@angular/core';
import { MenuLoggedInComponent } from '../menu-logged-in.component';

@Component({
  selector: 'app-location-saver',
  templateUrl: './location-saver.component.html',
  styleUrls: ['./location-saver.component.css']
})
export class LocationSaverComponent implements OnInit {

  public bg_color : string;

  constructor(private host : MenuLoggedInComponent) { }

  closeWindow(){
    this.host.locationSaverWindow.open = false;
  }

  ngOnInit() {
    this.bg_color = localStorage.getItem('spotbie_backgroundColor');
  }

}
