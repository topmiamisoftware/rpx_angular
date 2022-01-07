import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Routes, RouterModule } from '@angular/router'
import { MenuModule } from '../spotbie/menu.module'
import { SpotbiePipesModule } from '../spotbie-pipes/spotbie-pipes.module'
import { MapModule } from '../spotbie/map/map.module'
import { MapComponent } from '../spotbie/map/map.component'
import { HelperModule } from '../helpers/helper.module'
import { BusinessComponent } from './business.component'
import { MenuLoggedOutModule } from '../spotbie/spotbie-logged-out/menu-logged-out.module'

const routes : Routes = [
  { path: '', component : BusinessComponent, pathMatch: 'full' }
]

@NgModule({
  declarations: [
    BusinessComponent
  ],
  imports: [  
    CommonModule,
    MenuLoggedOutModule,
    MenuModule,
    SpotbiePipesModule,
    MapModule,
    HelperModule,
    RouterModule.forChild(routes)
  ],
  exports : [BusinessComponent],
  providers: [MapComponent]
})
export class BusinessModule { }
