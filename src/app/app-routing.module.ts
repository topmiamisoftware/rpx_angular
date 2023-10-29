import { NgModule } from '@angular/core'
import { Routes, RouterModule, ExtraOptions } from '@angular/router'
import { TermsComponent } from './spotbie/terms/terms.component'
import { LoginGuardServiceService } from './services/route-services/login-guard-service.service'
import { InfoObjectComponent } from './spotbie/map/info-object/info-object.component'
import { BugsComponent } from './bugs/bugs.component'
import { LoyaltyPointsComponent } from './spotbie/spotbie-logged-in/loyalty-points/loyalty-points.component'
import { RewardMenuComponent } from './spotbie/spotbie-logged-in/reward-menu/reward-menu.component'
import { EulaComponent } from './eula/eula.component'
import {HowDoesItWorkComponent} from './how-does-it-work/how-does-it-work.component';
import {DoesItWorkComponent} from './does-it-work/does-it-work.component';
import {PricingComponent} from "./pricing/pricing.component";

export const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'business', loadChildren: () => import('./business/business.module').then(m => m.BusinessModule) },
  { path: 'terms', component: TermsComponent },
  { path: 'terms', component: EulaComponent },
  { path: 'bugs', component: BugsComponent },
  // { path: 'beta', component: BetaComponent },
  { path: 'how-does-it-work', component: HowDoesItWorkComponent},
  { path: 'the-idea', component: DoesItWorkComponent },
  { path: 'earn-loyalty-points', component: BugsComponent },
  { path: 'award-loyalty-points', component: BugsComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'password', loadChildren: () => import('./spotbie/spotbie-logged-out/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule ) },
  { path: 'user-home', loadChildren: () => import('./user-home/user-home.module').then(m => m.UserHomeModule), canActivate: [LoginGuardServiceService] },
  { path: 'business-menu/:qrCode/:rewardUuid', component: RewardMenuComponent},
  { path: 'business-menu/:qrCode', component: RewardMenuComponent},
  { path: 'community', loadChildren: () => import('./spotbie/community-member/community-member.module').then(m => m.CommunityMemberModule ) },
  { path: 'loyalty-points/:qrCode/:totalSpent/:loyaltyPointReward', component: LoyaltyPointsComponent },
  { path: 'place-to-eat/:name/:id', component: InfoObjectComponent },
  { path: 'shopping/:name/:id', component: InfoObjectComponent },
  { path: 'event/:name/:id', component: InfoObjectComponent },
  { path: 'make-payment', loadChildren: () => import('./make-payment/make-payment.module').then(m => m.MakePaymentModule ) },
  { path: 'schedule-demo', redirectTo: '/business#scheduleDemo'},
  { path: '', redirectTo: '/business', pathMatch: 'full' },
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
