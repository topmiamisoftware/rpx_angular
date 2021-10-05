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
import { MyFavoritesComponent } from '../my-favorites/my-favorites.component'
import { NgxFontAwesomeModule } from 'ngx-font-awesome'
import { LocationSaverComponent } from '../location-saver/location-saver.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MyPlacesComponent } from '../location-saver/my-places/my-places.component'
import { WelcomeComponent } from '../spotbie-logged-out/welcome/welcome.component'
import { ShareModule } from '@ngx-share/core'
import { UserInfoObjectComponent } from './user-info-object/user-info-object.component'
import { RouterModule } from '@angular/router'
import { UserFeaturesComponent } from '../features/user-features/user-features.component'
import { BusinessFeaturesComponent } from '../features/business-features/business-features.component'

@NgModule({
  declarations: [
    LocationSaverComponent,      
    MapComponent,  
    MyFavoritesComponent,
    InfoObjectComponent,
    MyPlacesComponent,
    WelcomeComponent,
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
    NgxFontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    ShareModule,
    RouterModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_maps_apiKey,
      language: 'en',
      libraries: ['geometry', 'places']
    }),     
    HelperModule
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
