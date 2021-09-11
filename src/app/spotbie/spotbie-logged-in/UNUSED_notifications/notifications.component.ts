import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  public notifications = 0;

  public bgColor;
  public fontColor;

  public friends_nots = true;
  public msgs_nots = false;
  public stream_nots = false;
  public tag_nots = false;
  public all_notis = false;

  public notifications_open: boolean;

  constructor() { }

  public notiTabStyles(ac) {
    switch (ac) {
      case 0:
        if (this.friends_nots === true) { return {'background-color' : 'rgba(0,0,0,.5)'}; }
        break;
      case 1:
        if (this.msgs_nots === true) { return {'background-color' : 'rgba(0,0,0,.5)'}; }
        break;
      case 2:
        if (this.stream_nots === true) { return {'background-color' : 'rgba(0,0,0,.5)'}; }
        break;
      case 3:
        if (this.tag_nots === true) { return {'background-color' : 'rgba(0,0,0,.5)'}; }
        break;
      case 4:
        if (this.all_notis === true) { return {'background-color' : 'rgba(0,0,0,.5)'}; }
        break;
    }
  }

  public switchNotis(ac) {
    this.friends_nots = false;
    this.msgs_nots = false;
    this.stream_nots = false;
    this.tag_nots = false;
    this.all_notis = false;
    switch (ac) {
      case 0:
        this.friendsNoti();
        break;
      case 1:
        this.msgsNoti();
        break;
      case 2:
        this.streamNoti();
        break;
      case 3:
        this.tagsNoti();
        break;
      case 4:
        this.allNotis();
        break;
    }
  }

  friendsNoti() {
    this.friends_nots = !this.friends_nots;
  }

  msgsNoti() {
    this.msgs_nots = !this.msgs_nots;
  }

  streamNoti() {
    this.stream_nots = !this.stream_nots;
  }

  tagsNoti() {
    this.tag_nots = !this.tag_nots;
  }

  allNotis() {
    this.all_notis = !this.all_notis;
  }

  public openNotis(): void {
    this.notifications_open = true;
    this.bgColor = localStorage.getItem('spotbie_backgroundColor');
    if (this.bgColor == '') { this.bgColor = 'dimgrey'; }

    this.fontColor = localStorage.getItem('spotbie_fontColor');
    if (this.fontColor == '') { this.fontColor = 'white'; }

    this.friends_nots = true;
  }

  public closeWindow(): void {
    this.friends_nots = false;
    this.msgs_nots = false;
    this.stream_nots = false;
    this.tag_nots = false;
    this.all_notis = false;
    this.notifications_open = false;
  }

  ngAfterViewInit() {}

  ngOnInit() {}
}
