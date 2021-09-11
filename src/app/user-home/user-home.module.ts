import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserHomeComponent } from './user-home.component';
import { MenuLoggedInRoutingModule } from '../spotbie/spotbie-logged-in/menu-logged-in-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { HelperModule } from '../helpers/helper.module';

const routes : Routes = [
  { path : '', component : UserHomeComponent }
];

@NgModule({
  declarations: [
    UserHomeComponent
  ],
  imports: [
    CommonModule,
    HelperModule,
    MenuLoggedInRoutingModule,
    RouterModule.forChild(routes)
  ],
  exports: [UserHomeComponent]
})
export class UserHomeModule { }