import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SingleAdComponent } from './single-ad/single-ad.component'

@NgModule({
  declarations: [
    SingleAdComponent,
  ],
  imports: [
    CommonModule
  ],
  exports : [
    SingleAdComponent
  ]
})
export class AdsModule { }
