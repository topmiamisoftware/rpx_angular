import { CommentsComponent } from './comments.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SpotbiePipesModule } from 'src/app/spotbie-pipes/spotbie-pipes.module';
import { RouterModule } from '@angular/router';
import { HelperModule } from 'src/app/helpers/helper.module';

@NgModule({
  declarations: [
    CommentsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SpotbiePipesModule,
    RouterModule,
    HelperModule 
  ],
  exports : [CommentsComponent],
  providers : []
})
export class CommentsModule { }
