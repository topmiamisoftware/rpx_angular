import { Component, OnInit } from '@angular/core';
import { MenuLoggedOutComponent } from '../spotbie-logged-out/menu-logged-out.component';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {

  public bgColor;
  public fontColor;

  constructor(private host: MenuLoggedOutComponent) { }

  public closeWindow() {
    this.host.closeWindow(this.host.featuresWindow);
  }

  ngOnInit() {

    this.bgColor = localStorage.getItem('spotbie_backgroundColor');
    if (this.bgColor == '') { this.bgColor = '#1d1d1d'; }

    this.fontColor = localStorage.getItem('spotbie_fontColor');
    if (this.fontColor == '') { this.fontColor = 'white'; }

  }

}