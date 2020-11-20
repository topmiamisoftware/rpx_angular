import { Injectable } from '@angular/core';
import * as spotbieGlobals from '../../globals'
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { handleError } from 'src/app/helpers/error-helper';
import { Observable } from 'rxjs';

const PROFILE_HEADER_API = `${spotbieGlobals.API}profile_header`

@Injectable({
  providedIn: 'root'
})
export class ProfileHeaderService {

  constructor(private http: HttpClient) { }

  public myProfileHeader(): Observable<any>{

    let myProfileHeaderApi = `${PROFILE_HEADER_API}/my_profile_header`

    return this.http.post(myProfileHeaderApi, null).pipe(
      catchError(handleError("myProfileHeader"))
    )
  
  }  

  public setDefault(newProfileImage: string): Observable<any>{
    
    let setDefault = `${PROFILE_HEADER_API}/set_default`

    const new_def_obj = { 
      _method: 'PATCH', 
      default_picture: encodeURI(newProfileImage) 
    }

    return this.http.post(setDefault, new_def_obj).pipe(
      catchError(handleError("setDefault"))
    )

  }
  
  public deleteDefault(defaultPicture: string): Observable<any>{
    
    let deleteDefault = `${PROFILE_HEADER_API}/delete_default`

    const newDefObj = { 
      _method: 'DELETE', 
      default_image_url: encodeURI(defaultPicture) 
    }

    return this.http.post(deleteDefault, newDefObj).pipe(
      catchError(handleError("setDefault"))
    )

  }

  public setDescription(description: string): Observable<any>{

    let setDescription = `${PROFILE_HEADER_API}/set_description`

    const newDefObj = { 
      _method: 'PATCH', 
      description: description 
    }

    return this.http.post(setDescription, newDefObj).pipe(
      catchError(handleError("setDescription"))
    )

  }

}
