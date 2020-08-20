import { Component, OnInit, Input } from '@angular/core';
import { AlbumsComponent } from '../albums.component';
import * as spotbieGlobals from '../../../../globals'
import { HttpHeaders, HttpClient } from '@angular/common/http'
import { Location } from '@angular/common'
import { HttpResponse } from '../../../../models/http-reponse'
import { displayError } from 'src/app/helpers/error-helper';
import { AlbumMedia } from '../album-models/album-media';
import { AlbumService } from '../album-services/album.service';

const ALBUM_API = spotbieGlobals.API + 'api/albums.service.php'

const HTTP_OPTIONS = {
  withCredentials : true,
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.css']
})
export class ViewMediaComponent implements OnInit {

  @Input() media : AlbumMedia

  public bg_color : string

  public album_media_item_link : string
  public album_media_item_title : string
  public album_media_description : string

  public successful_url_copy : boolean = false

  public current_media_index : number = 0

  public current_media_obj : any = []

  public able_to_switch : boolean = true

  public media_comments : boolean = false

  public load_comments : boolean = false

  public comments_config = {
    styling : {
      submit_button : {
        "background-color" : "rgba(45, 45, 45, 0.88)",
      },
      textarea_placeholder : {
        "color" : "white"
      },
    },
    info_text : {
      post_comment_text : "Upload a comment for this album item.",
      no_comments_text : "No comments available for this item."
    }
  }  

  constructor(private host : AlbumsComponent,
              private http: HttpClient,
              private platformStrategy : Location,
              private _album_service : AlbumService) { }

  public closeWindow() : void{
    if(this.host.public_profile === true){
      this.platformStrategy.replaceState('/user-profile/' + 
                                          this.host.profile_username + 
                                          '/albums/' + this.media.album_id)
    }    
    this.host.view_media = false
  }

  private setMediaProperties () : void{

    this.album_media_item_link = ''
    this.album_media_item_title = ''
    this.album_media_description = ''

  }

  public shareAlbumMedia() : void {
    this.host.shareAlbumMedia(this.media, null)
  }

  public albumMediaSlide(action : string) : void {

    if(this.able_to_switch === false) return
    
    this.able_to_switch = false

    switch(action){
      case 'next':
        this.media = this.current_media_obj.next
        this.current_media_obj.current = this.media
        break;
      case 'previous':
        this.media = this.current_media_obj.previous
        this.current_media_obj.current = this.media
        break;
      case 'open':
        //user just opened the view media component
        this.current_media_obj.current = this.media 
        break;
    }

    if(this.host.public_profile === true){
      this.platformStrategy.replaceState('/user-profile/' + 
                                          this.host.profile_username + 
                                          '/albums/' + this.media.album_id + 
                                          '/media/' + this.media.album_media_id)
    }

    this.media_comments = false
    
    this.pullSlideShowSet()
    //console.log("Starter Items : ", this.media )

  }

  private pullSlideShowSet() : void {
    
    let current_id = this.media.album_media_id

    const albums_object = { exe_api_key : null,
      upload_action : 'pullSlideShowSet',
      current_media_id : current_id,
      current_album : this.media.album_id
    }

    //console.log("Fetch Media Set Object : ", albums_object)

    this.http.post<HttpResponse>(ALBUM_API, albums_object, HTTP_OPTIONS).subscribe( resp => {
      //console.log('Fetch Media Set Response', resp)
      const albums_response = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      })
      this.pullSlideShowSetCallback(albums_response)
    },
      error => {
        displayError(error)
        console.log('error', error)
    })

  }

  private pullSlideShowSetCallback(albums_response : HttpResponse) : void{
    
    //console.log('Fetch Media Set Response', albums_response)
    
    if(albums_response.status == '200'){
      
      albums_response.responseObject.next.file_type = albums_response.responseObject.next.album_media_type
      albums_response.responseObject.next.file_path = albums_response.responseObject.next.album_media_content
      albums_response.responseObject.next.album_item_caption = unescape(albums_response.responseObject.next.album_item_caption)

      if(albums_response.responseObject.next.file_path.indexOf('.mp4') > 0){
        let poster = albums_response.responseObject.next.file_path.split('.mp4')
        albums_response.responseObject.next.poster = poster[0] + ".png"
      }

      const album_media_next : AlbumMedia = new AlbumMedia(albums_response.responseObject.next, this._album_service)

      albums_response.responseObject.previous.file_type = albums_response.responseObject.previous.album_media_type
      albums_response.responseObject.previous.file_path = albums_response.responseObject.previous.album_media_content
      albums_response.responseObject.previous.album_item_caption = unescape(albums_response.responseObject.previous.album_item_caption)

      if(albums_response.responseObject.previous.file_path .indexOf('.mp4') > 0){
        let poster = albums_response.responseObject.previous.file_path.split('.mp4')
        albums_response.responseObject.previous.poster = poster[0] + ".png"
      }
      
      const album_media_previous : AlbumMedia = new AlbumMedia(albums_response.responseObject.previous, this._album_service)
      
      this.current_media_obj.next = album_media_next;
      this.current_media_obj.previous = album_media_previous;

      this.media_comments = true
      this.able_to_switch = true

      //console.log("New Object Media Set: ", this.current_media_obj)
      //console.log("New Object Media Set: ", this.media)

    } else
      console.log("Error fetchCurrentSetCallback: ", albums_response)

  }

  ngOnInit(): void {
    this.bg_color = this.host.bg_color
    //console.log("View Media: ", this.media)
    this.setMediaProperties()
    this.albumMediaSlide('open')
  }

  ngAfterViewInit(){
    this.load_comments = true
  }

}