import { NgModule } from '@angular/core'
import { Routes, RouterModule, ExtraOptions } from '@angular/router'
import { TermsComponent } from './terms/terms.component'
import { ForgotPasswordComponent } from './spotbie/spotbie-logged-out/forgot-password/forgot-password.component'
import { LoginGuardServiceService } from './route-services/login-guard-service.service'
import { UserComponent } from './user/user.component'
import { UserMetaService } from './user/user-meta/user-meta.service'
import { InfoObjectComponent } from './spotbie/map/info-object/info-object.component'
import { BugsComponent } from './bugs/bugs.component'
import { LoyaltyPointsComponent } from './spotbie/spotbie-logged-in/loyalty-points/loyalty-points.component'
import { BusinessMenuComponent } from './spotbie/spotbie-logged-in/business-menu/business-menu.component'

let user_service = new UserMetaService()

export const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'terms', component: TermsComponent },
  { path: 'bugs', component: BugsComponent },
  { path: 'password', component: ForgotPasswordComponent },
  { path: 'password/reset/:token', component: ForgotPasswordComponent },
  { path: 'business-menu/:userHash/:qrCode', component: BusinessMenuComponent},
  { path: 'loyalty-points/scan/:userHash/:qrCode/:totalSpent/:loyaltyPointReward', component: LoyaltyPointsComponent },
  { path: 'place-to-eat/:name/:id', component: InfoObjectComponent },
  { path: 'shopping/:name/:id', component: InfoObjectComponent },
  { path: 'event/:name/:id', component: InfoObjectComponent },
  { path: 'user-profile',  
    children: [                       
      { path: ':exe_user_name', component: UserComponent,
        data: user_service.getUserProfileMeta(),      
      },
      { path: ':exe_user_name/albums/:album_id', component: UserComponent },
      { path: ':exe_user_name/albums/:album_id/media/:album_media_id', component: UserComponent },
      { path: ':exe_user_name/posts/:stream_post_id', component: UserComponent }
  ]}, 
  { path: 'user-home', loadChildren: () => import('./user-home/user-home.module').then(m => m.UserHomeModule), canActivate: [LoginGuardServiceService] },  
  { path: '', redirectTo: '/home', pathMatch: 'full' }
]

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64],
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
