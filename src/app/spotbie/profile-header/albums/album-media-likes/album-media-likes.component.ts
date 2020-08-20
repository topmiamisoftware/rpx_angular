import { Component, OnInit, Input } from '@angular/core';
import { AlbumService } from '../album-services/album.service';
import { AlbumsComponent } from '../albums.component';
import { AlbumMedia } from '../album-models/album-media';
import { HttpResponse } from 'src/app/models/http-reponse';

@Component({
  selector: 'app-album-media-likes',
  templateUrl: './album-media-likes.component.html',
  styleUrls: ['./album-media-likes.component.css']
})
export class AlbumMediaLikesComponent implements OnInit {

  @Input() media : AlbumMedia

  public media_item_like_ite : number = 0

  public likes_list_loaded : boolean = false

  public album_item_likes_next : boolean = false

  public album_media_likes_array = []

  public toast_helper : boolean = false

  public toast_helper_config = {
    toast : {
      type : "confirm",
      text : {
        info_text : "Are you sure you want to delete this comment?",
        confirm : "Yes",
        decline : "No",
      }
    }
  }

  constructor(private _album_service : AlbumService,
              private host : AlbumsComponent) { }

  public pullAlbumMediaLikes() : void {

    if(this.host.logged_in_user_id !== this.media.album_by){
      //return if user is trying to like their own album item.
      this.toast_helper_config.toast.text.info_text = "Cannot view other people's likes."
      this.toast_helper_config.toast.type = "acknowledge"
      this.toast_helper = true
      this.host.media_likes = false
      return
    }
    
    const album_media_like_object = {
      upload_action : "pullAlbumMediaLikes",
      exe_api_key : this.host.exe_api_key,
      current_album : this.media.album_id,
      current_media_id : this.media.album_media_id,
      like_ite : this.media_item_like_ite
    }

    this._album_service.pullAlbumMediaLikes(album_media_like_object, this.pullAlbumMediaLikesCallback.bind(this))

  }

  /**
   * @description : Used to update UI after user likes a media item.
   */
  private pullAlbumMediaLikesCallback(album_media_like_response : HttpResponse){

    if (album_media_like_response.status == '200') {
      //console.log("Album Settings Response ", settings_response)
      const like_response = album_media_like_response.responseObject

      like_response.forEach(album_media_like => {
        //console.log("album media: ", album_media_like)
      })

      Array.prototype.push.apply(this.album_media_likes_array, like_response)      

      if (like_response.length > 10) {
        this.album_media_likes_array.pop()
        this.media_item_like_ite = this.media_item_like_ite + 10
        this.album_item_likes_next = true
      } else
        this.album_item_likes_next = false

      this.likes_list_loaded = true

    } else
      console.log('error', album_media_like_response)

  }

  public closeWindow() : void{
    this.host.media_likes = false
  }

  ngOnInit(): void {
    this.pullAlbumMediaLikes()
  }

}
