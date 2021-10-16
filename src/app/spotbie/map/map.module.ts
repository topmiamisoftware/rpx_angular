import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AgmOverlays } from "agm-overlays"
import { AgmCoreModule, GoogleMapsAPIWrapper, MarkerManager } from '@agm/core'

import { MatSliderModule } from '@angular/material/slider'
import { MatInputModule } from '@angular/material/input'

import { environment } from 'src/environments/environment'

import { SpotbiePipesModule } from 'src/app/spotbie-pipes/spotbie-pipes.module'
import { MapComponent } from './map.component'
import { MapObjectIconPipe } from 'src/app/pipes/map-object-icon.pipe'
import { HelperModule } from 'src/app/helpers/helper.module'
import { InfoObjectComponent } from './info-object/info-object.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { UserInfoObjectComponent } from './user-info-object/user-info-object.component'
import { RouterModule } from '@angular/router'
import { BusinessFeaturesComponent } from '../features/business-features/business-features.component'
import { UserFeaturesComponent } from '../features/user-features/user-features.component'
import { BusinessDashboardModule } from '../spotbie-logged-in/business-dashboard/business-dashboard.module'
import { UserDashboardModule } from '../spotbie-logged-in/user-dashboard/user-dashboard.module'
import { ShareIconsModule } from 'ngx-sharebuttons/icons'
import { MyFavoritesModule } from '../my-favorites/my-favorites.module'
import { InfoObjectModule } from './info-object/info-object.module'

@NgModule({
  declarations: [    
    MapComponent,
    UserInfoObjectComponent,
    BusinessFeaturesComponent,
    UserFeaturesComponent  
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
    MyFavoritesModule,
    InfoObjectModule,
    ShareButtonsModule.withConfig({
      include: ['facebook', 'twitter', 'linkedin', 'reddit', 'tumblr', 'mix', 'viber', 'messenger','whatsapp']
    }),
    RouterModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_maps_apiKey,
      language: 'en',
      libraries: ['geometry', 'places']
    }),     
    HelperModule,
    BusinessDashboardModule,
    UserDashboardModule
  ],
  providers: [
    MapObjectIconPipe,
    MarkerManager,
    GoogleMapsAPIWrapper
  ],  
  exports : [
    MapComponent,
  ]
})
export class MapModule { }
