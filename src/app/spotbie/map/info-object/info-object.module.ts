import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoObjectComponent } from './info-object.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { RewardMenuModule } from '../../spotbie-logged-in/reward-menu/reward-menu.module';


@NgModule({
  declarations: [ InfoObjectComponent ],
  imports: [
    CommonModule,
    RewardMenuModule,
    ShareButtonsModule.withConfig({
      include: ['facebook', 'twitter', 'linkedin', 'reddit', 'tumblr', 'mix', 'viber', 'messenger','whatsapp']
    }),    
  ],
  exports: [
    InfoObjectComponent
  ]
})
export class InfoObjectModule { }
