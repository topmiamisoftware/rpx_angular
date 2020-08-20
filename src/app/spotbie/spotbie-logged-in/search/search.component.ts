import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import * as spotbieGlobals from '../../../globals';
import { displayError } from 'src/app/helpers/error-helper';
import { HttpResponse } from '../../../models/http-reponse';
import { Router } from '@angular/router';

const SEARCH_API = spotbieGlobals.API + "api/search.service.php";

const HTTP_OPTIONS = {
  withCredentials : true,
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @ViewChild('spotbie_search_bar') spotbie_search_bar;

  private searchUpTimeOut;

  private exe_api_key : string;

  private search_value : string;
  
  private search_ite : number = 0;

  private search_type = ["people"];

  public search_result_list = [];
  
  public search_results_none : boolean = false;

  public load_more_search_results : boolean = false;

  public loading : boolean = false;

  public search_up : boolean = false;

  public total_search_results = 0;

  constructor(private http : HttpClient,
              private router : Router) { }

  searchSpotbie(event : any){
    this.loading = true;    
    this.search_ite = 0;
    this.search_value = event.target.value;
    clearTimeout(this.searchUpTimeOut);
    if(this.search_value == ""){
      this.search_up = false;
      this.loading = false;
      return;
    }   
    this.searchUpTimeOut = setTimeout(function(){
      //Wait 1 second before sending search requests.      
      this.loadSearch();
    }.bind(this), 500);
  }

  loadSearch(){
    this.searchSend(0);
  }

  loadMoreSearch(){
    this.searchSend(1);
  }

  searchSend(action){   
    let search_object = { exe_api_key : this.exe_api_key, 
      exe_search_action : 'searchSpotbie',
      search_value : this.search_value,
      search_ite : this.search_ite,
      search_type : JSON.stringify(this.search_type)
    };
    let _this = this;
    this.http.post<HttpResponse>(SEARCH_API, search_object, HTTP_OPTIONS)
    .subscribe( resp => {
      let search_response = new HttpResponse ({
      status : resp.status,
      message : resp.message,
      full_message : resp.full_message,
      responseObject : resp.responseObject
      });
      _this.searchSendCb(search_response, action);
    },
    error => {
      displayError(error);
      console.log("Msgs Notifications Error : ", error);     
    });
  }

  searchSendCb(search_response : HttpResponse, action){

    if(action == 0){
      this.search_result_list = [];
      this.search_ite = 0;
      this.load_more_search_results = false;            
    }

    if(search_response.status == "200"){
      let total_results = search_response.responseObject.total_results;
      this.total_search_results = total_results;
      let search_result_list = search_response.responseObject.search_result_list; 
      search_result_list.forEach(search_result => {
        search_result.exe_user_default_picture = spotbieGlobals.RESOURCES + search_result.exe_user_default_picture ;               
        this.search_result_list.push(search_result);

      });      

      if(search_result_list.length > 20){
        this.search_ite = this.search_ite + 20;
        this.search_result_list.pop();
        this.load_more_search_results = true;
      } else {
        this.load_more_search_results = false;
      }      
      
      this.search_up = true;
      this.loading = false;
      this.search_results_none = false;

      if(this.search_result_list.length == 0) this.search_results_none = true;

      //console.log("your loaded search reults are : ", search_result_list);
      this.loading = false;
    } else {
      console.log("Search results Error : ", search_response);      
    }
  }

  goToResult(search_result){    
    console.log("The result is : ", search_result);
    switch(search_result.search_type){
      case "people":
        this.router.navigate(['/user-profile/' + search_result.exe_username]);
        break;
    }
  }

  ngOnInit(){
    this.exe_api_key = localStorage.getItem("spotbie_userApiKey");
  }
  ngAfterViewInit(){}
}