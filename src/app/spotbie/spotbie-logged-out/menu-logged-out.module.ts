import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MenuLoggedOutComponent } from './menu-logged-out.component'
import { LogInComponent } from 'src/app/spotbie/spotbie-logged-out/log-in/log-in.component'
import { SignUpComponent } from 'src/app/spotbie/spotbie-logged-out/sign-up/sign-up.component'
import { HelperModule } from 'src/app/helpers/helper.module'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { ForgotPasswordModule } from './forgot-password/forgot-password.module'
import { PricingComponent } from "../../pricing/pricing.component";

@NgModule({
  declarations: [
    MenuLoggedOutComponent,
    LogInComponent,
    SignUpComponent,
    PricingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    HelperModule,
    FontAwesomeModule,
    ForgotPasswordModule,
  ],
  exports : [ MenuLoggedOutComponent ],
})
export class MenuLoggedOutModule { }
