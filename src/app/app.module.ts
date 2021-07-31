import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { DeviceDetectorService } from 'ngx-device-detector'

import { AppComponent } from './app.component'

import { HomeModule } from './home/home.module'
import { UserHomeModule } from './user-home/user-home.module'
import { UserModule } from './user/user.module'

import { UrlSanitizerPipe } from './pipes/url-sanitizer.pipe'

import { VersionCheckService } from './services/version-check.service'
import { HelperModule } from './helpers/helper.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TokenInterceptor } from './helpers/token-interceptor/token-interceptor.service'
import { ServiceWorkerModule } from '@angular/service-worker'
import { environment } from '../environments/environment'
import { TermsComponent } from './terms/terms.component'
import { BugsComponent } from './bugs/bugs.component'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login'

@NgModule({
  declarations: [
    AppComponent,
    UrlSanitizerPipe,
    TermsComponent,
    BugsComponent
  ],
  imports: [
    FormsModule, 
    ReactiveFormsModule,        
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    TransferHttpCacheModule,
    HttpClientModule,
    HomeModule,
    UserHomeModule,
    UserModule,
    HelperModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })  
  ],  
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1054707215391-hsev2vpin6abf6rp3b3ibd0nnuuracou.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('555919295437570')
          }
        ]
      } as SocialAuthServiceConfig,
    },      
    DeviceDetectorService,
    VersionCheckService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }