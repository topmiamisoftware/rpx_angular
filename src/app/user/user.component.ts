import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import * as spotbieGlobals from '../globals'
import { MetaService } from '@ngx-meta/core'
import { HttpClient } from '@angular/common/http'

const INFO_API = spotbieGlobals.API

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public exe_user_name: string

  public stream_post_id: string

  public arrowOn: boolean = false

  public bg_image: string

  public bgColor: string

  public public_exe_user_id: number

  public album_id: string

  public album_media_id: string

  public public_profile_info = {}

  public awake_apps: boolean  = false

  public loggedIn: boolean = false

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private readonly meta: MetaService) { }

  private getUser(): void{

    const user_api = `${INFO_API}user/${this.exe_user_name}`

    this.http.get<any>(user_api).subscribe(
      resp => {
        this.getUserCb(resp)
      }, 
      error => {
        console.log("getUserInfo", error)
      }
    )

  }
  
  private getUserCb(httpResponse: any) {

    if (httpResponse.message == 'success') {

      this.public_profile_info = {
        user: httpResponse.user,
        spotbie_user: httpResponse.spotbie_user,
        default_images: httpResponse.default_images,
        web_options: httpResponse.web_options
      }

      document.getElementsByTagName('body')[0].style.backgroundColor = httpResponse.web_options.bg_color
      document.getElementsByTagName('html')[0].style.backgroundColor = httpResponse.web_options.bg_color
      
      this.bg_image = httpResponse.web_options.spotmee_bg

      this.meta.setTag('og:image', this.bg_image)
      this.meta.setTag('twitter:image', this.bg_image)      
      this.meta.setTag('twitter:card', 'summary_large_image')
      
    } else {
      console.log('User Info Error ', httpResponse)
      return
    }

    this.awake_apps = true

  }

  public getUserProfileMeta(): any{

    return {
      meta: {
        title: 'Toothpaste',
        'twitter:title': 'Toothpaste',
        override: true,
        description: 'Eating toothpaste is considered to be too healthy!',
        'twitter:description': 'Eating toothpaste is considered to be too healthy!'
      }
    }
        
  }

  async ngOnInit() {

    this.exe_user_name = this.activatedRoute.snapshot.paramMap.get('exe_user_name')
    this.stream_post_id = this.activatedRoute.snapshot.paramMap.get('stream_post_id')
    
    this.album_id = this.activatedRoute.snapshot.paramMap.get('album_id')
    this.album_media_id = this.activatedRoute.snapshot.paramMap.get('album_media_id')

    let loggedIn = localStorage.getItem('spotbie_loggedIn')

    if(loggedIn == '1')
      this.loggedIn = true
    else
      this.loggedIn = false

    await this.getUser()

  }

  ngAfterViewInit() {
  }

}
