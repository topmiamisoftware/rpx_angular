import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MenuLoggedOutComponent } from './menu-logged-out.component'
import { LogInComponent } from 'src/app/spotbie/spotbie-logged-out/log-in/log-in.component'
import { SignUpComponent } from 'src/app/spotbie/spotbie-logged-out/sign-up/sign-up.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { HelperModule } from 'src/app/helpers/helper.module'
import { MatDialogModule } from '@angular/material/dialog'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { ForgotPasswordModule } from './forgot-password/forgot-password.module'

export const options : Partial<IConfig> | (() => Partial<IConfig>) = null

@NgModule({
  declarations: [
    MenuLoggedOutComponent,
    LogInComponent,
    SignUpComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    HelperModule,
    MatDialogModule,
    FontAwesomeModule,
    ForgotPasswordModule,
    NgxMaskModule.forRoot(options)
  ],
  exports : [ MenuLoggedOutComponent ],
})
export class MenuLoggedOutModule { }