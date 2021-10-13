import { Component, Input, OnInit } from '@angular/core';
import { SpotbieAd } from 'src/app/models/spotbie-ad';
import { AdsService } from '../../ads/ads.service';

@Component({
  selector: 'app-ad-manager',
  templateUrl: './ad-manager.component.html',
  styleUrls: ['./ad-manager.component.css']
})
export class AdManagerComponent implements OnInit {

  @Input('fullScreenWindow') fullScreenWindow: boolean = false

  public ad: SpotbieAd

  public userAdList: Array<SpotbieAd> = []

  public adEditor: boolean = false

  constructor(private adService: AdsService) { }

  public openAdEditor(){
    this.adEditor = true
  }

  public closeAdEditor(){
    this.adEditor = false
  }

  public editAd(ad: SpotbieAd){
    this.ad = ad
    this.openAdEditor()
  }

  public addCreated(){

  }

  public getAds(){

    this.adService.getAds().subscribe(
      resp => {
        console.log("getAds", resp)
      }
    )

  }

  ngOnInit(): void {
    
    this.getAds()

  }

}
