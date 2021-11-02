import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SingleAdComponent } from './single-ad/single-ad.component'
import { CommunityMemberModule } from '../community-member/community-member.module'
import { BottomAdBannerComponent } from './bottom-ad-banner/bottom-ad-banner.component';
import { NearbyFeaturedAdComponent } from './nearby-featured-ad/nearby-featured-ad.component'

@NgModule({
  declarations: [
    SingleAdComponent,
    BottomAdBannerComponent,
    NearbyFeaturedAdComponent
  ],
  imports: [
    CommonModule,
    CommunityMemberModule
  ],
  exports : [
    SingleAdComponent,
    BottomAdBannerComponent,
    NearbyFeaturedAdComponent
  ]
})
export class AdsModule { }
