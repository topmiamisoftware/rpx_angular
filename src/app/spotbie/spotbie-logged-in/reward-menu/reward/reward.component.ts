import { Component, Input, OnInit } from '@angular/core';
import { Reward } from 'src/app/models/reward';

@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.css']
})
export class RewardComponent implements OnInit {

  @Input('reward') reward: Reward

  public loading: boolean = false

  constructor() { }

  public deleteMe(){
    
  }

  ngOnInit(): void {
    console.log('reward_is', this.reward)
  }

}
