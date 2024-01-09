import {Component, Input, OnInit} from '@angular/core';
import {Ad} from '../../../../models/ad';

const EDIT_MODE = false;

@Component({
  selector: 'app-nearby-ads-three',
  templateUrl: './nearby-ads-three.component.html',
  styleUrls: ['./nearby-ads-three.component.css'],
})
export class NearbyAdsThreeComponent implements OnInit {
  @Input() lat: number = null;
  @Input() lng: number = null;
  @Input() accountType: string | number;
  @Input() eventsClassification: number;
  @Input() categories: any;

  public editMode = EDIT_MODE;
  public adList = [new Ad(), new Ad(), new Ad()];

  constructor() {}

  ngOnInit(): void {}
}
