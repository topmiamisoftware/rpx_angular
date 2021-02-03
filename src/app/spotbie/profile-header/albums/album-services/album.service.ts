import { Injectable } from '@angular/core';
import * as spotbieGlobals from '../../../../globals'
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Album } from '../album-models/album';
import { AlbumMediaUploadResponse } from '../album-models/album-media-upload-response';
import { Subject, Observable } from 'rxjs';
import { handleError } from 'src/app/helpers/error-helper';
import { catchError } from 'rxjs/operators';

const ALBUM_API = spotbieGlobals.API + 'album'

const ALBUM_COMMENTS_API = spotbieGlobals.API + 'album_comments'

const ALBUM_LIKES_API = spotbieGlobals.API + 'album_likes'

const ALBUM_ITEMS_API = spotbieGlobals.API + 'album_items'

const MAX_UPLOAD_SIZE = 5e+8

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  public album_media_progress = new Subject<number>()

  constructor(private http: HttpClient) {
    this.setAlbumMediaProgress(0)
  }
  
  public getMaxFileUploadSize(){ return MAX_UPLOAD_SIZE }
     
  public deleteAllUnused(album_id: number): Observable<any> {

    const delete_all_unused_api = `${ALBUM_ITEMS_API}/delete-all-unused`

    const settings_object = {
      _method : 'delete',
      album_id
    }

    return this.http.post<any>(delete_all_unused_api, settings_object).pipe(
      catchError(handleError("deleteAllUnused"))
    )

  }
  
  public likeAlbumItem(album_id: number, album_media_id: number): Observable<any>{

    let album_api = `${ALBUM_LIKES_API}/like-album-item`

    const album_media_like_object = {
      album_id,
      album_media_id
    }

    return this.http.post<any>(album_api, album_media_like_object).pipe(
      catchError(handleError("likeAlbumItem"))
    )

  }
  
  public deleteComment(comment_id: number): Observable<any>{

    const delete_album_comment = `${ALBUM_COMMENTS_API}/destroy`

    const comment_obj = {
      _method: 'delete',
      comment_id
    }

    return this.http.post<any>(delete_album_comment, comment_obj).pipe(
      catchError(handleError("deleteComment"))
    )    

  } 

  public addAlbumMediaComment(album_media_comments_object: any): Observable<any>{

    const add_album_comment = `${ALBUM_COMMENTS_API}/create` 

    return this.http.post<any>(add_album_comment, album_media_comments_object).pipe(
      catchError(handleError("addAlbumMediaComment"))
    ) 
      
  }  
  
  public pullAlbumItemComments(album_item_id: number, page: number){

    const pull_album_comment_api = `${ALBUM_ITEMS_API}/${album_item_id}/comments?page=${page}`

    return this.http.get<any>(pull_album_comment_api).pipe(
      catchError(handleError("pullAlbumComments"))
    )  

  }
  
  public pullAlbumItemLikes(album_item_id: number, page: number): Observable<any>{

    const pull_album_media_likes = `${ALBUM_LIKES_API}/index?id=${album_item_id}&page=${page}`

    return this.http.get<any>(pull_album_media_likes).pipe(
      catchError(handleError("pullAlbumItemLikes"))
    )

  }

  public getAlbumSettings(album_id: number): Observable<any>{

    const get_album_settings_api = `${ALBUM_API}/settings/${album_id}`

    return this.http.get<any>(get_album_settings_api).pipe(
      catchError(handleError("getAlbumSettings"))
    )

  }
  
  public removeAlbumMediaBeforeUpload(album_id: number, path_to_remove: string): Observable<any> {

    const remove_album_media_api = `${ALBUM_API}/remove_media`

    const remove_media_object = {
      _method: 'delete',
      album_id,
      path_to_remove
    }

    return this.http.post<any>(remove_album_media_api, remove_media_object).pipe(
      catchError(handleError("removeAlbumMediaBeforeUpload"))
    )

  }

  public removeAlbumMedia(album_id: number, file_path: string, album_item_id: number): Observable<any>{

    const remove_album_media_api = `${ALBUM_API}/remove_media`

    const remove_media_object = {
      _method: 'delete',
      album_id,
      file_path,
      album_item_id
    }

    return this.http.post<any>(remove_album_media_api, remove_media_object).pipe(
      catchError(handleError("removeAlbumMedia"))
    )

  }

  public deleteAlbum(album_id: number): Observable<any>{

    const delete_album_api = `${ALBUM_API}/remove_media`
    
    const album_delete_object = {
      _method: 'delete',
      album_id
    }

    return this.http.post<any>(delete_album_api, album_delete_object).pipe(
      catchError(handleError("deleteAlbum"))
    )

  }

  public saveAlbum(current_album: any, album_info: any): Observable<any>{

    const save_album_api = `${ALBUM_API}/save`

    const album_save_object = {
      current_album,
      album_info
    }

    return this.http.post<any>(save_album_api, album_save_object).pipe(
      catchError(handleError("saveAlbum"))
    )  

  }

  public pullSingleAlbum(albumId: number, page: number): Observable<any>{

    const pullSingleAlbumApi = `${ALBUM_API}/${albumId}?page=${page}`

    console.log("pullSingleAlbum", pullSingleAlbumApi)

    return this.http.get<any>(pullSingleAlbumApi).pipe(
      catchError(handleError("pullSingleAlbum"))
    )  

  }

  public myAlbums(page: number, isPublic: boolean, peer_id: any): Observable<any>{

    let api

    if(!isPublic)
      api = `${ALBUM_API}/my_albums`
    else
      api = `${ALBUM_API}/public-albums`

    const myAlbumsObj = {
      page: page,
      peer_id: peer_id
    }

    return this.http.post<any>(api, myAlbumsObj).pipe(
      catchError(handleError("myAlbums"))
    )

  }

  public setAlbumCover(album_id: number, file_path: string, album_media_id: number): Observable<any>{
    
    const set_album_cover_api = `${ALBUM_API}/set_cover`

    const albums_object = {
      album_id,
      file_path,
      album_media_id,
      _method: 'patch'
    }

    return this.http.post<any>(set_album_cover_api, albums_object).pipe(
      catchError(handleError("setAlbumCover"))
    )

  }

  public pullSingleMedia(album_media_id: number): Observable<any>{

    const single_media_api = `${ALBUM_API}/single_media?id=${album_media_id}`

    return this.http.get<any>(single_media_api).pipe(
      catchError(handleError("pullSingleMedia"))
    )   

  }


  public attachAlbumMedia(files: FileList, exe_api_key: string, current_album: Album,
                          callback: Function): AlbumMediaUploadResponse {
    
    const formData = new FormData()

    let upload_size = 0

    formData.append('upload_action', 'uploadAlbumMedia')
    formData.append('exe_api_key', exe_api_key)
    formData.append('current_album', JSON.stringify(current_album))
    
    let album_media_upload_response = new AlbumMediaUploadResponse()
                            
    Array.prototype.forEach.call(files, (file => {
      
      upload_size += file.size
      if (upload_size > MAX_UPLOAD_SIZE) {        
        album_media_upload_response.album_media_message = 'Max upload size is 500MB.'
        return album_media_upload_response
      }

      formData.append('filesToUpload[]', file, file.name)

    }));

    this.http.post(ALBUM_API, formData, {reportProgress: true, observe: 'events'}).subscribe(event => {

      if (event.type === HttpEventType.UploadProgress) {
        this.setAlbumMediaProgress(Math.round(100 * event.loaded / event.total))
      } else if (event.type === HttpEventType.Response) {
        callback(event.body)
      }

    })

    album_media_upload_response.album_media_message = 'success'
    
    return album_media_upload_response
  
  }

  public setAlbumMediaProgress(album_media_progress: number): void{
    this.album_media_progress.next(album_media_progress)
  }

  public getAlbumMediaProgress(): Observable<number>{
    return this.album_media_progress.asObservable()
  }
  
  public pullSlideShowSet(album_id: number, media_id: number): Observable<any>{

    let slide_show_set_api = `${ALBUM_API}/${album_id}/slide_show_set?item_id=${media_id}`

    return this.http.get<any>(slide_show_set_api).pipe(
      catchError(handleError("pullSlideShowSet"))
    )
  
  }

}
