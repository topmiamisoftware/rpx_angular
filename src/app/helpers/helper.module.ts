import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastHelperComponent } from './toast-helper/toast-helper.component';
import { LoadingScreenComponent } from './loading-helper/loading-screen/loading-screen.component';
import { OnScrollDirective } from '../directives/on-scroll.directive';
import { StopClickPropagationDirective } from '../directives/stop-click-propagation.directive';
import { SingleAdComponent } from '../spotbie/ads/single-ad/single-ad.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { ErrorHandlerComponent } from './error-handler/error-handler.component';
import { UsernameDirective } from '../directives/username.directive';
import { PersonNameDirective } from '../directives/person-name.directive';

@NgModule({
  declarations: [
    ToastHelperComponent,
    LoadingScreenComponent,
    OnScrollDirective,
    StopClickPropagationDirective,
    UsernameDirective,
    PersonNameDirective,
    SingleAdComponent,
    ScrollToTopComponent,
    ErrorHandlerComponent
  ],
  imports : [CommonModule],
  exports : [
    ToastHelperComponent, 
    LoadingScreenComponent,
    OnScrollDirective, 
    StopClickPropagationDirective,
    PersonNameDirective,
    UsernameDirective,
    SingleAdComponent,
    ScrollToTopComponent,
    ErrorHandlerComponent
  ]
})

export class HelperModule { }