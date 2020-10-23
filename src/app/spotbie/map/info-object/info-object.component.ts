import { Component, OnInit, Input } from '@angular/core'
import { InfoObjectServiceService } from './info-object-service.service'
import { MapComponent } from '../map.component'
import { MyFavoritesService } from '../../my-favorites/my-favorites.service'

const YELP_BUSINESS_DETAILS_API = "https://api.yelp.com/v3/businesses/"

@Component({
  selector: 'app-info-object',
  templateUrl: './info-object.component.html',
  styleUrls: ['./info-object.component.css']
})
export class InfoObjectComponent implements OnInit {

  @Input() info_object

  public bgColor: string

  public loading: boolean = false

  public urlApi: string

  public apiAction: string

  public infoObject: any = null

  public infoObjectImageUrl: string

  public showFavorites: boolean = true

  public isLoggedIn: string

  constructor(private host: MapComponent, 
              private infoObjectService: InfoObjectServiceService,
              private myFavoritesService: MyFavoritesService) { }

  public closeWindow(): void {
    this.host.infoObjectWindow.open = false
  }

  private pullInfoObject(): void{

    const infoObjToPull = {
      config_url: this.urlApi
    }

    this.infoObjectService.pullInfoObject(infoObjToPull).subscribe(
      resp =>{
        this.pullInfoObjectCallback(resp)
      }
    )

  }
  
  private pullInfoObjectCallback(httpResponse: any){

    console.log('pullInfoObjectCallback', httpResponse)

    if (httpResponse.success) {

      this.infoObject = httpResponse.data
      this.loading = false

    } else
      console.log('pullInfoObjectCallback', httpResponse)

  }

  public openWithGoogleMaps(): void {

    let confirmNav = confirm('We will try to open and navigate on your device\'s default navigation app.')
    
    if(confirmNav)
      window.open('geo:' + this.infoObject.coordinates.latitude + ',' + this.infoObject.coordinates.longitude )
    
  }

  public switchPhoto(thumbnail): void{
    this.infoObjectImageUrl = thumbnail
  }

  public goToTicket(){
    window.open(this.info_object.url, "_blank")
  }

  public addFavorite(): void{

    this.loading = true

    const yelpId = this.infoObject.id
    const name = this.infoObject.name
    const locX = this.infoObject.coordinates.latitude
    const locY = this.infoObject.coordinates.longitude

    const favoriteObj = {
      yelp_id: yelpId,
      name: name,
      description: null,
      loc_x: locX,
      loc_y: locY
    }

    if(this.isLoggedIn == '1'){

      this.myFavoritesService.addFavorite(favoriteObj).subscribe(
        resp => {
          this.addFavoriteCb(resp)
        }
      )

    } else
      this.myFavoritesService.addFavoriteLoggedOut(favoriteObj)
    
  }

  public addFavoriteCb(resp: any): void{

    if(resp.success)
      this.showFavorites = false
    else
      console.log("addFavoriteCb", resp)

    this.loading = false

  }

  public removeFavorite(){

    this.loading = true

    const yelpId = this.infoObject.id

    if(this.isLoggedIn == '1'){

      this.myFavoritesService.removeFavorite(yelpId).subscribe(
        resp => {
          this.removeFavoriteCb(resp)
        }
      )

    } else {
      this.myFavoritesService.removeFavoriteLoggedOut(yelpId)
    }

  }

  public removeFavoriteCb(resp){

    if(resp.success)
      this.showFavorites = true
    else
      console.log("removeFavoriteCb", resp)

    this.loading = false

  }

  ngOnInit(){

    this.loading = true

    this.infoObjectImageUrl = this.info_object.image_url
    this.bgColor = localStorage.getItem('spotbie_backgroundColor')
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn')

    switch(this.info_object.type_of_info_object){
      case 'yelp_business':
        this.urlApi = YELP_BUSINESS_DETAILS_API + this.info_object.id
        break
      case 'ticketmaster_event':
        this.loading = false
        return
    }

    this.pullInfoObject()

  }

}