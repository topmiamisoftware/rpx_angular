import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamerModule } from '../streamer/streamer.module'
import { UserHomeComponent } from './user-home.component';
import { MenuLoggedInRoutingModule } from '../spotbie/spotbie-logged-in/menu-logged-in-routing.module';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes = [
  { path : '', component : UserHomeComponent }
];

@NgModule({
  declarations: [
    UserHomeComponent
  ],
  imports: [
    CommonModule,
    StreamerModule,
    MenuLoggedInRoutingModule,
    RouterModule.forChild(routes)
  ],
  exports: [UserHomeComponent]
})
export class UserHomeModule { }