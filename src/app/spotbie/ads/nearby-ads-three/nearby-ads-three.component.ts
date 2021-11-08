import { Component, Input, OnInit } from '@angular/core';
import { Ad } from 'src/app/models/ad';
import { Business } from 'src/app/models/business';

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
  @Input('categories') categories: number
  @Input('business') business: Business = new Business()
  @Input('ad') ad: Ad = null
  @Input('editMode') editMode: boolean = false

  public adList = [new Ad, new Ad, new Ad]

  constructor() { }

  ngOnInit(): void {

    console.log("lat", this.lat)
    console.log("business", this.lat)
    console.log("lng", this.lat)
    console.log("ad", this.lat)
    console.log("accountType", this.lat)

  }

}
