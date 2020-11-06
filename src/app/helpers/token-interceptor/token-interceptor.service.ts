import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const modifiedReq = req.clone({
      withCredentials: true
    });
    
    return next.handle(modifiedReq);

  }
  

  private getCookie(name) {

    if (!document.cookie) {
      return null;
    }
  
    const xsrfCookies = document.cookie.split(';')
      .map(c => c.trim())
      .filter(c => c.startsWith(name + '='));
  
    if (xsrfCookies.length === 0) {
      return null;
    }
    
    return decodeURIComponent(xsrfCookies[0].split('=')[1]);
    
  }

}