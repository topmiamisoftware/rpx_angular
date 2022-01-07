import { Component, Input, OnInit } from '@angular/core';
import { Ad } from 'src/app/models/ad';

const EDIT_MODE = false

@Component({
  selector: 'app-nearby-ads-three',
  templateUrl: './nearby-ads-three.component.html',
  styleUrls: ['./nearby-ads-three.component.css']
})
export class NearbyAdsThreeComponent implements OnInit {

  @Input('lat') lat: number = null
  @Input('lng') lng: number = null
  @Input('accountType') accountType: number = null
  @Input('eventsClassification') eventsClassification: number = null
  @Input('categories') categories: any

  public editMode = EDIT_MODE

  public adList = [new Ad, new Ad, new Ad]

  constructor() { }

  ngOnInit(): void {}

}
