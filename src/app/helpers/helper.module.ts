import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastHelperComponent } from './toast-helper/toast-helper.component';
import { LoadingScreenComponent } from './loading-helper/loading-screen/loading-screen.component';
import { OnScrollDirective } from '../directives/on-scroll.directive';
import { StopClickPropagationDirective } from '../directives/stop-click-propagation.directive';

@NgModule({
  declarations: [
    ToastHelperComponent,
    LoadingScreenComponent,
    OnScrollDirective,
    StopClickPropagationDirective
  ],
  imports : [CommonModule],
  exports : [
    ToastHelperComponent, 
    LoadingScreenComponent, 
    OnScrollDirective, 
    StopClickPropagationDirective
  ]
})

export class HelperModule { }