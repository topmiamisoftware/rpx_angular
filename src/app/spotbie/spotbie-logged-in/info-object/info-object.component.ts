import { Component, OnInit, Input } from '@angular/core'
import { MapComponent } from '../map/map.component'
import { InfoObjectServiceService } from './info-object-service.service'
import { HttpResponse } from '../../../models/http-reponse'
import { Router } from '@angular/router'

const YELP_BUSINESS_DETAILS_API = "https://api.yelp.com/v3/businesses/"

@Component({
  selector: 'app-info-object',
  templateUrl: './info-object.component.html',
  styleUrls: ['./info-object.component.css']
})
export class InfoObjectComponent implements OnInit {

  @Input() info_object

  public bg_color : string

  public loading : boolean = false

  public url_api : string

  public api_action : string

  public _info_object : any = null

  public _info_object_image_url : string

  constructor(private host : MapComponent, 
              private info_object_service : InfoObjectServiceService,
              private router : Router) { }

  public closeWindow() : void {
    this.host.info_object_window.open = false
  }

  private pullInfoObject() : void{
    
    let api_url = this.url_api
    let api_action = this.api_action

    const yelp_obj = {
      req_url : api_url,
      exe_search_action : api_action
    }

    this.info_object_service.pullInfoObject(yelp_obj, this.pullInfoObjectCallback.bind(this))
  }
  
  public openWithGoogleMaps() : void {
    let confirm_nav = confirm('We will try to open and navigate on your device\'s default navigation app.')
    if(confirm_nav){
      window.open('geo:' + this._info_object.coordinates.latitude + ',' + this._info_object.coordinates.longitude )
    }
  }

  private pullInfoObjectCallback(http_response : HttpResponse){

    if (http_response.status == '200') {

      this._info_object = http_response.responseObject
      this.loading = false
      
      console.log("the yelp response ", this.info_object)

    } else
      console.log('Info Object Details Error : ', http_response)

  }

  public switchPhoto(thumbnail) : void{
    this._info_object_image_url  = thumbnail
  }

  public goToTicket(){
    window.open(this.info_object.url, "_blank")
  }

  ngOnInit(){

    this.loading = true

    console.log("The Info Object : ", this.info_object)
    
    this._info_object_image_url = this.info_object.image_url
    this.bg_color = localStorage.getItem('spotbie_backgroundColor')

    switch(this.info_object.type_of_info_object){
      case 'yelp_business':
        this.url_api = YELP_BUSINESS_DETAILS_API + this.info_object.id
        this.api_action ='yelpPullBusiness'
        break
      case 'ticketmaster_event':
        this.loading = false
        return
    }

    this.pullInfoObject()

  }

}