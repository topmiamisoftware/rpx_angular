import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AllowedAccountTypes } from 'src/app/helpers/enum/account-type.enum';
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service';
import {LoyaltyPointsLedger} from '../../../models/loyalty-points-ledger';
import {Redeemable} from '../../../models/redeemable';
import {LoyaltyPointBalance} from '../../../models/loyalty-point-balance';

@Component({
  selector: 'app-redeemable',
  templateUrl: './redeemable.component.html',
  styleUrls: ['./redeemable.component.css']
})
export class RedeemableComponent implements OnInit {

  @Output() closeWindowEvt = new EventEmitter()

  eAllowedAccountTypes = AllowedAccountTypes
  userType: string
  rewards: boolean;
  rewardList: Array<Redeemable> = []
  rewardPage: number = 1
  rewardTotal: number = 0
  lpRedeemed: boolean;
  lpRedeemedList: Array<Redeemable> = []
  lpRedeemedPage: number = 1
  lpRedeemedTotal: number = 0
  ledger: boolean;
  lpLedgerList: Array<LoyaltyPointsLedger> = []
  lpLedgerPage: number = 1
  lpLedgerTotal: number = 0
  showBalanceList: boolean
  balanceList: Array<LoyaltyPointBalance> = []
  balanceListPage: number = 1
  balanceListTotal: number = 0
  loadMore: boolean

  constructor(private loyaltyPointsService: LoyaltyPointsService) { }

  loadMoreItems(){
    if(this.rewards){
      this.rewardPage = this.rewardPage + 1
      this.getRewards()
    } else if (this.lpRedeemed) {
      this.lpRedeemedPage = this.lpRedeemedPage + 1
      this.getRedeemed();
    } else if (this.ledger) {
      this.lpLedgerPage = this.lpLedgerPage + 1
      this.getLedger()
    } else if (this.showBalanceList) {
      this.balanceListPage = this.balanceListPage + 1
      this.getBalanceList()
    }
  }

  getBalanceListStyle() {
    if (this.showBalanceList) {
      return {'background-color' : 'rgb(80 216 120)'}
    }
  }

  getBalanceList() {
    const getBalanceListObj = {
      page: this.balanceListPage
    }

    this.loyaltyPointsService.getBalanceList(getBalanceListObj).subscribe({ next: (resp) => {
        const balanceListData: LoyaltyPointBalance[] = resp.balanceList.data

        this.balanceListTotal = balanceListData.length

        const currentPage = resp.balanceList.current_page
        const lastPage = resp.balanceList.last_page

        this.balanceListPage = currentPage;

        (this.balanceListPage === lastPage) ? this.loadMore = false : this.loadMore = true;

        balanceListData.forEach((lpBalance: LoyaltyPointBalance) => {
          this.balanceList.push(lpBalance)
        });
      }, error: (error) => {
        console.log('getLedger', error)
      }
    });
  }

  getLedgerStyle() {
    if (this.ledger) {
      return {'background-color' : 'rgb(80 216 120)'}
    }
  }

  getLedger() {
    const getLedgerObj = {
      page: this.lpLedgerPage
    }

    this.loyaltyPointsService.getLedger(getLedgerObj).subscribe({ next: (resp) => {
        const ledgerData: LoyaltyPointsLedger[] = resp.ledger.data

        this.lpLedgerTotal = ledgerData.length

        const currentPage = resp.ledger.current_page
        const lastPage = resp.ledger.last_page

        this.lpLedgerPage = currentPage;

        (this.lpLedgerPage === lastPage) ? this.loadMore = false : this.loadMore = true;

        ledgerData.forEach((ledgerRecord: LoyaltyPointsLedger) => {
          this.lpLedgerList.push(ledgerRecord)
        });
      }, error: (error) => {
        console.log('getLedger', error)
      }
    });
  }

  getRewardsStyle() {
    if(this.rewards) {
      return {'background-color' : 'rgb(80 216 120)'}
    }
  }

  getRewards(){
    const getRewardsObj = {
      page: this.rewardPage
    }

    this.loyaltyPointsService.getRewards(getRewardsObj).subscribe({next: (resp) => {
        const rewardList: Redeemable[] = resp.rewardList.data

        this.rewardTotal = rewardList.length

        const currentPage = resp.rewardList.current_page
        const lastPage = resp.rewardList.last_page

        this.rewardPage = currentPage;

        (this.rewardPage === lastPage) ? this.loadMore = false : this.loadMore = true;

        rewardList.forEach((redeemItem: Redeemable) => {
          this.rewardList.push(redeemItem)
        });

        this.rewards = true;
      }, error: (error) => {
        console.log('getRewards', error)
      }
    })
  }

  getRedeemedStyle() {
    if(this.lpRedeemed) {
      return {'background-color' : 'rgb(80 216 120)'}
    }
  }

  getRedeemed(){
    const getRedeemedObj = {
      page: this.lpRedeemedPage
    }

    this.loyaltyPointsService.getRedeemed(getRedeemedObj).subscribe({next: (resp) => {
        const redeemItemData: Redeemable[] = resp.redeemedList.data

        this.lpRedeemedTotal = redeemItemData.length
        this.lpRedeemedPage =  resp.redeemedList.current_page

        const lastPage = resp.redeemedList.last_page

        if (this.lpRedeemedPage === lastPage) {
         this.loadMore = false;
        }  else {
         this.loadMore = true;
        }

        redeemItemData.forEach((redeemItem: Redeemable) => {
          this.lpRedeemedList.push(redeemItem)
        });
      },
      error: (error) => {
        console.log('getRedeemed', error)
      }
    })
  }

  getLpStyle(lpPoints: number){
    if(lpPoints < 0) {
      return 'sb-text-red-gradient';
    } else {
      return 'sb-text-light-green-gradient';
    }
  }

  showLoadMore(){
    if (this.rewards && this.rewardTotal > 0){
      return true;
    } else if (this.lpRedeemed && this.lpRedeemedTotal > 0){
      return true;
    } else if (this.ledger && this.lpLedgerTotal > 0){
      return true;
    }
  }

  switchTab(tab){
    this.rewards = false;
    this.lpRedeemed = false;
    this.ledger = false;
    this.showBalanceList = false;

    switch(tab) {
      case 'rewards':
        this.rewards = true;
        if (this.rewardPage === 1 && this.rewardList.length === 0){
          this.getRewards();
        }
        break;
      case 'lpRedeemed':
        this.lpRedeemed = true;
        if (this.lpRedeemedPage === 1 && this.lpRedeemedList.length === 0){
          this.getRedeemed();
        }
        break;
      case 'ledger':
        this.ledger = true;
        if (this.lpLedgerPage === 1 && this.lpLedgerList.length === 0){
          this.getLedger();
        }
        break;
      case 'balance-list':
        this.showBalanceList = true;
        if (this.balanceListPage === 1 && this.balanceList.length === 0){
          this.getBalanceList();
        }
        break;
    }
  }

  closeWindow(){
    this.closeWindowEvt.emit();
  }

  ngOnInit(): void {
    this.userType = localStorage.getItem('spotbie_userType');
    this.showBalanceList = true;
    this.getBalanceList();
  }
}
