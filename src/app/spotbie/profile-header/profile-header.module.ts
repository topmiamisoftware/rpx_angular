import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProfileHeaderComponent } from './profile-header.component'
import { AlbumsModule } from './albums/albums.module'
import { ContactmeModule } from './contactme/contactme.module'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { SpotbiePipesModule } from '../../spotbie-pipes/spotbie-pipes.module'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HelperModule } from 'src/app/helpers/helper.module';
import { FriendActionsComponent } from './friend-actions/friend-actions.component'
import { TokenInterceptor } from 'src/app/helpers/token-interceptor/token-interceptor.service'
@NgModule({
  declarations: [
    ProfileHeaderComponent,
    FriendActionsComponent,
  ],
  imports: [
    CommonModule,
    AlbumsModule,
    ContactmeModule,
    HttpClientModule,
    SpotbiePipesModule,
    ReactiveFormsModule,
    FormsModule,
    HelperModule,
  ],
  exports : [ProfileHeaderComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ]
})
export class ProfileHeaderModule { }
