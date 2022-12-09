import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser'
import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core'
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
import { TermsComponent } from './spotbie/terms/terms.component'
import { BugsComponent } from './bugs/bugs.component'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { UserauthService } from './services/userauth.service'
import { StoreModule } from '@ngrx/store'
import { loyaltyPointsReducer } from './spotbie/spotbie-logged-in/loyalty-points/loyalty-points.reducer';
import { StripeModule } from 'stripe-angular';
import { MakePaymentModule } from './make-payment/make-payment.module';
import * as Sentry from '@sentry/angular';
import {Router} from '@angular/router';

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
    MakePaymentModule,
    BrowserAnimationsModule,
    StripeModule.forRoot(''),
    StoreModule.forRoot({
      loyaltyPoints: loyaltyPointsReducer
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
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
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
