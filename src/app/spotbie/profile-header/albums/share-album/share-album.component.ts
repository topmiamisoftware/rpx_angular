import { Component, OnInit, Input } from '@angular/core';
import { AlbumsComponent } from '../albums.component';
import { ShareService } from '@ngx-share/core';

@Component({
  selector: 'app-share-album',
  templateUrl: './share-album.component.html',
  styleUrls: ['./share-album.component.css']
})
export class ShareAlbumComponent implements OnInit {

  @Input() current_album

  public bg_color : string

  public album_link : string
  public album_title : string
  public album_description : string

  public successful_url_copy : boolean = false

  constructor(private host : AlbumsComponent,
              public share: ShareService) { }

  public closeWindow() : void{
    this.host.share_album = false
  }

  private setMediaProperties (){    
    this.album_link = 'https://www.spotbie.com/user-profile/' + this.host.profile_username + '/albums/' + this.current_album.exe_album_id
    this.album_title = unescape(this.current_album.exe_album_name)
    this.album_description = unescape(this.current_album.exe_album_description)
  }

  public linkCopy(input_element) {
    input_element.select();
    document.execCommand('copy');
    input_element.setSelectionRange(0, input_element.value.length);
    this.successful_url_copy = true;
    const _this = this;
    setTimeout(function() {
      _this.successful_url_copy = false;
    }, 2500);
  }

  ngOnInit(): void {
    this.bg_color = this.host.bg_color
    console.log("Album: ", this.current_album)
    this.setMediaProperties()
  }
}