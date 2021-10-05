import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { RouterModule, Routes } from '@angular/router';
import { HelperModule } from 'src/app/helpers/helper.module';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: 'password', component: ForgotPasswordComponent },
  { path: 'password/reset/:token', component: ForgotPasswordComponent }
];


@NgModule({
  declarations: [
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    HelperModule,
    RouterModule.forChild(routes)
  ],
  exports : [ForgotPasswordComponent],
  providers: []
})
export class ForgotPasswordModule { }