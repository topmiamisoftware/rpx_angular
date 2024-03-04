import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DeviceDetectorService} from 'ngx-device-detector';
import {HttpClientModule} from '@angular/common/http';
import {MenuLoggedInComponent} from './menu-logged-in.component';
import {RouterModule} from '@angular/router';
import {MapModule} from '../map/map.module';
import {SettingsModule} from './settings/settings.module';
import {RedeemableModule} from './redeemable/redeemable.module';
import {SpotbiePipesModule} from '../../spotbie-pipes/spotbie-pipes.module';
import {HelperModule} from '../../helpers/helper.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [MenuLoggedInComponent],
  imports: [
    RedeemableModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SpotbiePipesModule,
    RouterModule,
    HelperModule,
    MapModule,
    SettingsModule,
    RouterModule,
    FontAwesomeModule,
    // EventMenuModule
  ],
  providers: [DeviceDetectorService],
  exports: [MenuLoggedInComponent],
})
export class MenuLoggedInModule {}
