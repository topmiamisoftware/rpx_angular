import { Component, Input, OnInit } from '@angular/core';
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service';

@Component({
  selector: 'app-business-menu',
  templateUrl: './business-menu.component.html',
  styleUrls: ['./business-menu.component.css']
})
export class BusinessMenuComponent implements OnInit {

  @Input() loyaltyPoints: string

  public menuItemList: Array<any>

  public itemCreator: boolean = false

  public userLoyaltyPoints
  public userResetBalance
  public userPointToDollarRatio

  constructor(private loyaltyPointsService: LoyaltyPointsService) { }

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
  
  public fetchMenuItems(){
    
  }

  public addItem(){
    this.itemCreator = !this.itemCreator
  }

  ngOnInit(): void {

    this.fetchLoyaltyPoints()
    this.fetchMenuItems()

  }

}
