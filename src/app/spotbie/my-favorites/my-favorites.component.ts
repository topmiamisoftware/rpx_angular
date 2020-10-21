import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  public favoriteItems: Array<any>

  constructor(private favoritesService: MyFavoritesService) { }

  public closeWindowX(){
    this.closeWindow.emit(null)
  }

  public getFavorites(){

    if(this.isLoggedIn == '1'){
      this.getFavoritesLoggedIn()
    } else {
      this.getFavoritesLoggedOut()
    }

  }

  private getFavoritesLoggedIn(){

    this.favoritesService.getFavoritesLoggedIn().subscribe(
      resp => {
        this.getFavoritesLoggedInCb(resp) 
      }
    )

  }

  private getFavoritesLoggedInCb(httpResponse: any){

    if(httpResponse.success){

      let favoriteItems = httpResponse.favorite_items.data

    } else {
      console.log("getFavoritesLoggedInCb", httpResponse)
    }

  }

  private getFavoritesLoggedOut(){
    
  }

  ngOnInit(): void {
    
    this.bgColor = localStorage.getItem('spotbie_backgroundColor')
    this.isLoggedIn = localStorage.getItem('spotbie_backgroundColor')

    this.getFavorites()

  }

}
