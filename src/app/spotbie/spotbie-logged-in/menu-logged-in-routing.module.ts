import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { DeviceDetectorService } from 'ngx-device-detector'

import { BackgroundColorComponent } from './background-color/background-color.component'

import { MissingPeopleComponent } from './missing-people/missing-people.component'

import { NotificationsComponent } from './notifications/notifications.component'
import { StreamNotificationsComponent } from './stream-notifications/stream-notifications.component'

import { SettingsComponent } from './settings/settings.component'

import { MessagingComponent } from './messaging/messaging.component'
import { PairingComponent } from './pairing/pairing.component'

import { MsgNotificationsComponent } from './msg-notifications/msg-notifications.component'

import { TagNotificationsComponent } from './tag-notifications/tag-notifications.component'
import { AllNotificationsComponent } from './all-notifications/all-notifications.component'

import { MediaPlayerMainComponent } from './media_player/media-player-main/media-player-main.component'
import { MediaPlayerContentComponent } from './media_player/media-player-content/media-player-content.component'
import { MediaPlayerMapComponent } from './media_player/media-player-map/media-player-map.component'
import { MediaPlayerStreamComponent } from './media_player/media-player-stream/media-player-stream.component'

import { SearchComponent } from './search/search.component'

import { DriverModeComponent } from './driver-mode/driver-mode.component'
import { MatcherComponent } from './matcher/matcher.component'

import { HttpClientModule } from '@angular/common/http'
import { MenuLoggedInComponent } from './menu-logged-in.component'
import { ProfileHeaderModule } from 'src/app/spotbie/profile-header/profile-header.module'
import { SpotbiePipesModule } from 'src/app/spotbie-pipes/spotbie-pipes.module'
import { RouterModule } from '@angular/router'
import { ColorPickerModule } from 'ngx-color-picker'
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { HelperModule } from 'src/app/helpers/helper.module'
import { MessagingChatComponent } from './messaging/messaging-chat/messaging-chat.component'
import { MapModule } from '../map/map.module'

import { FriendsModule } from './friends/friends.module'

export const options : Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    AllNotificationsComponent,    
    BackgroundColorComponent,
    DriverModeComponent,
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
    NotificationsComponent,
    PairingComponent,   
    SearchComponent,
    SettingsComponent,   
    StreamNotificationsComponent,    
    TagNotificationsComponent,
  ],
  imports: [  
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    ProfileHeaderModule,
    SpotbiePipesModule,
    ColorPickerModule,
    RouterModule,
    HelperModule,
    MapModule,
    FriendsModule,
    NgxMaskModule.forRoot(options)
  ],
  providers: [
    DeviceDetectorService
  ],
  exports: [MenuLoggedInComponent] 
})
export class MenuLoggedInRoutingModule { }