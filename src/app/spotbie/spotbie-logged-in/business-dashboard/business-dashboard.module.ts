import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessDashboardComponent } from './business-dashboard.component';
import { QrModule } from '../qr/qr.module';
import { LoyaltyPointsModule } from '../loyalty-points/loyalty-points.module';
import { RewardMenuModule } from '../reward-menu/reward-menu.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    BusinessDashboardComponent
  ],
  imports: [
    CommonModule,
    LoyaltyPointsModule,
    RewardMenuModule,
    RouterModule,
    QrModule
  ],
  exports : [
    BusinessDashboardComponent
  ]
})
export class BusinessDashboardModule { }
