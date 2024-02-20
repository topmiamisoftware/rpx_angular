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
import {UserHomeModule} from './user-home/user-home.module';
import {UrlSanitizerPipe} from './pipes/url-sanitizer.pipe';
import {VersionCheckService} from './services/version-check.service';
import {HelperModule} from './helpers/helper.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TokenInterceptor} from './helpers/token-interceptor/token-interceptor.service';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {TermsComponent} from './spotbie/terms/terms.component';
import {BugsComponent} from './bugs/bugs.component';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserauthService} from './services/userauth.service';
import {StripeModule} from 'stripe-angular';
import {MakePaymentModule} from './make-payment/make-payment.module';
import * as Sentry from '@sentry/angular';
import {Router} from '@angular/router';
import {HowDoesItWorkComponent} from './how-does-it-work/how-does-it-work.component';
import {DoesItWorkComponent} from './does-it-work/does-it-work.component';
import {NgxsModule, NoopNgxsExecutionStrategy} from '@ngxs/store';
import {NgxsDataPluginModule} from '@angular-ru/ngxs';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {
  NGXS_DATA_STORAGE_CONTAINER,
  NGXS_DATA_STORAGE_EXTENSION,
} from '@angular-ru/ngxs/storage';
import {LoyaltyPointsState} from './spotbie/spotbie-logged-in/state/lp.state';
import {BusinessLoyaltyPointsState} from './spotbie/spotbie-logged-in/state/business.lp.state';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';

@NgModule({
  declarations: [
    AppComponent,
    UrlSanitizerPipe,
    TermsComponent,
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
    UserHomeModule,
    HelperModule,
    MakePaymentModule,
    BrowserAnimationsModule,
    StripeModule.forRoot(''),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    NgxsModule.forRoot([LoyaltyPointsState, BusinessLoyaltyPointsState], {
      developmentMode: !environment.production,
      executionStrategy: NoopNgxsExecutionStrategy,
    }),
    NgxsLoggerPluginModule.forRoot(),
    NgxsDataPluginModule.forRoot([
      NGXS_DATA_STORAGE_EXTENSION,
      NGXS_DATA_STORAGE_CONTAINER,
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production,
    }),
  ],
  providers: [
    DeviceDetectorService,
    VersionCheckService,
    UserauthService,
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
