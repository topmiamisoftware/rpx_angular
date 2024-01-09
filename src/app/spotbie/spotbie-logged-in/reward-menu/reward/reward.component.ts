import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Reward} from '../../../../models/reward';

@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.css'],
})
export class RewardComponent implements OnInit {
  @Output('closeWindowEvt') closeWindowEvt = new EventEmitter();

  @Input('fullScreenMode') fullScreenMode = true;
  @Input('reward') reward: Reward;
  @Input('userPointToDollarRatio') userPointToDollarRatio: number;

  loading = false;

  infoObjectImageUrl = 'assets/images/home_imgs/spotbie-white-icon.svg';

  successful_url_copy = false;

  rewardLink: string = null;

  constructor() {}

  getFullScreenModeClass() {
    console.log('getFullScreenModeClass', this.fullScreenMode);

    if (this.fullScreenMode) return 'fullScreenMode';
    else return '';
  }

  closeThis() {
    this.closeWindowEvt.emit();
  }

  linkCopy(input_element) {
    input_element.select();
    document.execCommand('copy');
    input_element.setSelectionRange(0, input_element.value.length);
    this.successful_url_copy = true;

    setTimeout(() => {
      this.successful_url_copy = false;
    }, 2500);
  }

  ngOnInit(): void {}
}
