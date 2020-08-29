import { Component, OnInit, Input } from '@angular/core';
import { AlbumsComponent } from '../albums.component';
import { HttpHeaders } from '@angular/common/http'
import { Location } from '@angular/common'
import { AlbumMedia } from '../album-models/album-media';
import { AlbumService } from '../album-services/album.service';

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.css']
})
export class ViewMediaComponent implements OnInit {

  @Input() media: AlbumMedia

  public bg_color: string

  public album_media_item_link: string
  public album_media_item_title: string
  public album_media_description: string

  public successful_url_copy: boolean = false

  public current_media_index: number = 0

  public current_media_obj: any = []

  public able_to_switch: boolean = true

  public media_comments: boolean = false

  public load_comments: boolean = false

  public comments_config = {
    styling: {
      submit_button: {
        "background-color": "rgba(45, 45, 45, 0.88)",
      },
      textarea_placeholder: {
        "color": "white"
      },
    },
    info_text: {
      post_comment_text: "Upload a comment for this album item.",
      no_comments_text: "No comments available for this item."
    }
  }  

  constructor(private host: AlbumsComponent,
              private platformStrategy: Location,
              private _album_service: AlbumService) { }

  public closeWindow(): void{
    if(this.host.public_profile === true){
      this.platformStrategy.replaceState('/user-profile/' + 
                                          this.host.profile_username + 
                                          '/albums/' + this.media.album_id)
    }    
    this.host.view_media = false
  }

  private setMediaProperties(): void{

    this.album_media_item_link = ''
    this.album_media_item_title = ''
    this.album_media_description = ''

  }

  public shareAlbumMedia(): void {
    this.host.shareAlbumMedia(this.media)
  }

  public albumMediaSlide(action: string): void {

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

      this.platformStrategy.replaceState(`/user-profile/ 
                                          ${this.host.profile_username} 
                                          /albums/${this.media.album_id} 
                                          '/media/'${this.media.album_media_id}`)
                                          
    }

    this.media_comments = false
    
    this.pullSlideShowSet()

  }

  private pullSlideShowSet(): void {
    
    let current_id = this.media.album_media_id
    let album_id = this.media.album_id

    this._album_service.pullSlideShowSet(album_id, current_id).subscribe(
      resp => {
        this.pullSlideShowSetCallback(resp)
      },
      error => {
        console.log("pullSlideShowSet", error)
      }
    )

  }

  private pullSlideShowSetCallback(albums_response: any): void{

    if(albums_response.message == 'success'){
      
      albums_response.next.caption = unescape(albums_response.next.caption)

      if(albums_response.next.content.indexOf('.mp4') > 0){
        let poster = albums_response.next.content.split('.mp4')
        albums_response.next.poster = poster[0] + ".png"
      }

      const album_media_next: AlbumMedia = new AlbumMedia(albums_response.next, this._album_service)

      albums_response.previous.caption = unescape(albums_response.previous.caption)

      if(albums_response.previous.content.indexOf('.mp4') > 0){
        let poster = albums_response.previous.content.split('.mp4')
        albums_response.previous.poster = poster[0] + ".png"
      }
      
      const album_media_previous: AlbumMedia = new AlbumMedia(albums_response.previous, this._album_service)
      
      this.current_media_obj.next = album_media_next
      this.current_media_obj.previous = album_media_previous

      this.media_comments = true
      this.able_to_switch = true

    } else
      console.log("fetchCurrentSetCallback", albums_response)

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