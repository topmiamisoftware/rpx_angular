import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Reward} from '../../../../models/reward';
import {LoyaltyTier} from '../../../../models/loyalty-point-tier.balance';
import {InfoObject} from "../../../../models/info-object";

@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.css'],
})
export class RewardComponent implements OnInit {
  @Output('closeWindowEvt') closeWindowEvt = new EventEmitter();

  @Input() fullScreenMode = true;
  @Input() reward: Reward;
  @Input() tier: LoyaltyTier;
  @Input() userPointToDollarRatio: number;
  @Input() business: InfoObject;

  loading = false;
  successful_url_copy = false;

  constructor() {}

  getFullScreenModeClass() {
    return this.fullScreenMode ? 'fullScreenMode' : '';
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
