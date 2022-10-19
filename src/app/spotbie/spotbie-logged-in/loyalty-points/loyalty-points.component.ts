import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AllowedAccountTypes } from 'src/app/helpers/enum/account-type.enum'
import { LoyaltyPointBalance } from 'src/app/models/loyalty-point-balance'
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service'
import {map} from "rxjs/operators";

@Component({
  selector: 'app-loyalty-points',
  templateUrl: './loyalty-points.component.html',
  styleUrls: ['./loyalty-points.component.css']
})
export class LoyaltyPointsComponent implements OnInit {

  @Output() closeWindow = new EventEmitter()
  @Output() openRedeemed = new EventEmitter()

  @Input() fullScreenWindow: boolean = true

  @ViewChild('newBalanceLoyaltyPoints') newBalanceLoyaltyPoints
  @ViewChild('businessLoyaltyPointsInfo') businessLoyaltyPointsInfo

  eAllowedAccountTypes = AllowedAccountTypes
  userLoyaltyPoints: number = 0
  loading: boolean = false
  userResetBalance: number = 0
  userPointToDollarRatio: number | string = 0
  businessAccount: boolean = false
  businessLoyaltyPointsOpen: boolean = false
  personalLoyaltyPointsOpen: boolean = false
  businessLoyaltyPointsForm: UntypedFormGroup
  businessLoyaltyPointsFormUp: boolean = false
  businessLoyaltyPointsSubmitted: boolean = false
  monthlyDollarValueCalculated: boolean = false
  helpEnabled: boolean = false
  qrCodeLink: string = null
  userHash: string = null
  loyaltyPointReward: number = null
  totalSpent: number = null
  newUserLoyaltyPoints: number
  userType: number = null
  loyaltyPointBalance: number = 0;
  loyaltyPointBalanceBusiness: LoyaltyPointBalance = new LoyaltyPointBalance();

  constructor(private loyaltyPointsService: LoyaltyPointsService,
              private formBuilder: UntypedFormBuilder,
              private router: Router,
              route: ActivatedRoute){
      if(this.router.url.indexOf('scan') > -1) {
         this.qrCodeLink = route.snapshot.params.qrCode
         this.loyaltyPointReward = route.snapshot.params.loyaltyPointReward
         this.totalSpent = route.snapshot.params.totalSpent
         this.userHash = route.snapshot.params.userHash
      }
  }

  getWindowClass(){
    if(this.fullScreenWindow)
      return 'spotbie-overlay-window d-flex align-items-center justify-content-center'
    else
      return ''
  }

  async getLoyaltyPointBalance(){
    await this.loyaltyPointsService.getLoyaltyPointBalance()
  }

  /* TO-DO: Create a function which shows a business's or personal account' past transactions. */
  fetchLedger(){}

  /* TO-DO: Create a function which shows a business's or personal account' past expenses. */
  fetchExpenses(){}

  loyaltyPointsClass(){
    if( this.userType !== AllowedAccountTypes.Personal)
      return 'sb-loyalty-points cursor-pointer'
    else
      return 'sb-loyalty-points no-cursor'
  }

  initPersonalLoyaltyPoints(){
    this.personalLoyaltyPointsOpen = true
  }

  get businessLoyaltyPoints() {return this.businessLoyaltyPointsForm.get('businessLoyaltyPoints').value }
  get businessCoinPercentage() {return this.businessLoyaltyPointsForm.get('businessCoinPercentage').value }
  get f() { return this.businessLoyaltyPointsForm.controls }

  initBusinessLoyaltyPoints() {
    if(this.userType === AllowedAccountTypes.Personal){
      this.openRedeemed.emit()
      return
    }
    this.businessLoyaltyPointsOpen = true

    const coinValidators = [Validators.required]
    const businessCoinPercentageValidators = [Validators.required]

    this.businessLoyaltyPointsForm = this.formBuilder.group({
      businessLoyaltyPoints: ['', coinValidators],
      businessCoinPercentage: ['', businessCoinPercentageValidators],
    })

    this.businessLoyaltyPointsForm.get('businessLoyaltyPoints').setValue(this.loyaltyPointBalanceBusiness.reset_balance)
    this.businessLoyaltyPointsForm.get('businessCoinPercentage').setValue(this.loyaltyPointBalanceBusiness.loyalty_point_dollar_percent_value)

    this.calculateDollarValue()

    this.businessLoyaltyPointsFormUp = true
    this.loading = false
  }

  submitBusinessLoyaltyPoints(){
    this.loading = true
    this.businessLoyaltyPointsSubmitted = true

    if(this.businessLoyaltyPointsForm.invalid){
      this.loading = false
      return
    }

    const businessLoyaltyPointsObj = {
      businessLoyaltyPoints: this.businessLoyaltyPoints,
      businessCoinPercentage: this.businessCoinPercentage
    }

    this.loyaltyPointsService.saveLoyaltyPoint(businessLoyaltyPointsObj).subscribe(resp => {
        this.submitBusinessLoyaltyPointsCB(resp)
      })
  }

  submitBusinessLoyaltyPointsCB(resp: any){
    if(resp.success){
      this.loading = false
      this.businessLoyaltyPointsInfo.nativeElement.innerHTML = 'Your loyalty point monthly budget was updated <i class=\'fa fa-check sb-text-light-green-gradient\'></i>'

      setTimeout(() => {
        location.reload()
      }, 570)
    }
  }

  calculateDollarValue(){
    const monthlyPoints: number = this.businessLoyaltyPoints
    const pointPercentage: number = this.businessCoinPercentage

    if(pointPercentage === 0) {
      this.userPointToDollarRatio = 0
    } else {
      this.userPointToDollarRatio = (monthlyPoints * (pointPercentage / 100)).toFixed(2)
    }

    this.monthlyDollarValueCalculated = true
  }

  closeBusinessLoyaltyPoints(){
    this.businessLoyaltyPointsOpen = false
    this.monthlyDollarValueCalculated = false
    this.businessLoyaltyPointsForm = null
    this.businessLoyaltyPointsFormUp = false
  }

  closeThis(){
    if(this.router.url.indexOf('scan') > -1)
      this.router.navigate(['/user-home'])
    else
      this.closeWindow.emit()
  }

  toggleHelp(){
    this.helpEnabled = !this.helpEnabled
  }

  /**
   * Will reset the user's loyalty point balance to their current reset value.
   */
  async resetMyBalance(){
    const confirm = window.confirm(`Are you sure you want to reset your balance to ${ this.loyaltyPointBalance }?`)
    if(confirm) await this.loyaltyPointsService.resetMyBalance()
  }

  ngOnInit(): void {
    this.userType = parseInt(localStorage.getItem('spotbie_userType'), 10)

    if(this.userType === AllowedAccountTypes.Personal){
      this.loyaltyPointsService.userLoyaltyPoints$.pipe(
        map((loyaltyPointBalance): number => {
          let loyaltyPoints = 0;
          if(loyaltyPointBalance.length === 0) {
            return loyaltyPoints;
          }
          loyaltyPointBalance.forEach((loyaltyPointsObj) => {
            loyaltyPoints += loyaltyPointsObj.balance;
          });
          return loyaltyPoints;
        })).subscribe(loyaltyPointBalance => {
        this.loyaltyPointBalance = loyaltyPointBalance;
      })
    } else {
      this.loyaltyPointsService.userLoyaltyPoints$.subscribe(loyaltyPointBalance => {
        this.loyaltyPointBalanceBusiness = loyaltyPointBalance[0]
      })
    }

    this.loading = false
    this.getLoyaltyPointBalance()
  }
}
