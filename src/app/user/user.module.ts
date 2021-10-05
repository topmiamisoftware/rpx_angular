import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { UserComponent } from './user.component';
import { MenuModule } from '../spotbie/menu.module';
import { HttpClientModule } from '@angular/common/http';
import { HelperModule } from '../helpers/helper.module';
import { UserMetaService } from './user-meta/user-meta.service';
import { RouterModule, Routes } from '@angular/router';

let userMetaService = new UserMetaService()

const routes: Routes = [
  { path: 'user-profile',  
  children: [                       
    { path: ':exe_user_name', component: UserComponent,
      data: userMetaService.getUserProfileMeta(),      
    },
    { path: ':exe_user_name/albums/:album_id', component: UserComponent },
    { path: ':exe_user_name/albums/:album_id/media/:album_media_id', component: UserComponent },
    { path: ':exe_user_name/posts/:stream_post_id', component: UserComponent }
  ]},  
  
];


@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    MenuModule,
    RouterModule.forRoot(routes),
    HelperModule
  ],
  exports: [UserComponent]
})
export class UserModule { }
