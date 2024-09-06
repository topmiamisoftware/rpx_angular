import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DownloadAppPage} from "./download-app.page";
import {HelperModule} from "../../helpers/helper.module";

const routes: Routes = [{path: '', component: DownloadAppPage}];

@NgModule({
  declarations: [DownloadAppPage],
  imports: [
    CommonModule,
    HelperModule,
    RouterModule.forChild(routes),
  ],
  exports: [DownloadAppPage],
})
export class DownloadAppModule {}
