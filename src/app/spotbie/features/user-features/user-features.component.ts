import { Component, EventEmitter, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-user-features',
  templateUrl: './user-features.component.html',
  styleUrls: ['../features.component.css', './user-features.component.css']
})
export class UserFeaturesComponent implements OnInit {

  @Output() spawnCategoriesEvt = new EventEmitter()

  constructor() { }

  public spawnCategories(category: string){

    this.spawnCategoriesEvt.emit({ category: category })

  }

  ngOnInit(): void {  
  }

}
