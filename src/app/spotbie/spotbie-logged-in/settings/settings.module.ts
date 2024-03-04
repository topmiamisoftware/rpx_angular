/* Angular Packages */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule, GoogleMapsAPIWrapper} from '@agm/core';
import {NgxMaskModule, IConfig} from 'ngx-mask';
import {environment} from '../../../../environments/environment';
import {SettingsComponent} from './settings.component';
import {HelperModule} from '../../../helpers/helper.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {
  _MatSlideToggleRequiredValidatorModule,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HelperModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    _MatSlideToggleRequiredValidatorModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_maps_apiKey,
      language: 'en',
      libraries: ['geometry', 'places'],
    }),
    NgxMaskModule.forRoot(options),
    FontAwesomeModule,
  ],
  providers: [GoogleMapsAPIWrapper],
  exports: [SettingsComponent],
})
export class SettingsModule {}
