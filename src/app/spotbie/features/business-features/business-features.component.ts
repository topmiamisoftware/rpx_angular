import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-business-features',
  templateUrl: './business-features.component.html',
  styleUrls: ['../features.component.css', './business-features.component.css']
})
export class BusinessFeaturesComponent implements OnInit {

  @Output() signUpEvent = new EventEmitter()

  constructor() { }

  public signUp(){
    this.signUpEvent.emit()
  }

  ngOnInit(): void {

  }

}
