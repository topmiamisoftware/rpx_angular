import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';

import { AppComponent } from './app.component';

import { HomeModule } from './home/home.module';
import { UserHomeModule } from './user-home/user-home.module';
import { UserModule } from './user/user.module';

import { UrlSanitizerPipe } from './pipes/url-sanitizer.pipe';

import { VersionCheckService } from './services/version-check.service';
import { MetaModule } from '@ngx-meta/core';
import { HelperModule } from './helpers/helper.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './helpers/token-interceptor/token-interceptor.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TermsComponent } from './terms/terms.component';
import { BugsComponent } from './bugs/bugs.component';

@NgModule({
  declarations: [
    AppComponent,
    UrlSanitizerPipe,
    TermsComponent,
    BugsComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    HomeModule,
    UserHomeModule,
    UserModule,
    HelperModule,
    MetaModule.forRoot(),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })  
  ],  
  providers: [
    DeviceDetectorService,
    VersionCheckService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }