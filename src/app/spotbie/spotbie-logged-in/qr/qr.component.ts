import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllowedAccountTypes } from 'src/app/helpers/enum/account-type.enum';
import { LoyaltyPointBalance } from 'src/app/models/loyalty-point-balance';
import { Business } from 'src/app/models/business';
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service';
import { UserauthService } from 'src/app/services/userauth.service';
import { environment } from 'src/environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Redeemable } from 'src/app/models/redeemable';
import { RewardCreatorService } from 'src/app/services/spotbie-logged-in/business-menu/reward-creator/reward-creator.service';
import { Reward } from 'src/app/models/reward';

const QR_CODE_LOYALTY_POINTS_SCAN_BASE_URL = environment.qrCodeLoyaltyPointsScanBaseUrl
const QR_CODE_CALIM_REWARD_SCAN_BASE_URL = environment.qrCodeRewardScanBaseUrl

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css', '../reward-menu/reward-menu.component.css']
})
export class QrComponent implements OnInit {

  @Input('fullScreenWindow') fullScreenWindow: boolean = false

  @Output() closeThisEvt = new EventEmitter
  @Output() openUserLPBalanceEvt = new EventEmitter
  @Output() closeQrUserEvt = new EventEmitter
  @Output() notEnoughLpEvt = new EventEmitter

  @ViewChild('sbEarnedPoints') sbEarnedPoints: ElementRef

  public business = new Business()

  public redeemable = new Redeemable()

  public userHash: string = null

  public qrType: string = 'url'

  public isBusiness: boolean = false

  public userLoyaltyPoints: number = 0
  public loyaltyPointWorth: number = 0

  public businessLoyaltyPointsForm: FormGroup
  public businessLoyaltyPointsFormUp: boolean = false

  public rewardPrompted: boolean = false
  public promptForRewardTimeout
  public rewardPrompt: boolean = false

  public loyaltyPointReward: number = null
  public loyaltyPointRewardDollarValue: number = null

  public qrCodeLink: string = null

  public qrCodeLoyaltyPointsBaseUrl: string = QR_CODE_LOYALTY_POINTS_SCAN_BASE_URL

  public qrCodeRewardBaseUrl: string = QR_CODE_CALIM_REWARD_SCAN_BASE_URL

  public loyaltyPointBalance: LoyaltyPointBalance

  public businessLoyaltyPointsSubmitted: boolean = false

  public qrWidth: number = 0

  public scanSuccess: boolean = false

  public awarded: boolean = false

  public reward: Reward = null
  public rewarded: boolean = false

  public pointsCharged: number

  constructor(private userAuthService: UserauthService,
              private loyaltyPointsService: LoyaltyPointsService,
              private deviceDetectorService: DeviceDetectorService,
              private formBuilder: FormBuilder,
              private rewardService: RewardCreatorService) { }
  
  public getWindowClass(){

    if(this.fullScreenWindow)
      return 'spotbie-overlay-window'
    else
      return ''

  }

  public checkForSetLoyaltyPointSettings(){
    
    if( this.loyaltyPointBalance.balance == null || 
        this.loyaltyPointBalance.balance == 0    || 
        this.loyaltyPointBalance.balance == undefined )
    {
      //Open the users Loyalty Points Balance Window
      this.openUserLPBalanceEvt.emit()

      //Close the window if full-screened
      if(this.fullScreenWindow) this.closeQr()      

      alert("First set a balance & dollar-to-loyalty point ratio.")
      return false

    } else
      return true

  }

  public async startAwardProcess(){

    if(this.loyaltyPointBalance.balance === 0){
      this.notEnoughLpEvt.emit()    
      console.log("eVent emitted")
      return
    }
    
    this.businessLoyaltyPointsSubmitted = true

    if(this.businessLoyaltyPointsForm.invalid) return

    let settingsCheck = await this.checkForSetLoyaltyPointSettings()

    if(!settingsCheck)
      return
    else{
      this.createRedeemable()
    }
     
  }

  public createRedeemable(){

    let percentValue: number = parseFloat(this.loyaltyPointBalance.loyalty_point_dollar_percent_value.toString())
    
    this.loyaltyPointRewardDollarValue = this.totalSpent * ( percentValue / 100)

    this.loyaltyPointReward 
    = (
      this.loyaltyPointRewardDollarValue / 
      ( this.loyaltyPointBalance.reset_balance * (percentValue / 100) )
    ) * this.loyaltyPointBalance.reset_balance

    this.rewardPrompt = true

  } 

  public yes(){

    let redeemableObj = {
      amount: this.loyaltyPointReward,
      total_spent: this.totalSpent,
      dollar_value: this.loyaltyPointRewardDollarValue      
    }

    this.loyaltyPointsService.createRedeemable(redeemableObj).subscribe(
      resp =>{
        
        this.createRedeemableCb(resp)

      }
    )
    
  }

  public createRedeemableCb(resp: any){

    if(resp.success){
      
      this.redeemable.uuid = `${this.qrCodeLoyaltyPointsBaseUrl}?&r=${resp.redeemable.uuid}&t=lp`    
      this.promptForRewardTimeout = null

      this.rewardPrompt = false
      this.rewardPrompted = true

    } else 
      alert(resp.message)    

  }

  public addLp(addLpObj){

    this.loyaltyPointsService.addLoyaltyPoints(addLpObj, 
      (resp) => {
        this.scanSuccessHandlerCb(resp)
      }
    )   
     
  }

  public claimReward(addLpObj){

    this.rewardService.claimReward(addLpObj,       
      (resp) => {
        this.claimRewardCb(resp)
      }
    ) 

  }

  public claimRewardCb(resp){

    console.log("resp", resp)

    if(resp.success){
  
      this.rewarded = true      
      this.reward = resp.reward 
      this.pointsCharged = this.reward.point_cost
      this.sbEarnedPoints.nativeElement.style.display = 'block'
      
    } else 
      alert(resp.message)

    this.scanSuccess = false

  }

  public scanSuccessHandler(urlString: string){
    
    if(this.scanSuccess) return

    this.scanSuccess = true

    let url = new URL(urlString)
    let urlParams = new URLSearchParams(url.search)

    let redeemableType = urlParams.get('t')

    let addLpObj = {
      redeemableHash: urlParams.get('r'),
      redeemableType: redeemableType
    }

    switch(redeemableType)
    {
      case 'lp':
        this.addLp(addLpObj)
        break
      
      case 'claim_reward':
        this.claimReward(addLpObj)
        break
    }
  }

  public scanSuccessHandlerCb(resp: any){

    if(resp.success){
            
      this.awarded = true      
      this.userLoyaltyPoints = resp.redeemable.amount      
      this.sbEarnedPoints.nativeElement.style.display = 'block'

    } else {

      alert(resp.message)

    }

    this.scanSuccess = false

  }

  public scanErrorHandler(event){
  }

  public scanFailureHandler(event){
    console.log("scan failure", event)
  }

  public no(){
    this.rewardPrompt = false
    this.rewardPrompted = false
  }

  get totalSpent() { return this.businessLoyaltyPointsForm.get('totalSpent').value }
  get f() { return this.businessLoyaltyPointsForm.controls }

  public getQrCode(){

    this.loyaltyPointsService.getLoyaltyPointBalance()

    this.userAuthService.getSettings().subscribe(

      resp => {        
        this.userHash = resp.user.hash
        this.business.address = resp.business.address
        this.business.name = resp.business.name
        this.business.qr_code_link = resp.business.qr_code_link
        this.business.trial_ends_at = resp.business.trial_ends_at
       }

    )
    
    const totalSpentValidators = [Validators.required]

    this.businessLoyaltyPointsForm = this.formBuilder.group({
      totalSpent: ['', totalSpentValidators]
    })    

    this.businessLoyaltyPointsFormUp = true

  }

  public startQrCodeScanner(){
    
    this.loyaltyPointsService.getLoyaltyPointBalance()
    this.isBusiness = false

  }

  closeQr(){    
    this.rewardPrompted = false
  }

  closeQrUser(){
    this.closeQrUserEvt.emit(null)
  }

  ngOnInit(): void {

    this.loyaltyPointsService.userLoyaltyPoints$.subscribe(
      loyaltyPointBalance => {
        this.loyaltyPointBalance = loyaltyPointBalance       
      }
    )
    
    if( this.deviceDetectorService.isMobile() )
      this.qrWidth = 250
    else
      this.qrWidth = 450

    let accountType = parseInt(localStorage.getItem('spotbie_userType'))

    if(accountType === AllowedAccountTypes.Personal)
      this.startQrCodeScanner()
    else {
      this.isBusiness = true
      this.getQrCode()     
    }
    
  }

}
