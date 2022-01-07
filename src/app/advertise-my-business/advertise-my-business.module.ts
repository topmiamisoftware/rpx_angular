import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { EventComponent } from './event/event.component';
import { RetailStoreComponent } from './retail-store/retail-store.component';
import { RouterModule, Routes } from '@angular/router';
import { AdvertiseMyBusinessComponent } from './advertise-my-business.component';

export const ROUTES: Routes = [
  { path: '', component: AdvertiseMyBusinessComponent }, 
  { path: 'restaurant', component: RestaurantComponent },  
  { path: 'retail-store', component: EventComponent },
  { path: 'events', component: RetailStoreComponent }
]

@NgModule({
  declarations: [
    RestaurantComponent,
    EventComponent,
    RetailStoreComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class AdvertiseMyBusinessModule { }