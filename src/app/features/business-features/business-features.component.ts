import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-business-features',
  templateUrl: './business-features.component.html',
  styleUrls: ['../features.component.css', './business-features.component.css']
})
export class BusinessFeaturesComponent implements OnInit {
  
  @Output() spawnCategoriesEvt = new EventEmitter()

  @Output() signUpEvent = new EventEmitter()

  constructor() { }

  public signUp(){
    this.signUpEvent.emit()
  }

  public spawnCategories(category: string){

    this.spawnCategoriesEvt.emit({ category: category })

  }

  ngOnInit(): void {

  }

}
