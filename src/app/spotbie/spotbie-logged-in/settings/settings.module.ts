import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';

import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core'

import { environment } from 'src/environments/environment'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HelperModule } from 'src/app/helpers/helper.module';

import { NgxMaskModule, IConfig } from 'ngx-mask'
import { RouterModule } from '@angular/router';

export const options : Partial<IConfig> | (() => Partial<IConfig>) = null;

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
    RouterModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_maps_apiKey,
      language: 'en',
      libraries: ['geometry', 'places']
    }),       
    NgxMaskModule.forRoot(options)
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
  exports: [
    SettingsComponent
  ]
})
export class SettingsModule { }
