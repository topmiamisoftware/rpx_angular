import { Component, HostListener } from '@angular/core';
import { VersionCheckService } from './services/version-check.service';
import { environment } from 'src/environments/environment.prod';
import { dismissToast } from './helpers/error-helper';

@Component({
  selector: 'app-root',
  host: {'window:beforeunload': 'onBeforeUnload'},
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spotbie';

  constructor(private versionCheckService : VersionCheckService) {}
  
  @HostListener('window:load', [])
  onWindowLoaded() {
    this.versionCheckService.initVersionCheck(environment.versionCheckURL);
  }
  
  public dismissToast() : void{
    dismissToast()
  }

  ngOnInit(){
    
  }

}