import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyFavoritesComponent } from './my-favorites.component';
import { HelperModule } from 'src/app/helpers/helper.module';
import { InfoObjectModule } from '../map/info-object/info-object.module';

@NgModule({
  declarations: [
    MyFavoritesComponent
  ],
  imports: [
    CommonModule,
    HelperModule,
    InfoObjectModule
  ],
  exports: [
    MyFavoritesComponent
  ]
})
export class MyFavoritesModule { }
