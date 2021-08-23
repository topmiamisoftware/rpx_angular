import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';

import { AgmOverlays } from "agm-overlays"
import { AgmCoreModule, GoogleMapsAPIWrapper, MarkerManager } from '@agm/core'

import { environment } from 'src/environments/environment'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HelperModule } from 'src/app/helpers/helper.module';

@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    HelperModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_maps_apiKey,
      language: 'en',
      libraries: ['geometry', 'places']
    }),       
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
  exports: [
    SettingsComponent
  ]
})
export class SettingsModule { }
