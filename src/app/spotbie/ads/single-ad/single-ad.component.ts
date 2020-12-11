import { Component, OnInit } from '@angular/core';
import { AdsService } from '../ads.service';
import { response } from 'express';

@Component({
  selector: 'app-single-ad',
  templateUrl: './single-ad.component.html',
  styleUrls: ['./single-ad.component.css']
})
export class SingleAdComponent implements OnInit {

  public ad: any = {}

  public link: string

  public displayAd: boolean = false

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

      this.link = resp.ad.link.match(/href="([^"]*)/)[1]
      this.ad.content = resp.ad.link.replace('target="_blank"', '')
      this.ad.content = this.ad.content.replace(this.link, '')
      this.ad.content = this.ad.content.replace('href', '')
      this.ad.content = this.ad.content.replace('<a', '<div')
      this.ad.content = this.ad.content.replace('</a>', '</div>')
      
      this.displayAd = true

    } else {
      console.log("getSingleAdCallback", resp)
    }

  }

  public openAd(): void{
    
    console.log("openAd", this.link)
    window.open(this.link, "_system")

  }

  ngOnInit(): void {
    this.getSingleAdBanner()
  }

}
