import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AlbumsComponent } from './albums.component'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { SpotbiePipesModule } from '../../../spotbie-pipes/spotbie-pipes.module'
import { ShareAlbumComponent } from './share-album/share-album.component'
import { EditMediaComponent } from './edit-media/edit-media.component'
import { ShareMediaComponent } from './share-media/share-media.component'
import { ViewMediaComponent } from './view-media/view-media.component'
import { AlbumMediaLikesComponent } from './album-media-likes/album-media-likes.component'
import { ShareModule } from '@ngx-share/core'
import { NgxFontAwesomeModule } from 'ngx-font-awesome'
import { AlbumService } from './album-services/album.service'
import { RouterModule } from '@angular/router'
import { CommentsModule } from '../../comments/comments.module'
import { HelperModule } from 'src/app/helpers/helper.module'

@NgModule({
  declarations: [
    AlbumsComponent, 
    ShareAlbumComponent, 
    EditMediaComponent, 
    ShareMediaComponent, 
    ViewMediaComponent,
    AlbumMediaLikesComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SpotbiePipesModule,
    ShareModule,
    NgxFontAwesomeModule,
    CommentsModule,
    RouterModule,
    HelperModule
  ],
  exports : [AlbumsComponent],
  providers : [AlbumService]
})
export class AlbumsModule { }
