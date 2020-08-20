import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuLoggedOutRoutingModule } from './spotbie-logged-out/menu-logged-out-routing.module';
import { MenuLoggedInRoutingModule } from './spotbie-logged-in/menu-logged-in-routing.module';
import { LeaveEndorsementComponent } from './endorsements/leave-endorsement/leave-endorsement.component';
import { EndorsementsComponent } from './endorsements/endorsements/endorsements.component';
import { EndorsedComponent } from './endorsements/endorsements/endorsed/endorsed.component';
import { MyEndorsementsComponent } from './endorsements/endorsements/my-endorsements/my-endorsements.component';
import { BankInfoComponent } from './endorsements/endorsements/bank-info/bank-info.component';

@NgModule({
  declarations: [
    MenuComponent,
    LeaveEndorsementComponent,
    EndorsementsComponent,
    EndorsedComponent,
    MyEndorsementsComponent,
    BankInfoComponent
  ],
  imports: [
    CommonModule,
    MenuLoggedInRoutingModule,
    MenuLoggedOutRoutingModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  exports : [MenuComponent]
})
export class MenuModule { }
