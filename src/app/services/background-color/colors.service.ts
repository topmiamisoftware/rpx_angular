import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import * as spotbieGlobals from '../../globals'
import { Subject, Observable } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { handleError } from 'src/app/helpers/error-helper'

const COLORS_API = spotbieGlobals.API + 'web_options'

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

  private bg_color_subject = new Subject<any>()

  constructor(private http: HttpClient) { }

  public populateWebOptions(web_options: any): void {

    localStorage.setItem('spotbie_backgroundColor', web_options.bg_color)
    localStorage.setItem('spotbie_backgroundImage', web_options.spotmee_bg) 

    this.bg_color_subject.next(web_options)

  }

  public getWebOptions(): Observable<any> {
    return this.bg_color_subject.asObservable()
  }

  public callWebOptionsApi(): Observable<any> {
    
    let colors_api = COLORS_API + "/show"

    return this.http.get<any>(colors_api).pipe(
      tap(resp => { 
        this.populateWebOptions(resp)
      }),
      catchError(handleError("callWebOptionsApi Error"))
    )
  
  }

}
