import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaceToEat } from 'src/app/models/place-to-eat';
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service';
import { UserauthService } from 'src/app/services/userauth.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})
export class QrComponent implements OnInit {

  @Output() closeThisEvt = new EventEmitter

  public placeToEat = new PlaceToEat()

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

  constructor(private userAuthService: UserauthService,
              private loyaltyPointsService: LoyaltyPointsService,
              private formBuilder: FormBuilder) { }
  
  get totalSpent() {return this.businessLoyaltyPointsForm.get('totalSpent').value }
  get f() { return this.businessLoyaltyPointsForm.controls }

  public calculateLoyaltyPointValue(){

    clearTimeout(this.promptForRewardTimeout)

    this.loyaltyPointsService.fetchLoyaltyPoints().subscribe(
      
      resp => {

        let percentValue = resp.loyalty_points.loyalty_point_dollar_percent_value

        this.loyaltyPointReward = this.totalSpent * ((percentValue)/100)

        this.loyaltyPointRewardDollarValue = this.totalSpent * ((percentValue)/100)
        
        this.placeToEat.qr_code_link = `https://spotbie.com/loyalty-points/scan/${this.userHash}/${this.qrCodeLink}/${this.totalSpent}/${this.loyaltyPointReward}`

        console.log("QrCodeLink", this.placeToEat.qr_code_link)

      }

    )

    this.promptForRewardTimeout = setTimeout(() =>{

      this.rewardPrompt = true
      this.promptForRewardTimeout = null

    }, 1250)
    
  }

  public scanSuccessHandler(evt){
    console.log("scan success", evt)
  }

  public scanErrorHandler(event){
    console.log("scan success", event)
  }

  public scanFailureHandler(event){
    console.log("scan success", event)
  }

  public yes(){

    this.rewardPrompt = false
    this.rewardPrompted = true

  }

  public no(){
    this.rewardPrompt = false
    this.rewardPrompted = false
  }

  public getQrCode(){

    this.isBusiness = true

    this.userAuthService.getSettings().subscribe(
      resp => {        
        console.log("resp", resp)
        this.userHash = resp.user.hash
        this.placeToEat.address = resp.place_to_eat.address
        this.placeToEat.name = resp.place_to_eat.name
        this.qrCodeLink = resp.place_to_eat.qr_code_link
       }
    )
    
    const totalSpentValidators = [Validators.required]

    this.businessLoyaltyPointsForm = this.formBuilder.group({
      totalSpent: ['', totalSpentValidators]
    })

    this.businessLoyaltyPointsFormUp = true

  }

  public startQrCodeScanner(){

    this.isBusiness = false

    this.loyaltyPointsService.fetchLoyaltyPoints().subscribe(

      resp => {

        if(resp.success){
          
          this.userLoyaltyPoints = resp.loyalty_points.balance
          
        }       

      }

    )
    
    

  }

  closeQr(){    
    console.log("event emitter")
    this.closeThisEvt.emit()
  }

  ngOnInit(): void {

    let accountType = localStorage.getItem('spotbie_userType')

    if(accountType === '4'){    
      this.startQrCodeScanner()
    } else {      
      this.getQrCode()
    }
  
  }

}
