import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import * as $ from 'jquery'
import { HttpResponse } from '../models/http-reponse'
import { displayError } from '../helpers/error-helper'
import * as spotbieGlobals from '../globals'
import { HttpHeaders, HttpClient } from '@angular/common/http'
import { MetaService } from '@ngx-meta/core'

const INFO_API = spotbieGlobals.API + 'api/search.service.php'

const HTTP_OPTIONS = {
  withCredentials : true,
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public exe_user_name : string

  public stream_post_id : string

  public exe_api_key : string

  public arrowOn : boolean = false

  public bg_image: string

  public bgColor : string

  public public_exe_user_id: number

  public album_id : string

  public album_media_id : string

  public public_profile_info = {}

  @ViewChild('scrollArrow') scrollArrow : ElementRef

  public awake_apps : boolean  = false

  public loggedIn : boolean = false

  constructor(private activated_route: ActivatedRoute,
              private http: HttpClient,
              private readonly meta: MetaService) { }

  private getUserInfo() : void{

    const search_object = { exe_api_key : this.exe_api_key,
      exe_search_action : 'getPublicUserInfo',
      exe_username : this.exe_user_name
    }

    this.http.post<HttpResponse>(INFO_API, search_object, HTTP_OPTIONS)
    .subscribe( resp => {
      const info_response = new HttpResponse ({
      status : resp.status,
      message : resp.message,
      full_message : resp.full_message,
      responseObject : resp.responseObject
      })
      this.getUserInfoCb(info_response)
    }, error => {
      displayError(error)
      console.log('Msgs Notifications Error : ', error)
    })

  }

  public getUserProfileMeta() : any{
    return {
      meta: {
        title: 'Toothpaste',
        'twitter:title' : 'Toothpaste',
        override: true,
        description: 'Eating toothpaste is considered to be too healthy!',
        'twitter:description' : 'Eating toothpaste is considered to be too healthy!'
      }
    }    
  }
  
  private getUserInfoCb(httpResponse : HttpResponse) {

    if (httpResponse.status == '200') {

      const info_object = httpResponse.responseObject

      // console.log("User Info CB : ", info_object)
      this.public_profile_info = {
        public_exe_user_id : info_object.exe_user_id,
        public_username : this.exe_user_name,
        public_bg_color : info_object.web_options.bg_color,
        public_spotmee_bg : info_object.web_options.spotmee_bg
      }

      document.getElementsByTagName('body')[0].style.backgroundColor = info_object.web_options.bg_color
      this.bg_image = info_object.web_options.spotmee_bg

      this.meta.setTag('og:image', this.bg_image)
      this.meta.setTag('twitter:image', this.bg_image)      
      this.meta.setTag('twitter:card', 'summary_large_image')
      
    } else {
      console.log('User Info Error ', httpResponse)
      return
    }

    this.awake_apps = true

  }

  public scrollTop() : void{
    $('html, body').animate({ scrollTop: 0 }, 'slow')
  }

  private addScrollEvent() : void {

    const _this = this

    $(window).on('scroll', function() {
      // do your things like logging the Y-axis
      const scrollTop = $(window).scrollTop()
      if (scrollTop < 50) {
        _this.scrollArrow.nativeElement.className = 'spotbie-scroll-top spotbie-arrow-transparent'
        _this.arrowOn = false
      } else if (_this.arrowOn == false) {
        _this.arrowOn = true
        _this.scrollArrow.nativeElement.className = 'spotbie-scroll-top'
      }
    })

  }

  async ngOnInit() {

    this.exe_user_name = this.activated_route.snapshot.paramMap.get('exe_user_name')
    this.stream_post_id = this.activated_route.snapshot.paramMap.get('stream_post_id')
    
    this.album_id = this.activated_route.snapshot.paramMap.get('album_id')
    this.album_media_id = this.activated_route.snapshot.paramMap.get('album_media_id')

    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
    let loggedIn = localStorage.getItem('spotbie_loggedIn')

    if(loggedIn == '1')
      this.loggedIn = true
    else
      this.loggedIn = false

    await this.getUserInfo()

  }

  ngAfterViewInit() {
    this.addScrollEvent()
  }

}
