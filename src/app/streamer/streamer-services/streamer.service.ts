import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import * as spotbieGlobals from '../../globals'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { handleError } from 'src/app/helpers/error-helper'

const STREAM_API = spotbieGlobals.API + 'stream'

const STREAM_LIKES_API = spotbieGlobals.API + 'stream_like'

@Injectable({
  providedIn: 'root'
})
export class StreamerService {

  constructor(private http: HttpClient) {}

  public deleteStreamPostComment(stream_comments_object: any): Observable<any>{

    return this.http.post<any>(STREAM_API, stream_comments_object).pipe(
      catchError(handleError("deleteStreamPostComment"))
    )
    
  }

  public addStreamPostComment(stream_comments_object: any): Observable<any>{

    return this.http.post<any>(STREAM_API, stream_comments_object).pipe(
      catchError(handleError("addStreamPostComment"))
    )
    
  }

  public pullStreamPostComments(stream_obj: any): Observable<any>{

    return this.http.post<any>(STREAM_API, stream_obj).pipe(
      catchError(handleError("pullStreamPostComments"))
    )
         
  }

  public deleteAllUnused(media_object: any): Observable<any>{
    
    return this.http.post<any>(STREAM_API, media_object).pipe(
      catchError(handleError("deleteAllUnused"))
    )

  }

  public getMyStream(streamObj: any): Observable<any>{

    let streamApi = `${STREAM_API}/my_stream?page=${streamObj.page}&user_id=${streamObj.user_id}`

    return this.http.get<any>(streamApi).pipe(
      catchError(handleError("getMyStream"))
    )

  }

  public getMyGeneralStream(stream_obj: any): Observable<any>{

    let streamApi = `${STREAM_API}/my_general_stream?page=${stream_obj.page}`

    return this.http.get<any>(streamApi).pipe(
      catchError(handleError("getMyGeneralStream"))
    )

  }

  public uploadStream(stream_obj: any): Observable<any> {

    return this.http.post<any>(STREAM_API, stream_obj).pipe(
      catchError(handleError("uploadStream"))
    )

  }

  public getStreamPost(stream_obj: any): Observable<any>{

    return this.http.post<any>(STREAM_API, stream_obj).pipe(
      catchError(handleError("getStreamPost"))
    )
    
  }

  public saveEdit(stream_obj: any): Observable<any>{

    return this.http.post<any>(STREAM_API, stream_obj).pipe(
      catchError(handleError("saveEdit"))
    )

  }

  public getMediaStream(stream_obj: any): Observable<any> {

    return this.http.post<any>(STREAM_API, stream_obj).pipe(
      catchError(handleError("getMediaStream"))
    )

  }

  public uploadMediaStream(stream_obj: any): Observable<any> {
    return this.http.post<any>(STREAM_API, stream_obj).pipe(
      catchError(handleError("uploadMediaStream"))
    )
  }

  public getLifeStream(stream_obj: any): Observable<any> {

    return this.http.post<any>(STREAM_API, stream_obj).pipe(
      catchError(handleError("getLifeStream"))
    )

  }

  public uploadLifeStream(stream_obj: any): Observable<any> {
    return this.http.post<any>(STREAM_API, stream_obj).pipe(
      catchError(handleError("uploadLifeStream"))
    )
  }

  public insertLike(stream_post_id: number){

    let insert_like_api = `${STREAM_LIKES_API}/like`

    return this.http.post<any>(insert_like_api, stream_post_id).pipe(
      catchError(handleError("uploadLifeStream"))
    )

  }

}
