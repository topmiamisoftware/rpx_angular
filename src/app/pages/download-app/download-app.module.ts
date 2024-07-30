import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DownloadAppComponent} from "./download-app.component";
import {HelperModule} from "../../helpers/helper.module";

const routes: Routes = [{path: '', component: DownloadAppComponent}];

@NgModule({
  declarations: [DownloadAppComponent],
  imports: [
    CommonModule,
    HelperModule,
    RouterModule.forChild(routes),
  ],
  exports: [DownloadAppComponent],
})
export class DownloadAppModule {}
