import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AgmOverlays} from 'agm-overlays';
import {AgmCoreModule, GoogleMapsAPIWrapper, MarkerManager} from '@agm/core';
import {MatSliderModule} from '@angular/material/slider';
import {MatInputModule} from '@angular/material/input';
import {MapComponent} from './map.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserInfoObjectComponent} from './user-info-object/user-info-object.component';
import {RouterModule} from '@angular/router';
import {BusinessFeaturesComponent} from '../../features/business-features/business-features.component';
import {UserFeaturesComponent} from '../../features/user-features/user-features.component';
import {BusinessDashboardModule} from '../spotbie-logged-in/business-dashboard/business-dashboard.module';
import {UserDashboardModule} from '../spotbie-logged-in/user-dashboard/user-dashboard.module';
import {ShareIconsModule} from 'ngx-sharebuttons/icons';
import {InfoObjectModule} from './info-object/info-object.module';
import {AdsModule} from '../ads/ads.module';
import {SpotbiePipesModule} from '../../spotbie-pipes/spotbie-pipes.module';
import {DownloadMobileModule} from '../../download-mobile/download-mobile.module';
import {environment} from '../../../environments/environment';
import {HelperModule} from '../../helpers/helper.module';
import {MapObjectIconPipe} from '../../pipes/map-object-icon.pipe';
// import { MyFavoritesModule } from '../my-favorites/my-favorites.module'

@NgModule({
  declarations: [
    MapComponent,
    UserInfoObjectComponent,
    BusinessFeaturesComponent,
    UserFeaturesComponent,
  ],
  imports: [
    AgmOverlays,
    CommonModule,
    MatSliderModule,
    MatInputModule,
    SpotbiePipesModule,
    ReactiveFormsModule,
    FormsModule,
    ShareIconsModule,
    // MyFavoritesModule,
    InfoObjectModule,
    DownloadMobileModule,
    RouterModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_maps_apiKey,
      language: 'en',
      libraries: ['geometry', 'places'],
    }),
    HelperModule,
    BusinessDashboardModule,
    UserDashboardModule,
    AdsModule,
  ],
  providers: [MapObjectIconPipe, MarkerManager, GoogleMapsAPIWrapper],
  exports: [MapComponent],
})
export class MapModule {}
