import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeleteAccountComponent} from './delete-account.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{path: '', component: DeleteAccountComponent}];

@NgModule({
  declarations: [DeleteAccountComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [DeleteAccountComponent],
})
export class DeleteAccountModule {}
