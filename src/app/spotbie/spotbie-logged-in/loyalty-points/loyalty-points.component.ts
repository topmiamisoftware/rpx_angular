import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { animateLoyaltyPoints } from 'src/app/helpers/animations/frequent.animations';
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service';

@Component({
  selector: 'app-loyalty-points',
  templateUrl: './loyalty-points.component.html',
  styleUrls: ['./loyalty-points.component.css']
})
export class LoyaltyPointsComponent implements OnInit {

  @Output() closeWindow = new EventEmitter

  @ViewChild('newBalanceLoyaltyPoints') newBalanceLoyaltyPoints

  @ViewChild('businessLoyaltyPointsInfo') businessLoyaltyPointsInfo 

  public loading: boolean = false

  public userLoyaltyPoints: number = 0
  public userResetBalance: number = 0
  public userPointToDollarRatio: number = 0

  public businessAccount: boolean = false

  public businessLoyaltyPointsOpen: boolean = false

  public businessLoyaltyPointsForm: FormGroup
  public businessLoyaltyPointsFormUp: boolean = false
  public businessLoyaltyPointsSubmitted: boolean = false

  public monthlyDollarValueCalculated: boolean = false

  public businessPointsDollarValue: string = null

  public helpEnabled: boolean = false

  public qrCodeLink: string = null
  public userHash: string = null
  public loyaltyPointReward: number = null
  public totalSpent: number = null

  public newUserLoyaltyPoints: number = null

  public userType: string = null

  constructor(private loyaltyPointsService: LoyaltyPointsService,
              private formBuilder: FormBuilder,
              private router: Router,
              route: ActivatedRoute){

                if(this.router.url.indexOf('scan') > -1)                
                  this.qrCodeLink = route.snapshot.params.qrCode
                  this.loyaltyPointReward = route.snapshot.params.loyaltyPointReward
                  this.totalSpent = route.snapshot.params.totalSpent
                  this.userHash = route.snapshot.params.userHash
              }

  public fetchLoyaltyPoints(){    

    this.loyaltyPointsService.fetchLoyaltyPoints().subscribe(

      resp => {

        if(resp.success){
          
          this.userLoyaltyPoints = resp.loyalty_points.balance    
          this.userResetBalance = resp.loyalty_points.reset_balance 
          this.userPointToDollarRatio = resp.loyalty_points.loyalty_point_dollar_percent_value

        }       

      }

    )

  }
  
  public fetchLedger(){

  }

  public fetchExpenses(){

  }

  get businessLoyaltyPoints() {return this.businessLoyaltyPointsForm.get('businessLoyaltyPoints').value }
  get businessCoinPercentage() {return this.businessLoyaltyPointsForm.get('businessCoinPercentage').value }
  get f() { return this.businessLoyaltyPointsForm.controls }

  public initBusinessLoyaltyPoints(){    

    if(this.userType === '4'){
      return
    }

    this.businessLoyaltyPointsOpen = true
    
    const coinValidators = [Validators.required]
    const businessCoinPercentageValidators = [Validators.required]

    this.businessLoyaltyPointsForm = this.formBuilder.group({
      businessLoyaltyPoints: ['', coinValidators],
      businessCoinPercentage: ['', businessCoinPercentageValidators], 
    })

    if(this.userLoyaltyPoints > 0 && this.userResetBalance > 0){
      this.businessLoyaltyPointsForm.get('businessLoyaltyPoints').setValue(this.userResetBalance)
      this.businessLoyaltyPointsForm.get('businessCoinPercentage').setValue(this.userPointToDollarRatio)
      this.calculateDollarValue()       
    }

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
      location.reload()
    }

  }

  public calculateDollarValue(){

    let monthlyPoints = this.businessLoyaltyPoints
    let pointPercentage = this.businessCoinPercentage
    
    if(pointPercentage == 0)
      this.businessPointsDollarValue = '0'
    else
      this.businessPointsDollarValue = (monthlyPoints * (pointPercentage / 100)).toFixed(2)
    
    this.monthlyDollarValueCalculated = true

  }

  public closeBusinessLoyaltyPoints(){

    this.businessLoyaltyPointsOpen = false
    this.monthlyDollarValueCalculated = false
    this.businessPointsDollarValue = '0'
    this.businessLoyaltyPointsForm = null
    this.businessLoyaltyPointsFormUp = false    

  }

  public closeThis(){
    
    if(this.router.url.indexOf('scan') > -1){
      this.router.navigate(['/user-home'])
    } else {
      this.closeWindow.emit()
    }

  }

  public toggleHelp(){
    this.helpEnabled = !this.helpEnabled
  }

  public addLoyaltyPoints(){

    this.loading = true

    let addPointsObj: any = {
      qr_code_link: this.qrCodeLink,
      user_hash: this.userHash,
      totalSpent: this.totalSpent,
      loyaltyPointReward: this.loyaltyPointReward
    }
    
    this.loyaltyPointsService.addLoyaltyPoints(addPointsObj).subscribe(
      resp => {   
        //console.log("resp", resp)   
        this.addLoyaltyPointsCb(resp)      
      }
    )

  }

  public addLoyaltyPointsCb(resp: any){

    //console.log("addLoyaltyPointsCb", resp)

    if(resp.success){      

      this.userLoyaltyPoints = resp.newBalance
      this.newUserLoyaltyPoints = this.loyaltyPointReward

    }

    this.loading = false

  }

  ngOnInit(): void {

    this.userType = localStorage.getItem('spotbie_userType')

    this.loading = false
    
    this.fetchLoyaltyPoints()

    if(this.qrCodeLink !== null) this.addLoyaltyPoints()

  }

}
