import { Component, OnInit } from '@angular/core';
import { MenuLoggedInComponent } from '../../menu-logged-in.component';

@Component({
  selector: 'app-my-places',
  templateUrl: './my-places.component.html',
  styleUrls: ['./my-places.component.css']
})
export class MyPlacesComponent implements OnInit {

  public bgColor;
  public fontColor;

  constructor(private host: MenuLoggedInComponent) { }

  public closeWindow() {
    this.host.closeWindow(this.host.myPlacesWindow);
  }

  ngOnInit() {

    this.bgColor = localStorage.getItem('spotbie_backgroundColor');
    if (this.bgColor == '') { this.bgColor = 'dimgrey'; }

    this.fontColor = localStorage.getItem('spotbie_fontColor');
    if (this.fontColor == '') { this.fontColor = 'white'; }

  }

}
