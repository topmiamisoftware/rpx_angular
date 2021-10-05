import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { DeviceDetectorService } from 'ngx-device-detector'

import { SearchComponent } from './search/search.component'

import { HttpClientModule } from '@angular/common/http'
import { MenuLoggedInComponent } from './menu-logged-in.component'
import { SpotbiePipesModule } from 'src/app/spotbie-pipes/spotbie-pipes.module'
import { RouterModule } from '@angular/router'
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { HelperModule } from 'src/app/helpers/helper.module'
import { MapModule } from '../map/map.module'

import { ChooseAccountTypeComponent } from './choose-account-type/choose-account-type.component'
import { SettingsModule } from './settings/settings.module'
import { QrComponent } from './qr/qr.component'
import { LoyaltyPointsComponent } from './loyalty-points/loyalty-points.component'
import { BusinessMenuComponent } from './business-menu/business-menu.component'
import { RewardCreatorComponent } from './business-menu/reward-creator/reward-creator.component'
import { MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field'
import { RewardComponent } from './business-menu/reward/reward.component'

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BusinessDashboardComponent } from './business-dashboard/business-dashboard.component'

export const options : Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [ 
    MenuLoggedInComponent,   
    SearchComponent,     
    ChooseAccountTypeComponent,
    QrComponent,
    LoyaltyPointsComponent,
    BusinessMenuComponent,
    RewardComponent,
    RewardCreatorComponent,
    BusinessDashboardComponent
  ],
  imports: [  
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    SpotbiePipesModule,
    RouterModule,
    HelperModule,
    MapModule,
    SettingsModule,
    MatSelectModule,
    MatFormFieldModule,
    RouterModule,
    NgxQRCodeModule,
    ZXingScannerModule,
    NgxMaskModule.forRoot(options)    
  ],
  providers: [
    DeviceDetectorService
  ],
  exports: [MenuLoggedInComponent] 
})
export class MenuLoggedInModule { }