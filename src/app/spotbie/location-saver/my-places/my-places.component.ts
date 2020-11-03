import { Component, OnInit } from '@angular/core';
import { MyPlacesService } from './my-places.service';

@Component({
  selector: 'app-my-places',
  templateUrl: './my-places.component.html',
  styleUrls: ['../../map/map.component.css', './my-places.component.css']
})
export class MyPlacesComponent implements OnInit {

  public isLoggedIn: string
  public page: number = 1

  public placeList: Array<any>

  public loadMore: boolean = false

  public infoObject: any

  public infoObjectWindow: any = { open: false } 

  public noPlaces: boolean = false

  constructor(private myPlacesService: MyPlacesService) { }

  public getPlaces(): void{

    if(this.isLoggedIn == '1'){

      this.myPlacesService.getPLacesLoggedIn(this.page).subscribe(
        resp => {
          this.populatePlaces(resp)
        }
      )

    } else {

      let placeList = this.myPlacesService.getPlacesLoggedOut()

      if(placeList == null){
        this.noPlaces = true
        return
      } else if(placeList.length == 0)
        this.noPlaces = true
      

      this.populatePlaces(placeList)

    }

  }

  public populatePlaces(placeList: any){

    console.log("My PLaces", placeList)

    this.placeList = placeList


  }

  public openPlace(place: any){

  }
  
  public loadMorePlaces(){

  }

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn')
    this.getPlaces()
  }

}
