import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardMenuComponent } from './reward-menu.component';
import { RewardComponent } from './reward/reward.component';
import { RewardCreatorComponent } from './reward-creator/reward-creator.component';
import { MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { HelperModule } from '../../../helpers/helper.module';
import {NgxMaskModule} from "ngx-mask";
import { TierCreatorComponent } from './tier-creator/tier-creator.component';

@NgModule({
  declarations: [
    RewardMenuComponent,
    RewardComponent,
    RewardCreatorComponent,
    TierCreatorComponent
  ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        NgxQRCodeModule,
        HelperModule,
        ShareButtonsModule.withConfig({
            include: ['facebook', 'twitter', 'linkedin', 'reddit', 'tumblr', 'mix', 'viber', 'messenger', 'whatsapp']
        }),
        NgxMaskModule,
    ],
  exports : [
    RewardMenuComponent
  ]
})
export class RewardMenuModule { }
