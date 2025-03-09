import {
  BrowserModule,
  BrowserTransferStateModule,
} from '@angular/platform-browser';
import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {DeviceDetectorService} from 'ngx-device-detector';
import {AppComponent} from './app.component';
import {HomeModule} from './home/home.module';
import {UrlSanitizerPipe} from './pipes/url-sanitizer.pipe';
import {VersionCheckService} from './services/version-check.service';
import {HelperModule} from './helpers/helper.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TokenInterceptor} from './helpers/token-interceptor/token-interceptor.service';
import {TermsComponent} from './spotbie/terms/terms.component';
import {BugsComponent} from './bugs/bugs.component';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import * as Sentry from '@sentry/angular';
import {Router} from '@angular/router';
import {HowDoesItWorkComponent} from './pages/how-does-it-work/how-does-it-work.component';
import {DoesItWorkComponent} from './pages/does-it-work/does-it-work.component';
import {DeleteAccountComponent} from './spotbie/delete-account/delete-account.component';
import {EulaComponent} from './eula/eula.component';

@NgModule({
  declarations: [
    AppComponent,
    UrlSanitizerPipe,
    TermsComponent,
    EulaComponent,
    DeleteAccountComponent,
    BugsComponent,
    HowDoesItWorkComponent,
    DoesItWorkComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    BrowserTransferStateModule,
    TransferHttpCacheModule,
    HttpClientModule,
    HomeModule,
    HelperModule,
    BrowserAnimationsModule,
  ],
  providers: [
    DeviceDetectorService,
    VersionCheckService,
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
