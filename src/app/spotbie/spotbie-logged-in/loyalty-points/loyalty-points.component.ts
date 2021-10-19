import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AllowedAccountTypes } from 'src/app/helpers/enum/account-type.enum'
import { LoyaltyPointBalance } from 'src/app/models/loyalty-point-balance'
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service'

@Component({
  selector: 'app-loyalty-points',
  templateUrl: './loyalty-points.component.html',
  styleUrls: ['./loyalty-points.component.css']
})
export class LoyaltyPointsComponent implements OnInit {

  @Input() fullScreenWindow: boolean = true

  @Output() closeWindow = new EventEmitter

  @ViewChild('newBalanceLoyaltyPoints') newBalanceLoyaltyPoints

  @ViewChild('businessLoyaltyPointsInfo') businessLoyaltyPointsInfo 

  public eAllowedAccountTypes = AllowedAccountTypes

  public userLoyaltyPoints: number = 0

  public loading: boolean = false

  public userResetBalance: number = 0
  public userPointToDollarRatio: number | string = 0

  public businessAccount: boolean = false

  public businessLoyaltyPointsOpen: boolean = false

  public businessLoyaltyPointsForm: FormGroup
  public businessLoyaltyPointsFormUp: boolean = false
  public businessLoyaltyPointsSubmitted: boolean = false

  public monthlyDollarValueCalculated: boolean = false
  
  public helpEnabled: boolean = false

  public qrCodeLink: string = null
  public userHash: string = null
  public loyaltyPointReward: number = null
  public totalSpent: number = null

  public newUserLoyaltyPoints: number = null

  public userType: string = null

  public loyaltyPointBalance: LoyaltyPointBalance = new LoyaltyPointBalance()

  constructor(private loyaltyPointsService: LoyaltyPointsService,
              private formBuilder: FormBuilder,
              private router: Router,
              route: ActivatedRoute){
                
      if(this.router.url.indexOf('scan') > -1){  

         this.qrCodeLink = route.snapshot.params.qrCode
         this.loyaltyPointReward = route.snapshot.params.loyaltyPointReward
         this.totalSpent = route.snapshot.params.totalSpent
         this.userHash = route.snapshot.params.userHash

      }

  }
  
  public getWindowClass(){

    if(this.fullScreenWindow)
      return 'spotbie-overlay-window d-flex align-items-center justify-content-center'
    else
      return ''

  }

  public async getLoyaltyPointBalance(){    

    await this.loyaltyPointsService.getLoyaltyPointBalance()    
    
  }
  
  /* TO-DO: Create a function which shows a business's or personal account' past transactions. */
  public fetchLedger(){}

  /* TO-DO: Create a function which shows a business's or personal account' past expenses. */
  public fetchExpenses(){}

  public loyaltyPointsClass(){

    if( this.userType !== AllowedAccountTypes.Personal)
      return 'sb-loyalty-points cursor-pointer'
    else
      return 'sb-loyalty-points no-cursor'
    
  }
  
  get businessLoyaltyPoints() {return this.businessLoyaltyPointsForm.get('businessLoyaltyPoints').value }
  get businessCoinPercentage() {return this.businessLoyaltyPointsForm.get('businessCoinPercentage').value }
  get f() { return this.businessLoyaltyPointsForm.controls }
  
  public initBusinessLoyaltyPoints(){    

    if(this.userType == AllowedAccountTypes.Personal) return

    this.businessLoyaltyPointsOpen = true
    
    const coinValidators = [Validators.required]
    const businessCoinPercentageValidators = [Validators.required]

    this.businessLoyaltyPointsForm = this.formBuilder.group({
      businessLoyaltyPoints: ['', coinValidators],
      businessCoinPercentage: ['', businessCoinPercentageValidators], 
    })

    this.businessLoyaltyPointsForm.get('businessLoyaltyPoints').setValue(this.loyaltyPointBalance.reset_balance)
    this.businessLoyaltyPointsForm.get('businessCoinPercentage').setValue(this.loyaltyPointBalance.loyalty_point_dollar_percent_value)

    this.calculateDollarValue()  

    this.businessLoyaltyPointsFormUp = true    
    this.loading = false

  }

  public submitBusinessLoyaltyPoints(){

    this.loading = true
    this.businessLoyaltyPointsSubmitted = true

    if(this.businessLoyaltyPointsForm.invalid){
      this.loading = false
      return
    }

    let businessLoyaltyPointsObj = {
      businessLoyaltyPoints: this.businessLoyaltyPoints,
      businessCoinPercentage: this.businessCoinPercentage
    }

    this.loyaltyPointsService.saveLoyaltyPoint(businessLoyaltyPointsObj).subscribe(
      resp => {
        this.submitBusinessLoyaltyPointsCB(resp)
      }
    )

  }

  public submitBusinessLoyaltyPointsCB(resp: any){

    if(resp.success){
      
      this.loading = false
      this.businessLoyaltyPointsInfo.nativeElement.innerHTML = "Your loyalty point monthly budget was updated <i class='fa fa-check'></i>"
      
      setTimeout(() => {
        location.reload()
      }, 570)      

    }

  }

  public calculateDollarValue(){

    let monthlyPoints: number = this.businessLoyaltyPoints 
    let pointPercentage: number = this.businessCoinPercentage
    
    if(pointPercentage == 0)
      this.userPointToDollarRatio = 0
    else
      this.userPointToDollarRatio = (monthlyPoints * (pointPercentage / 100)).toFixed(2)

    this.monthlyDollarValueCalculated = true

  }

  public closeBusinessLoyaltyPoints(){

    this.businessLoyaltyPointsOpen = false
    this.monthlyDollarValueCalculated = false
    this.businessLoyaltyPointsForm = null
    this.businessLoyaltyPointsFormUp = false    

  }

  public closeThis(){
    
    if(this.router.url.indexOf('scan') > -1)
      this.router.navigate(['/user-home'])
    else
      this.closeWindow.emit()
    
  }

  public toggleHelp(){
    this.helpEnabled = !this.helpEnabled
  }

  public async addLoyaltyPoints(){

    this.loading = true

    let addPointsObj: any = {
      qr_code_link: this.qrCodeLink,
      user_hash: this.userHash,
      totalSpent: this.totalSpent,
      loyaltyPointReward: this.loyaltyPointReward
    }
    
    let resp = await this.loyaltyPointsService.addLoyaltyPoints(addPointsObj)

    this.addLoyaltyPointsCb(resp)     
    
  }

  public addLoyaltyPointsCb(resp: any){

    if(resp.success)
      this.newUserLoyaltyPoints = this.loyaltyPointReward

    this.loading = false

  }

  /**
   * Will reset the user's loyalty point balance to their current reset value.
   */
  public async resetMyBalance(){

    let confirm = window.confirm(`Are you sure you want to reset your balance to ${ this.loyaltyPointBalance.reset_balance }?`)

    if(confirm) await this.loyaltyPointsService.resetMyBalance()

  }

  ngOnInit(): void {

    this.loyaltyPointsService.userLoyaltyPoints$.subscribe(
      loyaltyPointBalance => {
        this.loyaltyPointBalance = loyaltyPointBalance      
      }
    )
    
    this.userType = localStorage.getItem('spotbie_userType')

    this.loading = false
    
    this.getLoyaltyPointBalance()

    if(this.qrCodeLink !== null) this.addLoyaltyPoints()

  }

}
