import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { MenuModule } from '../spotbie/menu.module';
import { SpotbiePipesModule } from '../spotbie-pipes/spotbie-pipes.module';
import { MapModule } from '../spotbie/map/map.module';
import { MapComponent } from '../spotbie/map/map.component';
import { HelperModule } from '../helpers/helper.module';
import { MenuLoggedOutModule } from '../spotbie/spotbie-logged-out/menu-logged-out.module';

const routes: Routes = [
  { path : '', component : HomeComponent }
];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    MenuLoggedOutModule,
    MenuModule,
    SpotbiePipesModule,
    MapModule,
    HelperModule,
    RouterModule.forChild(routes)
  ],
  exports : [HomeComponent],
  providers: [MapComponent]
})
export class HomeModule { }
