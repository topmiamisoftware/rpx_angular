import { Component, HostListener } from '@angular/core';
import { VersionCheckService } from './services/version-check.service';
import { environment } from 'src/environments/environment.prod';
import { dismissToast } from './helpers/error-helper';
import { UserauthService } from './services/userauth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'spotbie';

  constructor(private versionCheckService : VersionCheckService, private userAuthService: UserauthService) {}
  
  @HostListener('window:load', [])
  onWindowLoaded() {
    this.versionCheckService.initVersionCheck(environment.versionCheckURL);
  }
  
  @HostListener('window:beforeunload')
  onBeforeUnload() {
    
    if(localStorage.getItem('spotbie_rememberMe') != '1'){

      let currentFavorites = localStorage.getItem('spotbie_currentFavorites')

      localStorage.clear()

      localStorage.setItem('spotbie_locationPrompted', '1')
      localStorage.setItem('spotbie_currentFavorites', currentFavorites)

    }
    
    this.userAuthService.closeBrowser().subscribe();

  }

  public dismissToast() : void{
    dismissToast()
  }

  ngOnInit(){
    
  }

}