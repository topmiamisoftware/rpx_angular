import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MenuLoggedOutComponent } from './menu-logged-out.component'
import { LogInComponent } from 'src/app/spotbie/spotbie-logged-out/log-in/log-in.component'
import { LastLoggedComponent } from 'src/app/spotbie/spotbie-logged-out/last-logged/last-logged.component'
import { SignUpComponent } from 'src/app/spotbie/spotbie-logged-out/sign-up/sign-up.component'
import { ForgotPasswordComponent } from 'src/app/spotbie/spotbie-logged-out/forgot-password/forgot-password.component'
import { ReadAboutComponent } from 'src/app/spotbie/read-about/read-about.component'
import { TermsComponent } from 'src/app/terms/terms.component'
import { FeaturesComponent } from 'src/app/spotbie/features/features.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { ProfileHeaderModule } from 'src/app/spotbie/profile-header/profile-header.module'
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { HelperModule } from 'src/app/helpers/helper.module'

export const options : Partial<IConfig> | (() => Partial<IConfig>) = null

@NgModule({
  declarations: [
    MenuLoggedOutComponent,
    LogInComponent,
    LastLoggedComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ReadAboutComponent,
    TermsComponent,
    FeaturesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ProfileHeaderModule,
    RouterModule,
    HelperModule,
    NgxMaskModule.forRoot(options)
  ],
  exports : [ MenuLoggedOutComponent ],
})
export class MenuLoggedOutRoutingModule { }
