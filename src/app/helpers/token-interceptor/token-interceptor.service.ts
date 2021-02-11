import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getCookie } from '../cookies.helper';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token = localStorage.getItem('spotbie_token')

    let modifiedReq

    if(token !== '' && token !== null && token !== 'null'){
      modifiedReq = req.clone({
        withCredentials: true,
        setHeaders: {
          'Authorization' : `Bearer ${token}`
        }
      });
    } else {
      modifiedReq = req.clone({
        withCredentials: true,
      });
    }
    
    return next.handle(modifiedReq);

  }

}