import { Component, OnInit, Input } from '@angular/core';
import { AlbumsComponent } from '../albums.component';
import { ShareService } from '@ngx-share/core';

@Component({
  selector: 'app-share-media',
  templateUrl: './share-media.component.html',
  styleUrls: ['./share-media.component.css']
})
export class ShareMediaComponent implements OnInit {

  @Input() media

  public bg_color: string

  public album_media_item_link: string
  public album_media_item_title: string
  public album_media_description: string

  public successful_url_copy: boolean = false

  constructor(private host: AlbumsComponent,
              public share: ShareService) { }

  public closeWindow(): void{
    this.host.share_media = false
  }

  private setMediaProperties (): void{    
    this.album_media_item_link = 'https://www.spotbie.com/user-profile/' + this.host.profile_username + 
                                  '/albums/' + this.media.album_id + 
                                  '/media/' + this.media.album_media_id 
    this.album_media_item_title = ''
    this.album_media_description = ''
  }

  public linkCopy(input_element): void{
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
    //console.log("Media: ", this.media)
    this.setMediaProperties()
  }
}