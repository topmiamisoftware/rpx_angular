import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { UserauthService } from '../userauth.service'

@Injectable({
  providedIn: 'root'
})
export class LoginGuardServiceService {

  constructor(private router: Router,
              private userAuthService: UserauthService) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {  

      const response = await this.userAuthService.checkIfLoggedIn()  

      if (response.message == '1') {

        return true
      
      } else {

        let loggedOutFavorites = localStorage.getItem('spotbie_currentFavorites')

        localStorage.clear()
        
        localStorage.setItem('spotbie_currentFavorites', loggedOutFavorites)
        localStorage.setItem('spotbie_locationPrompted', '1')
        localStorage.setItem('spotbie_userId', '0')
        localStorage.setItem('spotbie_loggedIn', '0')
        localStorage.setItem('spotbie_rememberMe', '0')
        localStorage.setItem('spotbie_rememberMeToken', null)        

        this.router.navigate(['/home'])
        
        return false

      }
      
    }

}
