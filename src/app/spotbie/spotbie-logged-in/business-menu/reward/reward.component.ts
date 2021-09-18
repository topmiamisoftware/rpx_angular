import { Component, Input, OnInit } from '@angular/core';
import { PlaceToEatItem } from 'src/app/models/place-to-eat-item';

@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.css']
})
export class RewardComponent implements OnInit {

  @Input('reward') reward: PlaceToEatItem

  public loading: boolean = false

  constructor() { }

  public deleteMe(){
    
  }

  ngOnInit(): void {
    console.log('reward_is', this.reward)
  }

}
