import { Component, OnInit } from '@angular/core';
import { MenuLoggedInComponent } from '../menu-logged-in.component';

@Component({
  selector: 'app-matcher',
  templateUrl: './matcher.component.html',
  styleUrls: ['./matcher.component.css']
})
export class MatcherComponent implements OnInit {
  
  public bg_color : string;

  constructor(private host : MenuLoggedInComponent) { }

  closeWindow(){
    this.host.matcherWindow.open = false;
  }

  ngOnInit() {
    this.bg_color = localStorage.getItem('spotbie_backgroundColor');
  }

}
