import { Injectable } from '@angular/core'
import * as spotbieGlobals from 'src/app/globals'
import { HttpHeaders, HttpClient, HttpEventType, HttpResponse } from '@angular/common/http'
import { Subject, Observable } from 'rxjs'
import { AlbumMediaUploadResponse } from 'src/app/models/album-models/album-media-upload-response'
import { Album } from 'src/app/models/album-models/album'

const ALBUM_API = spotbieGlobals.API + 'api/albums.service.php'

const HTTP_OPTIONS = {
  withCredentials : true,
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

const MAX_UPLOAD_SIZE = 5e+8

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  public album_media_progress = new Subject<number>()

  constructor(private http : HttpClient) {
    this.setAlbumMediaProgress(0)
  }
  
  public getMaxFileUploadSize(){ return MAX_UPLOAD_SIZE }
  
  /**
   * @description : Will remove album media that is not saved.
   */     
  public deleteAllUnused(settings_object : any) : void {
    this.http.post<HttpResponse<any>>(ALBUM_API, settings_object, HTTP_OPTIONS).subscribe( resp => {
    },
      error => {
        console.log('Delete All Unused Error', error)
    })
  }

  /**
   * @description : Will add or remove an album media like depending if the logged in user
   * has liked the media item before.
   */    
  public likeAlbumMedia(album_media_like_object : any, callback : Function){

    this.http.post<HttpResponse<any>>(ALBUM_API, album_media_like_object, HTTP_OPTIONS)
    .subscribe( resp => {
      callback(resp)
    },
      error => {
        console.log('Like Album Media Error', error)
    })

  }
  
  /**
   * @description : Will post album media comments.
   */ 
  public deleteComment(album_media_comments_object : any, callback : Function){

    this.http.post<HttpResponse<any>>(ALBUM_API, album_media_comments_object, HTTP_OPTIONS)
    .subscribe( resp => {
      callback(resp)
    },
      error => {
        console.log('Delete Comment Error', error)
    })

  } 

  /**
   * @description : Will post album media comments.
   */ 
  public addAlbumMediaComment(album_media_comments_object : any, callback : Function){

    this.http.post<HttpResponse<any>>(ALBUM_API, album_media_comments_object, HTTP_OPTIONS)
    .subscribe( resp => {
      callback(resp)
    },
      error => {
        console.log('Add Album Media Comment Error', error)
    })   

  }  
  
  /**
   * @description : Will pull album media comments in a list for users to view.
   */ 
  public pullAlbumComments(album_media_comments_object : any, callback : Function){

    this.http.post<HttpResponse<any>>(ALBUM_API, album_media_comments_object, HTTP_OPTIONS)
    .subscribe( resp => {
      callback(resp)
    },
      error => {
        console.log('Pull Album Comments Error', error)
    }) 

  }

  /**
   * @description : Will pull album media likes in a list for logged-in user to view.
   */    
  public pullAlbumMediaLikes(album_media_like_object : any, callback : Function){

    this.http.post<HttpResponse<any>>(ALBUM_API, album_media_like_object, HTTP_OPTIONS)
    .subscribe( resp => {
      callback(resp)
    },
      error => {
        console.log('Pull Album Media Likes Error', error)
    })

  }

  /**
   * @description : Used to upload files to the album
   */  
  public attachAlbumMedia(files : FileList, 
                          exe_api_key : string, 
                          current_album : Album,
                          callback : Function) : AlbumMediaUploadResponse {
    
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

      // console.log("file to upload : ", file_to_upload)
      // let exif = this.getExif(file_to_upload)
      // console.log("file to Upload EXIF: ", exif)
      formData.append('filesToUpload[]', file, file.name)
      // console.log("file to upload : ", file_to_upload)

    }))

    // console.log("Total Upload Size : ", upload_size)
    // console.log("Files To Upload  : ", formData.getAll('filesToUpload[]'))

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

  public setAlbumMediaProgress(album_media_progress : number) : void{
    this.album_media_progress.next(album_media_progress)
  }

  public getAlbumMediaProgress() : Observable<number>{
    return this.album_media_progress.asObservable()
  }

  /**
   * @description: Used to fetch current properties from an
   * album. These properties include Album Description, Album Name,
   * and Album Privacy.
   * @callback: callback(settings_response  : any, album_id)
   */  
  public getAlbumSettings(album_id, exe_api_key : string, callback : Function) : void {

    const settings_object = { exe_api_key : exe_api_key,
      upload_action : 'getAlbumSettings',
      current_album : album_id
    }
    
    this.http.post<HttpResponse<any>>(ALBUM_API, settings_object, HTTP_OPTIONS)
    .subscribe( resp => {
      callback(resp)
    },
      error => {
        console.log('Get Album Settings Error', error)
    })

  }
  
  public removeAlbumMediaBeforeUpload(file, event : Event, remove_media_object : any, callback : Function) : void {

    this.http.post<HttpResponse<any>>(ALBUM_API, remove_media_object, HTTP_OPTIONS)
    .subscribe( resp => {
      callback(file, resp, event)
    },
      error => {
        console.log('Remove Album Media Before Upload Error', error)
    })

  }

  public removeAlbumMedia(remove_media_object, file, callback, event : Event) : void{

    this.http.post<HttpResponse<any>>(ALBUM_API, remove_media_object, HTTP_OPTIONS)
    .subscribe( resp => {
      callback(file, resp, event)
    },
      error => {
        console.log('Remove Album Media error', error)
    })

  }

  public deleteAlbum(album_delete_object : any, callback : Function){

    this.http.post<HttpResponse<any>>(ALBUM_API, album_delete_object, HTTP_OPTIONS)
    .subscribe( resp => {
      callback(resp, event)
    },
      error => {
        console.log('Delete Album error', error)
    })    

  }

  public saveAlbum(album_save_object : any, callback : Function){

    this.http.post<HttpResponse<any>>(ALBUM_API, album_save_object, HTTP_OPTIONS)
    .subscribe( resp => {
        callback(resp)
    },
      error => {
        console.log('Album Save Error', error)
    })    

  }

  public pullSingleAlbum(albums_object : any, callback : Function) : void{

    this.http.post<HttpResponse<any>>(ALBUM_API, albums_object, HTTP_OPTIONS)
    .subscribe( resp => {
      callback(resp)
    },
      error => {
        console.log('Pull Single Album Error', error)
    }) 

  }

  public pullAlbums(albums_object : any, callback : Function){

    this.http.post<HttpResponse<any>>(ALBUM_API, albums_object, HTTP_OPTIONS)
    .subscribe( resp => {
      callback(resp)
    },
    error => {
        console.log('Pull Albums Error', error)
    })

  }

  public setAlbumCover(albums_object : any, callback : Function){

    this.http.post<HttpResponse<any>>(ALBUM_API, albums_object, HTTP_OPTIONS)
    .subscribe( resp => {
      callback(resp)
    },
    error => {
      console.log('Set Album Cover Error', error)
    })    

  }

  public pullSingleMedia(albums_object : any, callback : Function){

    this.http.post<HttpResponse<any>>(ALBUM_API, albums_object, HTTP_OPTIONS)
    .subscribe( resp => {
      callback(resp)
    },
    error => {
      console.log('Pull Single Media Error', error)
    })    
    
  }

}
