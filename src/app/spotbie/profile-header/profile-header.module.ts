import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProfileHeaderComponent } from './profile-header.component'
import { AlbumsModule } from './albums/albums.module'
import { ContactmeModule } from './contactme/contactme.module'
import { HttpClientModule } from '@angular/common/http'
import { SpotbiePipesModule } from '../../spotbie-pipes/spotbie-pipes.module'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HelperModule } from 'src/app/helpers/helper.module';
import { FriendActionsComponent } from './friend-actions/friend-actions.component'
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
  exports : [ProfileHeaderComponent]
})
export class ProfileHeaderModule { }
