import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { last } from 'rxjs/operators';
import { MyFavoritesService } from './my-favorites.service';

@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.component.html',
  styleUrls: ['./my-favorites.component.css']
})
export class MyFavoritesComponent implements OnInit {

  @Output() closeWindow = new EventEmitter()
  
  public loading: boolean = false

  public bgColor: string
  public isLoggedIn: string

  public favoriteItems: Array<any> = []
  
  public loadMore: boolean = false

  public currentPage: number = 1

  public noFavorites: boolean = false

  constructor(private favoritesService: MyFavoritesService) { }

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

    this.favoritesService.getFavoritesLoggedIn(this.currentPage).subscribe(
      resp => {
        this.getFavoritesLoggedInCb(resp) 
      }
    )

  }

  private getFavoritesLoggedInCb(httpResponse: any){

    if(httpResponse.success){

      let favoriteItems = httpResponse.favorite_items.data

      let currentPage = httpResponse.favorite_items.current_page
      let lastPage = httpResponse.favorite_items.last_page

      this.favoriteItems.push(favoriteItems)

      if(currentPage < lastPage){
        this.currentPage++
        this.loadMore = true
      } else {
        this.loadMore = false
      }

      if(this.favoriteItems.length == 0 )
        this.noFavorites = true
    } else
      console.log("getFavoritesLoggedInCb", httpResponse)

      console.log("favoriteItems", this.favoriteItems)

  }

  private getFavoritesLoggedOut(){
    
    this.favoriteItems = JSON.parse(localStorage.getItem('spotbie_currentFavorites'))

  }

  public loadMoreFavorites(){
    this.getFavoritesLoggedIn()
  }

  ngOnInit(): void {
    
    this.bgColor = localStorage.getItem('spotbie_backgroundColor')
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn')

    this.getFavorites()

  }

}
