import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {TermsComponent} from './spotbie/terms/terms.component';
import {BugsComponent} from './bugs/bugs.component';
import {EulaComponent} from './eula/eula.component';
import {HowDoesItWorkComponent} from './pages/how-does-it-work/how-does-it-work.component';
import {DoesItWorkComponent} from './pages/does-it-work/does-it-work.component';
import {PricingComponent} from './pricing/pricing.component';
import {RedirectToStoreGuard} from './guards/redirect-to-store.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'business',
    loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
  },
  {path: 'privacy', component: TermsComponent},
  {path: 'terms', component: TermsComponent},
  {path: 'bugs', component: BugsComponent},
  {path: 'how-does-it-work', component: HowDoesItWorkComponent},
  {path: 'the-idea', component: DoesItWorkComponent},
  {path: 'pricing', component: PricingComponent},
  {
    path: 'delete-account-and-data',
    loadChildren: () =>
      import('./pages/delete-account/delete-account.module').then(
        m => m.DeleteAccountModule
      ),
  },
  {
    path: 'promotions/sign-up',
    canActivate: [RedirectToStoreGuard],
  },
  // {path: 'schedule-demo', redirectTo: '/business#scheduleDemo'},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64],
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
