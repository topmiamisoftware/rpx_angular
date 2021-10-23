import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AllowedAccountTypes } from 'src/app/helpers/enum/account-type.enum';
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service';

@Component({
  selector: 'app-redeemable',
  templateUrl: './redeemable.component.html',
  styleUrls: ['./redeemable.component.css']
})
export class RedeemableComponent implements OnInit {

  @Output() closeWindowEvt = new EventEmitter

  public redeemList: Array<any> = null

  public redeemedPage: number = 0

  public totalRedeemed: number = 0

  public loadMoreRedeem: boolean = false

  public eAllowedAccountTypes = AllowedAccountTypes

  public userType: string

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

        if(this.redeemList == null) this.redeemList = []

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
    this.userType = localStorage.getItem('spotbie_userType')
    this.getRedeemed()
  }

}
