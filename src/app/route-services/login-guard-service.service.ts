import { Injectable } from '@angular/core'
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { UserauthService } from '../services/userauth.service'

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

        localStorage.clear()
  
        localStorage.setItem('spotbie_userId', '0')
        localStorage.setItem('spotbie_loggedIn', '0')
        localStorage.setItem('spotbie_rememberMe', '0')
        localStorage.setItem('spotbie_rememberMeToken', null)      

        this.router.navigate(['/home'], {
          queryParams: {
            return: state.url
          }
        })
        
        return false

      }
      
    }

}
