import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuLoggedOutRoutingModule } from './spotbie-logged-out/menu-logged-out-routing.module';
import { MenuLoggedInRoutingModule } from './spotbie-logged-in/menu-logged-in-routing.module';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { HelperModule } from '../helpers/helper.module';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    MenuComponent,
    EmailConfirmationComponent,
  ],
  imports: [
    CommonModule,
    MenuLoggedInRoutingModule,
    MenuLoggedOutRoutingModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    HelperModule,
    RouterModule
  ],
  exports : [
    MenuComponent,
    EmailConfirmationComponent
  ]
})
export class MenuModule { }
