import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AgmCoreModule, GoogleMapsAPIWrapper, MarkerManager } from '@agm/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { DeviceDetectorService } from 'ngx-device-detector'

import { BackgroundColorComponent } from './background-color/background-color.component'
import { MapComponent } from './map/map.component'
import { FriendsComponent } from './friends/friends.component'
import { MyFriendsComponent } from './my-friends/my-friends.component'
import { PendingFriendsComponent } from './pending-friends/pending-friends.component'
import { FriendActionsComponent } from './friend-actions/friend-actions.component'
import { PendingFriendActionsComponent } from './pending-friend-actions/pending-friend-actions.component'
import { AroundMeComponent } from './around-me/around-me.component'
import { AroundMeActionsComponent } from './around-me-actions/around-me-actions.component'

import { BlockedUsersComponent } from './blocked-users/blocked-users.component'
import { BlockedUserActionsComponent } from './blocked-user-actions/blocked-user-actions.component'

import { MissingPeopleComponent } from './missing-people/missing-people.component'
import { MyPlacesComponent } from './my-places/my-places.component'

import { NotificationsComponent } from './notifications/notifications.component'
import { StreamNotificationsComponent } from './stream-notifications/stream-notifications.component'

import { SettingsComponent } from './settings/settings.component'

import { MessagingComponent } from './messaging/messaging.component'
import { PairingComponent } from './pairing/pairing.component'

import { FriendNotificationsComponent } from './friend-notifications/friend-notifications.component'
import { MsgNotificationsComponent } from './msg-notifications/msg-notifications.component'

import { TagNotificationsComponent } from './tag-notifications/tag-notifications.component'
import { AllNotificationsComponent } from './all-notifications/all-notifications.component'

import { MediaPlayerMainComponent } from './media_player/media-player-main/media-player-main.component'
import { MediaPlayerContentComponent } from './media_player/media-player-content/media-player-content.component'
import { MediaPlayerMapComponent } from './media_player/media-player-map/media-player-map.component'
import { MediaPlayerStreamComponent } from './media_player/media-player-stream/media-player-stream.component'

import { SearchComponent } from './search/search.component'

import { LocationSaverComponent } from './location-saver/location-saver.component'
import { DriverModeComponent } from './driver-mode/driver-mode.component'
import { MatcherComponent } from './matcher/matcher.component'

import { MapObjectIconPipe } from '../../pipes/map-object-icon.pipe'
import { AgmOverlays } from "agm-overlays"

import { InfoObjectComponent } from './info-object/info-object.component'

import { HttpClientModule } from '@angular/common/http'
import { MenuLoggedInComponent } from './menu-logged-in.component'
import { ProfileHeaderModule } from 'src/app/spotbie/profile-header/profile-header.module'
import { SpotbiePipesModule } from 'src/app/spotbie-pipes/spotbie-pipes.module'
import { RouterModule } from '@angular/router'
import { ColorPickerModule } from 'ngx-color-picker'
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { environment } from 'src/environments/environment'
import { HelperModule } from 'src/app/helpers/helper.module'

import { MatSliderModule } from '@angular/material/slider'
import { MessagingChatComponent } from './messaging/messaging-chat/messaging-chat.component'

export const options : Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    AllNotificationsComponent,    
    AroundMeComponent,
    AroundMeActionsComponent,
    BackgroundColorComponent,
    BlockedUserActionsComponent,     
    BlockedUsersComponent,
    DriverModeComponent,
    FriendActionsComponent,    
    FriendsComponent,
    FriendNotificationsComponent,
    InfoObjectComponent,    
    LocationSaverComponent,      
    MapComponent,
    MatcherComponent,    
    MediaPlayerMainComponent,
    MediaPlayerContentComponent,
    MediaPlayerMapComponent,
    MediaPlayerStreamComponent,    
    MenuLoggedInComponent,
    MessagingComponent,
    MessagingChatComponent,    
    MissingPeopleComponent,
    MsgNotificationsComponent,             
    MyFriendsComponent,
    MyPlacesComponent,
    NotificationsComponent,
    PairingComponent,  
    PendingFriendActionsComponent,
    PendingFriendsComponent,   
    SearchComponent,
    SettingsComponent,   
    StreamNotificationsComponent,    
    TagNotificationsComponent,                  
  ],
  imports: [
    AgmOverlays,    
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    ProfileHeaderModule,
    SpotbiePipesModule,
    ColorPickerModule,
    RouterModule,
    HelperModule,
    MatSliderModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_maps_apiKey,
      language: 'en',
      libraries: ['geometry', 'places']
    }),
    NgxMaskModule.forRoot(options)
  ],
  providers: [
    DeviceDetectorService,
    MarkerManager,
    GoogleMapsAPIWrapper,
    MapObjectIconPipe
  ],
  exports: [MenuLoggedInComponent] 
})
export class MenuLoggedInRoutingModule { }
