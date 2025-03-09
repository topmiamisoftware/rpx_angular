import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {MenuModule} from '../spotbie/menu.module';
import {SpotbiePipesModule} from '../spotbie-pipes/spotbie-pipes.module';
import {HelperModule} from '../helpers/helper.module';
import {BusinessComponent} from './business.component';
import {MenuLoggedOutModule} from '../spotbie/spotbie-logged-out/menu-logged-out.module';
import { BusinessFeaturesComponent } from '../features/business-features/business-features.component';

const routes: Routes = [
  {path: '', component: BusinessComponent, pathMatch: 'full'},
];

@NgModule({
  declarations: [
    BusinessComponent,
    BusinessFeaturesComponent
  ],
  imports: [
    CommonModule,
    MenuLoggedOutModule,
    MenuModule,
    SpotbiePipesModule,
    HelperModule,
    RouterModule.forChild(routes),
  ],
  exports: [BusinessComponent],
})
export class BusinessModule {}
