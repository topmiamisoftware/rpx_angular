import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdManagerComponent } from './ad-manager.component';
import { AdEditorComponent } from './ad-editor/ad-editor.component';



@NgModule({
  declarations: [
    AdManagerComponent,
    AdEditorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AdManagerComponent
  ]
})
export class AdManagerModule { }
