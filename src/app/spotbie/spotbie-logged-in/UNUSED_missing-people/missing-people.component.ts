import { Component, OnInit } from '@angular/core';
import { MenuLoggedInComponent } from '../menu-logged-in.component';

@Component({
  selector: 'app-missing-people',
  templateUrl: './missing-people.component.html',
  styleUrls: ['./missing-people.component.css']
})
export class MissingPeopleComponent implements OnInit {

  public bg_color : string;

  constructor(private host : MenuLoggedInComponent) { }

  closeWindow(){
    //this.host.missingWindow.open = false;
  }

  ngOnInit() {
    this.bg_color = localStorage.getItem('spotbie_backgroundColor');
  }

}
