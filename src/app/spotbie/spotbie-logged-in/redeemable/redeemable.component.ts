import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service';

@Component({
  selector: 'app-redeemable',
  templateUrl: './redeemable.component.html',
  styleUrls: ['./redeemable.component.css']
})
export class RedeemableComponent implements OnInit {

  @Output() closeWindowEvt = new EventEmitter

  public redeemList: Array<any> = []

  public redeemedPage: number = 0

  public totalRedeemed: number = 0

  public loadMoreRedeem: boolean = false


  constructor(private loyaltyPointsService: LoyaltyPointsService) { }

  public loadMoreRedeemPg(){
    this.redeemedPage = this.redeemedPage + 1
    this.getRedeemed()
  }

  public getRedeemed(){

    let getRedeemedObj = {
      page: this.redeemedPage
    }

    this.loyaltyPointsService.getRedeemed(getRedeemedObj).subscribe({
      next: (resp) => {

        console.log("Response", resp)

        let redeemItemData = resp.redeemedList.data
      
        this.totalRedeemed = redeemItemData.length
  
        let currentPage = resp.redeemedList.current_page
        let lastPage = resp.redeemedList.last_page
        let nextPage = currentPage + 1

        this.redeemedPage = currentPage

        if(this.redeemedPage == lastPage) 
          this.loadMoreRedeem = false
        else
          this.loadMoreRedeem = true

        redeemItemData.forEach(redeemItem => {
          this.redeemList.push(redeemItem)
        });

      },
      error: (error) => {
        console.log("getRedeemed", error)
      }
    })
      
  }

  public closeWindow(){
    this.closeWindowEvt.emit()
  }

  ngOnInit(): void {
    this.getRedeemed()
  }

}
