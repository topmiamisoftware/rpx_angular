import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuLoggedOutComponent} from './menu-logged-out.component';
import {HelperModule} from '../../helpers/helper.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {PricingComponent} from '../../pricing/pricing.component';

@NgModule({
  declarations: [
    MenuLoggedOutComponent,
    PricingComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    HelperModule,
    FontAwesomeModule,
  ],
  exports: [MenuLoggedOutComponent],
})
export class MenuLoggedOutModule {}
