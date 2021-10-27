/* Angular Packages */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

/* Angular Material Packages */
import { MatChipsModule } from '@angular/material/chips'
import { MatAutocompleteModule } from '@angular/material/autocomplete'

/* 3rd Party Packages */
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core'
import { NgxMaskModule, IConfig } from 'ngx-mask'

/* SpotBie Imports */
import { environment } from 'src/environments/environment'
import { SettingsComponent } from './settings.component'
import { HelperModule } from 'src/app/helpers/helper.module';

export const options : Partial<IConfig> | (() => Partial<IConfig>) = null

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
    MatChipsModule,
    MatAutocompleteModule,
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
