import { Injectable } from '@angular/core';
import * as spotbieGlobals from '../../globals'
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { handleError } from 'src/app/helpers/error-helper';
import { Observable } from 'rxjs';

const PROFILE_HEADER_API = spotbieGlobals.API + 'profile_header'

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

const BACKGROUND_UPLOAD_API_URL = spotbieGlobals.API + 'api/background_image_upload.service.php'
const BACKGROUND_MAX_UPLOAD_SIZE = 1e+7

const DEFAULT_UPLOAD_API_URL = spotbieGlobals.API + 'api/default_image_upload.service.php'
const DEFAULT_MAX_UPLOAD_SIZE = 1e+7

@Injectable({
  providedIn: 'root'
})
export class ProfileHeaderService {

  constructor(private http: HttpClient) { }

  public myProfileHeader(): Observable<any>{

    let my_profile_header_api = PROFILE_HEADER_API + '/my_profile_header'

    return this.http.get(my_profile_header_api).pipe(
      catchError(handleError("myProfileHeader"))
    )
  
  }  

  
}
