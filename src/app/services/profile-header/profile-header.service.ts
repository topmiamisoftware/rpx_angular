import { Injectable } from '@angular/core';
import * as spotbieGlobals from '../../globals'
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { handleError } from 'src/app/helpers/error-helper';
import { Observable } from 'rxjs';

const PROFILE_HEADER_API = spotbieGlobals.API + 'profile_header'

@Injectable({
  providedIn: 'root'
})
export class ProfileHeaderService {

  constructor(private http: HttpClient) { }

  public myProfileHeader(): Observable<any>{

    let my_profile_header_api = `${PROFILE_HEADER_API}/my_profile_header`

    return this.http.post(my_profile_header_api, null).pipe(
      catchError(handleError("myProfileHeader"))
    )
  
  }  

  public setDefault(new_profile_image: string): Observable<any>{
    
    let set_default = PROFILE_HEADER_API + '/set_default'

    const new_def_obj = { 
      _method: 'PATCH', 
      default_picture: encodeURI(new_profile_image) 
    }

    return this.http.post(set_default, new_def_obj).pipe(
      catchError(handleError("setDefault"))
    )

  }
  
  public deleteDefault(default_picture: string): Observable<any>{
    
    let delete_default = PROFILE_HEADER_API + '/delete_default'

    const new_def_obj = { 
      _method: 'delete', 
      default_image_url: encodeURI(default_picture) 
    }

    return this.http.post(delete_default, new_def_obj).pipe(
      catchError(handleError("setDefault"))
    )

  }

  public setDescription(description: string): Observable<any>{

    let set_description = PROFILE_HEADER_API + '/set_description'

    const new_def_obj = { _method: 'patch', description: description }

    return this.http.post(set_description, new_def_obj).pipe(
      catchError(handleError("setDescription"))
    )

  }

}
