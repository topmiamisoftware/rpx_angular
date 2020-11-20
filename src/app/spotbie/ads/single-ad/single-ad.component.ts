import { Component, OnInit } from '@angular/core';
import { AdsService } from '../ads.service';

@Component({
  selector: 'app-single-ad',
  templateUrl: './single-ad.component.html',
  styleUrls: ['./single-ad.component.css']
})
export class SingleAdComponent implements OnInit {

  public ad: any = {}

  constructor(private adsService: AdsService) { }

  public getSingleAdBanner(){

    this.adsService.getSingleAdBanner().subscribe(
      resp =>{
        this.getSingleAdCallback(resp)
      }
    )

  }

  public getSingleAdCallback(resp: any){

    if(resp.success){
        this.ad.content = resp.ad.link
    } else {
      console.log("getSingleAdCallback", resp)
    }

  }

  ngOnInit(): void {
    this.getSingleAdBanner()
  }

}
