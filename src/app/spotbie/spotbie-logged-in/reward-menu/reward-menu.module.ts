import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardMenuComponent } from './reward-menu.component';
import { RewardComponent } from './reward/reward.component';
import { RewardCreatorComponent } from './reward-creator/reward-creator.component';
import { MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RewardMenuComponent,
    RewardComponent,
    RewardCreatorComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  exports : [
    RewardMenuComponent
  ]
})
export class RewardMenuModule { }
