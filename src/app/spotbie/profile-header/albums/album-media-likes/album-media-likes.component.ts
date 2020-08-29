import { Component, OnInit, Input } from '@angular/core'
import { AlbumService } from '../album-services/album.service'
import { AlbumsComponent } from '../albums.component'
import { AlbumMedia } from '../album-models/album-media'

@Component({
  selector: 'app-album-media-likes',
  templateUrl: './album-media-likes.component.html',
  styleUrls: ['./album-media-likes.component.css']
})
export class AlbumMediaLikesComponent implements OnInit {

  @Input() media: AlbumMedia

  public media_item_like_page: number = 0

  public likes_list_loaded: boolean = false

  public album_item_likes_next: boolean = false

  public album_media_likes_array = []

  public toast_helper: boolean = false

  public toast_helper_config = {
    toast: {
      type: "confirm",
      text: {
        info_text: "Are you sure you want to delete this comment?",
        confirm: "Yes",
        decline: "No",
      }
    }
  }

  constructor(private _album_service: AlbumService,
              private host: AlbumsComponent) { }

  public pullAlbumMediaLikes(): void {

    if(this.host.logged_in_user_id !== this.media.album_by){
      //return if user is trying to like their own album item.
      this.toast_helper_config.toast.text.info_text = "Cannot view other people's likes."
      this.toast_helper_config.toast.type = "acknowledge"
      this.toast_helper = true
      this.host.media_likes = false
      return
    }

    this._album_service.pullAlbumItemLikes(this.media.album_media_id, this.media_item_like_page).subscribe(
      resp =>{
        this.pullAlbumItemLikesCallback(resp)
      }
    )

  }

  private pullAlbumItemLikesCallback(album_media_like_response: any): void{

    const like_response = album_media_like_response.like_list.data

    const current_page = album_media_like_response.like_list.current_page
    const last_page = album_media_like_response.like_list.last_page

    Array.prototype.push.apply(this.album_media_likes_array, like_response)      

    if (current_page < last_page) {

      this.media_item_like_page++
      this.album_item_likes_next = true

    } else
      this.album_item_likes_next = false

    this.likes_list_loaded = true

  }

  public closeWindow(): void{
    this.host.media_likes = false
  }

  ngOnInit(): void {
    this.pullAlbumMediaLikes()
  }

}
