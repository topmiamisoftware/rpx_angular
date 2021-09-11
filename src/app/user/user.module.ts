import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { UserComponent } from './user.component';
import { MenuModule } from '../spotbie/menu.module';
import { HttpClientModule } from '@angular/common/http';
import { HelperModule } from '../helpers/helper.module';

@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    MenuModule,
    HelperModule
  ],
  exports: [UserComponent]
})
export class UserModule { }
