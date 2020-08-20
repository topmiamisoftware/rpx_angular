import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastHelperComponent } from './toast-helper/toast-helper.component';
import { LoadingScreenComponent } from './loading-helper/loading-screen/loading-screen.component';

@NgModule({
  declarations: [
    ToastHelperComponent,
    LoadingScreenComponent,
  ],
  imports : [CommonModule],
  exports : [ToastHelperComponent, LoadingScreenComponent]
})

export class HelperModule { }