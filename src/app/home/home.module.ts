import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {Routes, RouterModule} from '@angular/router';
import {MenuModule} from '../spotbie/menu.module';
import {SpotbiePipesModule} from '../spotbie-pipes/spotbie-pipes.module';
import {HelperModule} from '../helpers/helper.module';
import {MenuLoggedOutModule} from '../spotbie/spotbie-logged-out/menu-logged-out.module';
import { UserFeaturesComponent } from '../features/user-features/user-features.component';
import { DownloadMobileModule } from '../pages/download-mobile/download-mobile.module';

const routes: Routes = [{path: '', component: HomeComponent}];

@NgModule({
  declarations: [
    HomeComponent,
    UserFeaturesComponent
  ],
  imports: [
    DownloadMobileModule,
    CommonModule,
    MenuLoggedOutModule,
    MenuModule,
    SpotbiePipesModule,
    HelperModule,
    RouterModule.forChild(routes),
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
