import { Component, OnInit } from '@angular/core';
import { LogInComponent } from '../log-in/log-in.component';
import { User } from '../../../models/user';

@Component({
  selector: 'app-last-logged',
  templateUrl: './last-logged.component.html',
  styleUrls: ['./last-logged.component.css']
})
export class LastLoggedComponent implements OnInit {

  public current_login_photo : any;
  public current_login_username : any;
  public last_logged_user_list : any;

  public bg_color : string = '#353535';
  public font_color : string = 'white';

  public newUser = {  exe_user_default_picture : '../assets/images/user.png', exe_username : '' };

  constructor(private host : LogInComponent) {}

  public closeWindow() : void {
    this.host.lastLoggedWindow.open = false;
  }

  public fetchUserToLogin(user : User) : void{
    this.host.logInForm.get('spotbieUsername').setValue(user.username);
    this.host.current_login_photo = user.exe_user_default_picture;
    this.closeWindow();
  }

  public fetchUserToLoginNew() : void {
    this.host.logInForm.get('spotbieUsername').setValue(this.newUser.exe_username);
    this.host.current_login_photo = this.newUser.exe_user_default_picture;
    this.closeWindow();
  }

  ngOnInit() {

    const last_logged_user_array_string = localStorage.getItem('spotbie_loggedInUsers');

    if (last_logged_user_array_string != null)
      this.last_logged_user_list = JSON.parse(last_logged_user_array_string);
    else
      this.last_logged_user_list = '';

    this.bg_color = this.host.bg_color;

  }

}