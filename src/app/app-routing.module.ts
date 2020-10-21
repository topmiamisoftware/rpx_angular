import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TermsComponent } from './terms/terms.component';
import { ForgotPasswordComponent } from './spotbie/spotbie-logged-out/forgot-password/forgot-password.component';
import { LoginGuardServiceService } from './route-services/login-guard-service.service';
import { UserComponent } from './user/user.component';
import { UserMetaService } from './user/user-meta/user-meta.service'
import { MetaService } from '@ngx-meta/core';
import { MetaGuard } from '@ngx-meta/core';

let user_service = new UserMetaService()

export const routes: Routes = [
  { path: 'home',  loadChildren: './home/home.module#HomeModule'},
  { path: 'terms', component: TermsComponent },
  { path: 'password', component: ForgotPasswordComponent },
  { path: 'password/reset/:token', component: ForgotPasswordComponent },
  { path: 'user-profile',
    canActivateChild: [MetaGuard],   
    children: [                       
      { path: ':exe_user_name', component: UserComponent,
        data: user_service.getUserProfileMeta(),      
      },
      { path: ':exe_user_name/albums/:album_id', component: UserComponent},
      { path: ':exe_user_name/albums/:album_id/media/:album_media_id', component: UserComponent},
      { path: ':exe_user_name/posts/:stream_post_id', component: UserComponent}
  ]}, 
  { path: 'user_home', loadChildren: './user-home/user-home.module#UserHomeModule', canActivate: [LoginGuardServiceService] },  
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [MetaService]
})
export class AppRoutingModule { }
