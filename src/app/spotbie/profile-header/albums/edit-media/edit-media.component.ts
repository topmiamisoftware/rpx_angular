import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlbumsComponent } from '../albums.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as spotbieGlobals from '../../../../globals'
import { HttpResponse } from 'src/app/models/http-reponse';

const ALBUM_API = spotbieGlobals.API + 'api/albums.service.php'

const HTTP_OPTIONS = {
  withCredentials: true,
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Component({
  selector: 'app-edit-media',
  templateUrl: './edit-media.component.html',
  styleUrls: ['./edit-media.component.css']
})
export class EditMediaComponent implements OnInit {

  @Input() media

  @ViewChild('albumMediaFileInfoMessage') albumMediaFileInfoMessage

  public loading: boolean = false

  public submitted: boolean = false

  public successful_update: boolean

  public bg_color: string

  public item_form: FormGroup

  public album_item_updated_msg: string = "Enter your item's caption..."

  private exe_api_key: string

  public caption_form_ready: boolean = false

  constructor(private host: AlbumsComponent,
              private http: HttpClient,
              private formBuilder: FormBuilder) { }

  get item_caption() {return this.item_form.get('item_caption').value }
  get f() { return this.item_form.controls }

  public closeWindow(){
    this.host.edit_media = false
  }

  public initEditItemForm(){
    
    // will set validators for form and take care of animations
    const item_caption_validators = [Validators.required, Validators.maxLength(300)]

    this.item_form = this.formBuilder.group({
      item_caption: ['', item_caption_validators],
    })

    if(this.media.album_item_caption !== null && this.media.album_item_caption !== 'null') 
      this.item_form.get('item_caption').setValue(this.media.album_item_caption)

    this.caption_form_ready = true

  }

  public initSaveItem() {

    this.loading = true
    this.submitted = true

    if (this.item_form.invalid) {
      this.loading = false
      this.albumMediaFileInfoMessage.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    const item_info = {
      item_caption: escape(this.item_caption),
      item_id: this.media.album_media_id
    }

    const settings_object = { exe_api_key: this.exe_api_key,
                            upload_action: 'saveAlbumItem',
                            item_info
                          }

    this.http.post<HttpResponse>(ALBUM_API, settings_object, HTTP_OPTIONS)
            .subscribe( resp => {
                //console.log("Item Caption Save Response", resp)
                const settings_response = new HttpResponse ({
                status: resp.status,
                message: resp.message,
                full_message: resp.full_message,
                responseObject: resp.responseObject
              })
              this.saveItemCallback(settings_response)
            },
              error => {
                console.log('error', error)
            })
  }

  public saveItemCallback(albums_response: HttpResponse) {
    if (albums_response.status == '200') {
      this.successful_update = true
      const album_response_object = albums_response.responseObject
      if (album_response_object.status == 'saved') {
        this.media.album_item_caption = this.item_caption
        let media_index = this.host.album_media_array.indexOf(this.media)
        //this.host.album_media_array[media_index].album_item_caption = this.media.album_item_caption
        this.album_item_updated_msg = 'Your caption was saved successfully.'
        setTimeout(function() {this.closeWindow() }.bind(this), 500)
      }
    } else
      console.log('Save Album Item Error: ', albums_response)
  }

  ngOnInit(): void {
    this.exe_api_key = this.host.exe_api_key
    this.bg_color = this.host.bg_color
    //console.log("Media Info: ", this.media)
    this.initEditItemForm()
  }
}