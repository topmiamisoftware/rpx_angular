import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyaltyPointsComponent } from './loyalty-points.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask';

export const options : Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    LoyaltyPointsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule.forRoot(options)    
  ],
  exports : [
    LoyaltyPointsComponent
  ]
})
export class LoyaltyPointsModule { }
