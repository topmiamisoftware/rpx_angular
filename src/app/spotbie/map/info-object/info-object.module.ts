import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoObjectComponent } from './info-object.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';


@NgModule({
  declarations: [ InfoObjectComponent ],
  imports: [
    CommonModule,
    ShareButtonsModule.withConfig({
      include: ['facebook', 'twitter', 'linkedin', 'reddit', 'tumblr', 'mix', 'viber', 'messenger','whatsapp']
    }),    
  ],
  exports: [
    InfoObjectComponent
  ]
})
export class InfoObjectModule { }
