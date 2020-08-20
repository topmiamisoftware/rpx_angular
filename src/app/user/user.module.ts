import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { StreamerModule } from '../streamer/streamer.module';
import { UserComponent } from './user.component';
import { MenuModule } from '../spotbie/menu.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    StreamerModule,
    HttpClientModule,
    MenuModule
  ],
  exports: [UserComponent]
})
export class UserModule { }
