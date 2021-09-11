import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service';

@Component({
  selector: 'app-loyalty-points',
  templateUrl: './loyalty-points.component.html',
  styleUrls: ['./loyalty-points.component.css']
})
export class LoyaltyPointsComponent implements OnInit {

  @Output() closeWindow = new EventEmitter

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

  constructor(private loyaltyPointsService : LoyaltyPointsService,
              private formBuilder: FormBuilder){}

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
    
    this.businessLoyaltyPointsOpen = true
    
    const coinValidators = [Validators.required]
    const businessCoinPercentageValidators = [Validators.required]

    this.businessLoyaltyPointsForm = this.formBuilder.group({
      businessLoyaltyPoints: ['', coinValidators],
      businessCoinPercentage: ['', businessCoinPercentageValidators], 
    })

    this.businessLoyaltyPointsForm.get('businessLoyaltyPoints').setValue(this.userResetBalance)
    this.businessLoyaltyPointsForm.get('businessCoinPercentage').setValue(this.userPointToDollarRatio)

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
    this.closeWindow.emit()
  }

  public toggleHelp(){
    this.helpEnabled = !this.helpEnabled
  }

  ngOnInit(): void {

    this.loading = false

    this.fetchLoyaltyPoints()


  }

}
