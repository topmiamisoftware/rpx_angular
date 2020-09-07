import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {

  public spotbieTutorialSlide = [
    true, false, false, false, false, false, false, false, false, false, false
  ];

  public currentSlide = 0;

  public bgColor;
  public fontColor;

  constructor() { }

  public closeWindow() {
    //this.host.closeWindow(this.host.tutorialWindow);
  }

  public previousTutorialSlide() {
    this.spotbieTutorialSlide[this.currentSlide] = false;
    this.currentSlide--;
    this.spotbieTutorialSlide[this.currentSlide] = true;
  }

  public nextTutorialSlide() {
    this.spotbieTutorialSlide[this.currentSlide] = false;
    this.currentSlide++;
    this.spotbieTutorialSlide[this.currentSlide] = true;
  }

  ngOnInit() {

    this.bgColor = localStorage.getItem('spotbie_backgroundColor');
    if (this.bgColor == '') { this.bgColor = 'dimgrey'; }

  }

}
