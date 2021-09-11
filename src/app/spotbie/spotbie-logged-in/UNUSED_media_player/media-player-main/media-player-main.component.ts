import { Component, OnInit } from '@angular/core';
import { MenuLoggedInComponent } from '../../menu-logged-in.component';
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
  selector: 'app-media-player-main',
  templateUrl: './media-player-main.component.html',
  styleUrls: ['./media-player-main.component.css']
})
export class MediaPlayerMainComponent implements OnInit {

  public bg_color : string;
  public chosen_media_type : string;

  public media_type_picker : boolean = true;

  public loading : boolean = false;

  public show_media_map : boolean = false;

  public exe_api_key : string;

  public sub_categories_ite : number = 0;

  public sub_category_picker : boolean = false;

  public sub_category_list = [];
  
  public sub_category_none : boolean = false;

  public load_more_sub_cats : boolean = false;

  public media_type_list = [
    { name : "Music"}, 
    { name : "Video"}, 
    { name : "Image"}
  ]; 

  public master_name_list = ['Just Mine', 'My Friends', 'All Around'];

  public active_sub_cats = [];

  public master_pick : string;

  constructor(private host : MenuLoggedInComponent, 
              private http : HttpClient) {}
  
  closeWindow(){
    this.host.mediaPlayerWindow.open = false;
  }

  showMediaMap(){
    this.show_media_map = !this.show_media_map;
  }

  openMediaTypePick(){
    this.media_type_picker = !this.media_type_picker;
  }

  chooseMediaType(media_type_name){
    if(media_type_name == this.chosen_media_type){
      this.closeSubCats();
      return;
    }
    this.loading = true;
    this.sub_categories_ite = 0;
    this.sub_category_list = [];
    this.chosen_media_type = media_type_name;
    localStorage.setItem("spotbie_chosenMediaType", this.chosen_media_type);
    this.pullMediaSubCategories();
  }
  onCategoryStyle(media_type){
    if(media_type == this.chosen_media_type){
      return {'background-color' : 'rgba(0,0,0,.8)'};
    } else {
      return {'background-color' : 'rgba(0,0,0,.23)'};
    }
  }
  closeSubCats(){
    this.sub_category_picker = !this.sub_category_picker;
  }
  pullMediaSubCategories(){
    let media_object = { exe_api_key : this.exe_api_key, 
                        exe_media_action : 'getSubcats',
                        master_pick : this.master_pick,
                        media_type : this.chosen_media_type, 
                        sub_cats_ite : this.sub_categories_ite
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
        _this.pullMediaSubCategoriesCb(media_response);
      },
        error => {
          displayError(error);
          console.log("Msgs Notifications Error : ", error);     
      });
  }

  pullMediaSubCategoriesCb(httpResponse : HttpResponse){
    if(httpResponse.status == "200"){

      let sub_cat_list = httpResponse.responseObject; 
      sub_cat_list.forEach(sub_cat => {         
        this.sub_category_list.push(sub_cat);
      });      

      if(sub_cat_list.length > 6){
        this.sub_categories_ite = this.sub_categories_ite + 6;
        this.sub_category_list.pop();
        this.load_more_sub_cats = true;
      } else {
        this.load_more_sub_cats = false;
      }      

      this.loading = false;
      this.sub_category_none = false;
      this.sub_category_picker = true;
      if(this.sub_category_list.length == 0) this.sub_category_none = true;

      console.log("your loaded sucategories are : ", sub_cat_list);
    } else {
      console.log("Media sub categories Error : ", httpResponse);
    }
  }

  onSubcatStyle(sub_cat_name){
    let current_sub_cat_index = this.active_sub_cats.indexOf(sub_cat_name);
    if(current_sub_cat_index > -1){
      return {'background-color' : 'rgba(0,0,0,.8)'};
    } else {
      return {'background-color' : 'rgba(0,0,0,.23)'};
    }
  }

  pushSubCat(sub_cat_name){    
    let current_sub_cat_index = this.active_sub_cats.indexOf(sub_cat_name);
    if(current_sub_cat_index > -1){
      this.active_sub_cats.splice(current_sub_cat_index, 1);
    } else {
      this.active_sub_cats.push(sub_cat_name);
    }
    console.log("Active sub cats : ", this.active_sub_cats);
  }

  masterPicker(master_type_name){
    this.loading = true;
    this.sub_categories_ite = 0;
    this.sub_category_list = [];
    this.master_pick = master_type_name;
    localStorage.setItem("spotbie_masterPickMedia", this.master_pick);
    this.pullMediaSubCategories();   
  }

  onMasterStyle(master_type_name){
    if(master_type_name == this.master_pick){
      return {'background-color' : 'rgba(0,0,0,.8)'};
    } else {
      return {'background-color' : 'rgba(0,0,0,.23)'};
    }
  }

  ngOnInit() {
    //this.loading = true;    
    //this.exe_api_key = localStorage.getItem("spotbie_userApiKey");
    /*
    this.chosen_media_type = localStorage.getItem("spotbie_chosenMediaType");    
    if(this.chosen_media_type == undefined || this.chosen_media_type.length < 1) this.chosen_media_type = "Music";

    this.master_pick = localStorage.getItem("spotbie_masterPickMedia");
    if(this.master_pick == undefined || this.master_pick.length < 1) this.masterPicker("All Around"); else this.masterPicker(this.master_pick);

    let sub_category_list = localStorage.getItem("spotbie_subCatList");
    if(this.master_pick == undefined || this.master_pick.length < 1) this.masterPicker("All Around"); else this.masterPicker(this.master_pick);
    */
    this.bg_color = localStorage.getItem("spotbie_backgroundColor");
  }
}