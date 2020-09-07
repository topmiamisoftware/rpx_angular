import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AgmOverlays } from "agm-overlays"
import { AgmCoreModule, GoogleMapsAPIWrapper, MarkerManager } from '@agm/core'

import { MatSliderModule } from '@angular/material/slider'
import { environment } from 'src/environments/environment'

import { SpotbiePipesModule } from 'src/app/spotbie-pipes/spotbie-pipes.module'
import { LocationSaverComponent } from '../spotbie-logged-in/location-saver/location-saver.component'
import { MapComponent } from './map.component'
import { MyPlacesComponent } from '../spotbie-logged-in/my-places/my-places.component'
import { MapObjectIconPipe } from 'src/app/pipes/map-object-icon.pipe'

@NgModule({
  declarations: [
    LocationSaverComponent,      
    MapComponent,
    MyPlacesComponent,    
  ],
  imports: [
    AgmOverlays,
    CommonModule,
    MatSliderModule, 
    SpotbiePipesModule,   
    AgmCoreModule.forRoot({
      apiKey: environment.google_maps_apiKey,
      language: 'en',
      libraries: ['geometry', 'places']
    }),     
    
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
