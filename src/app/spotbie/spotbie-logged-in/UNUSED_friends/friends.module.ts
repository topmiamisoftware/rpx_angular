import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MyFriendsComponent } from './my-friends/my-friends.component'
import { PendingFriendsComponent } from './pending-friends/pending-friends.component'
import { BlockedUsersComponent } from './blocked-users/blocked-users.component'
import { FriendsComponent } from './friends.component'
import { FriendNotificationsComponent } from './friend-notifications/friend-notifications.component'
import { RouterModule } from '@angular/router'
import { HelperModule } from 'src/app/helpers/helper.module'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { BlockedUserActionsComponent } from './blocked-users/blocked-user-actions/blocked-user-actions.component'
import { FriendActionsComponent } from './my-friends/friend-actions/friend.actions.component'
import { PendingFriendActionsComponent } from './pending-friends/pending-friend-actions/pending-friend-actions.component'
import { AroundMeComponent } from './around-me/around-me.component'
import { AroundMeActionsComponent } from './around-me/around-me-actions/around-me-actions.component'
import { TokenInterceptor } from 'src/app/helpers/token-interceptor/token-interceptor.service'

@NgModule({
  declarations: [
    MyFriendsComponent,
    PendingFriendActionsComponent,
    PendingFriendsComponent,
    BlockedUsersComponent,
    BlockedUserActionsComponent,
    FriendActionsComponent,    
    FriendsComponent,
    FriendNotificationsComponent,
    AroundMeComponent,
    AroundMeActionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HelperModule, 
    HttpClientModule  
  ],
  exports: [
    FriendsComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ]
})
export class FriendsModule { }
