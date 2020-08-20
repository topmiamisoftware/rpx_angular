import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { StreamPosterComponent } from './stream-poster/stream-poster.component';
import { DeletePostComponent } from './delete-post/delete-post.component';
import { StreamerComponent } from './streamer.component';

import { LazyLoadImageModule, scrollPreset, LazyLoadImageDirective } from 'ng-lazyload-image'; 
import { PostReportComponent } from './post-report/post-report.component';
import { PostShareComponent } from './post-share/post-share.component';
import { ExtraMediaUploadPipe } from '../pipes/extra-media-upload.pipe';
import { SpotbiePipesModule } from '../spotbie-pipes/spotbie-pipes.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StreamPostEditorComponent } from './stream-post-editor/stream-post-editor.component';
import { ShareModule } from '@ngx-share/core';
import { NgxFontAwesomeModule } from 'ngx-font-awesome';
import { StreamPostComponent } from './stream-post/stream-post.component';
import { CommentsModule } from '../spotbie/comments/comments.module';
import { ReposterComponent } from './reposter/reposter.component';
import { ViewStreamPostComponent } from './view-stream-post/view-stream-post.component';
import { HelperModule } from '../helpers/helper.module';

@NgModule({
  declarations: [
    StreamerComponent,
    StreamPosterComponent,
    DeletePostComponent,
    PostShareComponent,
    PostReportComponent,
    ReposterComponent,
    StreamPostEditorComponent,
    ExtraMediaUploadPipe,
    StreamPostComponent,
    ViewStreamPostComponent,
  ],
  imports: [
    ShareModule,
    CommonModule,
    HttpClientModule,
    SpotbiePipesModule,
    RouterModule,
    PickerModule,
    ReactiveFormsModule,
    FormsModule,
    NgxFontAwesomeModule,
    HelperModule,
    LazyLoadImageModule.forRoot({
      preset: scrollPreset // <-- tell LazyLoadImage that you want to use scrollPreset
    }),
    CommentsModule    
  ],
  exports : [StreamerComponent]
})
export class StreamerModule { }
