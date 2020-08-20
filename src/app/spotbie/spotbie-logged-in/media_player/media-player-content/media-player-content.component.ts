import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpResponse } from '../../../../models/http-reponse';
import * as spotbieGlobals from '../../../../globals';
import { displayError } from 'src/app/helpers/error-helper';

const MEDIA_API = spotbieGlobals.API + "api/media.service.php";

const HTTP_OPTIONS = {
  withCredentials : true,
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};

@Component({
  selector: 'app-media-player-content',
  templateUrl: './media-player-content.component.html',
  styleUrls: ['./media-player-content.component.css']
})
export class MediaPlayerContentComponent implements OnInit {

  @Input() genre_list;
  @Input() master_pick : string;
  @Input() chosen_media_type : string;

  public current_genre_length : number;

  public media_type_picker : boolean = false;

  public loading : boolean = false;

  public show_media_map : boolean = false;

  public exe_api_key : string;
  
  public sub_category_none : boolean = false;

  public load_more_sub_cats : boolean = false;

  public media_type_list = [
    { name : "Music"}, 
    { name : "Video"}, 
    { name : "Image"}
  ]; 

  public subcat_content_ite : number = 0;

  public curent_media_list = [];

  public media_list = [];

  public media_ite : number = 0;

  public media_none : boolean = true;

  public load_more_media : boolean = false;

  constructor(private http : HttpClient) {}

  pullSubCatContents(){
    this.loading = true;
    if(this.genre_list.length < 1){
      this.media_list = [];
      this.media_ite = 0;
      this.loading = false;
      return;
    }
    this.media_list = [];
    let media_object = { exe_api_key : this.exe_api_key, 
      media_type : this.chosen_media_type, 
      exe_media_action : 'getSubcatContent',
      subcat_list : JSON.stringify(this.genre_list), 
      subcat_content_ite : this.subcat_content_ite
    };
    let _this = this;
    this.http.post<HttpResponse>(MEDIA_API, media_object, HTTP_OPTIONS)
    .subscribe( resp => {
      let media_response = new HttpResponse ({
      status : resp.status,
      message : resp.message,
      full_message : resp.full_message,
      responseObject : resp.responseObject
      });
      _this.pullSubCatContentsCb(media_response);
    },
    error => {
      displayError(error);
      console.log("Msgs Notifications Error : ", error);     
    });    
  }

  pullSubCatContentsCb(media_response : HttpResponse){
    if(media_response.status == "200"){
      let media_list = media_response.responseObject; 
      media_list.forEach(media => {         
        this.media_list.push(media);
      });      
      if(media_list.length > 6){
        this.media_ite = this.media_ite + 6;
        this.media_list.pop();
        this.load_more_media = true;
      } else {
        this.load_more_media = false;
      }      
      this.loading = false;      
      if(this.media_list.length == 0) this.media_none = true; else this.media_none = false;
      console.log("your loaded medias are : ", media_list);
    } else {
      console.log("Media load Error : ", media_response);
    }
  }

  checkGenreChanges(){
    if(this.genre_list.length != this.current_genre_length){
      //console.log("Genre List Changed ", this.genre_list);
      this.current_genre_length = this.genre_list.length;
      this.pullSubCatContents();
    }    
  }

  ngOnInit() {        
    this.exe_api_key = localStorage.getItem("spotbie_userApiKey");
    this.current_genre_length = this.genre_list.length;
  }

  ngDoCheck(){
    this.checkGenreChanges();
  }
}