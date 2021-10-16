import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { metersToMiles, setYelpRatingImage } from 'src/app/helpers/info-object-helper';
import { InfoObjectServiceService } from '../map/info-object/info-object-service.service';
import { MyFavoritesService } from './my-favorites.service';

const YELP_BUSINESS_DETAILS_API = "https://api.yelp.com/v3/businesses/"

@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.component.html',
  styleUrls: [ '../map/map.component.css', './my-favorites.component.css']
})
export class MyFavoritesComponent implements OnInit {

  @Output() closeWindow = new EventEmitter()
  
  public loading: boolean = false

  public bgColor: string
  public isLoggedIn: string

  public favoriteItems: Array<any> = []
  public totalFavoriteItems: number = 0

  public loadMore: boolean = false

  public currentPage: number = 1

  public noFavorites: boolean = false

  public infoObjectWindow = { open: false }
  public infoObject: any

  constructor(private myFavoritesService: MyFavoritesService,
              private infoObjectService: InfoObjectServiceService) { }

  public closeWindowX(){
    this.closeWindow.emit(null)
  }
  
  public getFavorites(){

    if(this.isLoggedIn == '1')
      this.getFavoritesLoggedIn()
    else
      this.getFavoritesLoggedOut()

  }

  private getFavoritesLoggedIn(){

    this.loading = true

    this.myFavoritesService.getFavoritesLoggedIn(this.currentPage).subscribe(
      resp => {
        this.getFavoritesLoggedInCb(resp) 
      }
    )

  }

  private getFavoritesLoggedInCb(httpResponse: any){

    if(httpResponse.success){

      let favoriteItems = httpResponse.favorite_items.data
      
      this.totalFavoriteItems = favoriteItems.length

      let currentPage = httpResponse.favorite_items.current_page
      let lastPage = httpResponse.favorite_items.last_page

      if(favoriteItems.length == 0) this.loading = false

      favoriteItems.forEach(favorite => {
        
        this.populateFavorite(favorite.third_party_id).subscribe(
          resp => {
            this.populateFavoriteCallback(resp, favorite)
          }
        )

      });

      if(currentPage < lastPage){
        this.currentPage++
        this.loadMore = true
      } else
        this.loadMore = false

      if(httpResponse.favorite_items.total == 0) this.noFavorites = true

    } else
      console.log("getFavoritesLoggedInCb", httpResponse)

  }

  private getFavoritesLoggedOut(){

    const favoriteItems = this.myFavoritesService.getFavoritesLoggedOut()
    
    if(favoriteItems != null && favoriteItems.length > 0){

      this.totalFavoriteItems = favoriteItems.length

      this.loading = true

      favoriteItems.forEach(favorite => {

        this.populateFavorite(favorite.third_party_id).subscribe(
          resp => {
            this.populateFavoriteCallback(resp, favorite)
          }
        )
        
      })

    } else this.noFavorites = true
    

  }

  public populateFavoriteCallback(resp: any, myFavorite: any){
    
    if(resp.success){

      let favorite = resp.data

      favorite.type_of_info_object = 'yelp_business'
      favorite.type_of_info_object_category = myFavorite.type_of_info_object_category

      favorite.rating_image = setYelpRatingImage(favorite.rating)

      if (favorite.is_closed)
        favorite.is_closed_msg = 'Closed'
      else
        favorite.is_closed_msg = 'Open'

      if (favorite.price) favorite.price_on = '1'

      if (favorite.image_url == '') favorite.image_url = '0'

      let friendly_transaction = 'This place offers '

      favorite.transactions = favorite.transactions.sort()

      switch (favorite.transactions.length) {
        case 0:
          friendly_transaction = ''
          favorite.transactions_on = '0'
          break
        case 1:
        case 2:
        case 3:
          favorite.transactions_on = '1'            
          favorite.transactions = [favorite.transactions.slice(0, -1).join(', '), favorite.transactions.slice(-1)[0]].join(favorite.transactions.length < 2 ? '': ', and ')

          friendly_transaction = favorite.transactions.replace('restaurant_reservation', 'restaurant reservations')

          friendly_transaction = `This place offers ${friendly_transaction}.`
          
          break
      }

      favorite.friendly_transactions = friendly_transaction

      favorite.icon = favorite.image_url

      this.favoriteItems.push(favorite)

    } else {
      console.log("populateFavoriteCallback", myFavorite)
      console.log("populateFavoriteCallback", resp)
    }

    if(this.totalFavoriteItems == this.favoriteItems.length)
      this.loading = false

  }

  public loadMoreFavorites(){
    this.getFavoritesLoggedIn()
  }

  public populateFavorite(yelpId: string): Observable<any>{

    let url = `${YELP_BUSINESS_DETAILS_API}${yelpId}`

    const infoObjToPull = {
      config_url: url
    }

    return this.infoObjectService.pullInfoObject(infoObjToPull)

  }

  public removeFavorite(evt: any){

    this.favoriteItems.find( (favorite, index) => {

      if(favorite.id == evt.favoriteId) this.favoriteItems.splice(index, 1)

    })

    if(this.favoriteItems.length == 0) this.noFavorites = true

    this.infoObjectWindow.open = false

  }

  public pullSearchMarker(infoObject: any): void {
    
    this.infoObjectWindow.open = true
    this.infoObject = infoObject

  }

  ngOnInit(): void {
    
    this.bgColor = localStorage.getItem('spotbie_backgroundColor')
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn')

    this.getFavorites()

  }

}
