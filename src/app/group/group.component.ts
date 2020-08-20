import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  public bg_color : string;

  public loading : boolean = false;

  constructor() {}
  
  closeWindow(){
    //this.host.groupWindow.open = false;
  }

  ngOnInit() {
    //this.exe_api_key = localStorage.getItem("spotbie_userApiKey");
    this.bg_color = localStorage.getItem("spotbie_backgroundColor");
  }
}