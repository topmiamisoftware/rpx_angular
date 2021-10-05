import { NgModule } from '@angular/core'
import { Routes, RouterModule, ExtraOptions } from '@angular/router'
import { TermsComponent } from './spotbie/terms/terms.component'
import { LoginGuardServiceService } from './route-services/login-guard-service.service'
import { InfoObjectComponent } from './spotbie/map/info-object/info-object.component'
import { BugsComponent } from './bugs/bugs.component'
import { LoyaltyPointsComponent } from './spotbie/spotbie-logged-in/loyalty-points/loyalty-points.component'
import { BusinessMenuComponent } from './spotbie/spotbie-logged-in/business-menu/business-menu.component'

export const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'business', loadChildren: () => import('./business/business.module').then(m => m.BusinessModule) },
  { path: 'terms', component: TermsComponent },  
  { path: 'bugs', component: BugsComponent },

  //Please lazy load this.
  { path: 'password', loadChildren: () => import('./spotbie/spotbie-logged-out/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule ) },
  
  { path: 'user-home', loadChildren: () => import('./user-home/user-home.module').then(m => m.UserHomeModule), canActivate: [LoginGuardServiceService] }, 

  { path: 'business-menu/:userHash/:qrCode', component: BusinessMenuComponent},
  { path: 'loyalty-points/scan/:userHash/:qrCode/:totalSpent/:loyaltyPointReward', component: LoyaltyPointsComponent },
  
  { path: 'place-to-eat/:name/:id', component: InfoObjectComponent },
  { path: 'shopping/:name/:id', component: InfoObjectComponent },
  { path: 'event/:name/:id', component: InfoObjectComponent },

  { path: 'user-profile', loadChildren: () => import('./user/user.module').then(m => m.UserModule ) }, 
  
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
