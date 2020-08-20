import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumMediaUploadPipe } from '../pipes/album-media-upload.pipe';
import { SanitizePipe } from '../pipes/sanitize.pipe';
import { SafePipe } from '../pipes/safe.pipe';
import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { DateFormatPipe, TimeFormatPipe } from '../pipes/date-format.pipe';
import { NumberFormatPipe } from '../pipes/number-format.pipe';

@NgModule({
  declarations: [
    AlbumMediaUploadPipe,
    SanitizePipe,
    SafePipe,
    DefaultImagePipe,
    DateFormatPipe,
    TimeFormatPipe,
    NumberFormatPipe
  ],
  imports: [
    CommonModule
  ],
  exports : [
    AlbumMediaUploadPipe,
    SanitizePipe,
    SafePipe,
    DefaultImagePipe,  
    DateFormatPipe,
    TimeFormatPipe,
    NumberFormatPipe
  ]
})
export class SpotbiePipesModule { }
