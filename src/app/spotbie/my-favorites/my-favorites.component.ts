import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {
  metersToMiles,
  setYelpRatingImage,
} from '../../helpers/info-object-helper';
import {InfoObjectServiceService} from '../map/info-object/info-object-service.service';
import {MyFavoritesService} from './my-favorites.service';

const YELP_BUSINESS_DETAILS_API = 'https://api.yelp.com/v3/businesses/';

@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.component.html',
  styleUrls: ['../map/map.component.css', './my-favorites.component.css'],
})
export class MyFavoritesComponent implements OnInit {
  @Output() closeWindow = new EventEmitter();

  loading = false;
  bgColor: string;
  isLoggedIn: string;
  favoriteItems: Array<any> = [];
  totalFavoriteItems = 0;
  loadMore = false;
  currentPage = 1;
  noFavorites = false;
  infoObjectWindow = {open: false};
  infoObject: any;

  constructor(
    private myFavoritesService: MyFavoritesService,
    private infoObjectService: InfoObjectServiceService
  ) {}

  closeWindowX() {
    this.closeWindow.emit(null);
  }

  getFavorites() {
    if (this.isLoggedIn === '1') {
      this.getFavoritesLoggedIn();
    } else {
      this.getFavoritesLoggedOut();
    }
  }

  private getFavoritesLoggedIn() {
    this.loading = true;

    this.myFavoritesService
      .getFavoritesLoggedIn(this.currentPage)
      .subscribe(resp => {
        this.getFavoritesLoggedInCb(resp);
      });
  }

  private getFavoritesLoggedInCb(httpResponse: any) {
    if (httpResponse.success) {
      const favoriteItems = httpResponse.favorite_items.data;

      this.totalFavoriteItems = favoriteItems.length;

      const currentPage = httpResponse.favorite_items.current_page;
      const lastPage = httpResponse.favorite_items.last_page;

      if (favoriteItems.length === 0) {
        this.loading = false;
      }

      favoriteItems.forEach(favorite => {
        this.populateFavorite(favorite.third_party_id).subscribe(resp => {
          this.populateFavoriteCallback(resp, favorite);
        });
      });

      if (currentPage < lastPage) {
        this.currentPage++;
        this.loadMore = true;
      } else {
        this.loadMore = false;
      }

      if (httpResponse.favorite_items.total === 0) this.noFavorites = true;
    } else console.log('getFavoritesLoggedInCb', httpResponse);
  }

  private getFavoritesLoggedOut() {
    const favoriteItems = this.myFavoritesService.getFavoritesLoggedOut();

    if (favoriteItems && favoriteItems.length > 0) {
      this.totalFavoriteItems = favoriteItems.length;

      this.loading = true;

      favoriteItems.forEach(favorite => {
        this.populateFavorite(favorite.third_party_id).subscribe(resp => {
          this.populateFavoriteCallback(resp, favorite);
        });
      });
    } else this.noFavorites = true;
  }

  populateFavoriteCallback(resp: any, myFavorite: any) {
    if (resp.success) {
      const favorite = resp.data;

      favorite.type_of_info_object = 'yelp_business';
      favorite.type_of_info_object_category =
        myFavorite.type_of_info_object_category;

      favorite.rating_image = setYelpRatingImage(favorite.rating);

      if (favorite.is_closed) {
        favorite.is_closed_msg = 'Closed';
      } else {
        favorite.is_closed_msg = 'Open';
      }

      if (favorite.price) {
        favorite.price_on = '1';
      }

      if (favorite.image_url === '') {
        favorite.image_url = '0';
      }

      let friendly_transaction = '';

      favorite.transactions = favorite.transactions.sort();

      switch (favorite.transactions.length) {
        case 0:
          friendly_transaction = '';
          favorite.transactions_on = '0';
          break;
        case 1:
        case 2:
        case 3:
          favorite.transactions_on = '1';
          favorite.transactions = [
            favorite.transactions.slice(0, -1).join(', '),
            favorite.transactions.slice(-1)[0],
          ].join(favorite.transactions.length < 2 ? '' : ', and ');
          friendly_transaction = favorite.transactions.replace(
            'restaurant_reservation',
            'reservations'
          );
          friendly_transaction = `${friendly_transaction}.`;
          break;
      }

      favorite.friendly_transactions = friendly_transaction;

      favorite.icon = favorite.image_url;

      this.favoriteItems.push(favorite);
    } else {
      console.log('populateFavoriteCallback', myFavorite);
      console.log('populateFavoriteCallback', resp);
    }

    if (this.totalFavoriteItems === this.favoriteItems.length) {
      this.loading = false;
    }
  }

  loadMoreFavorites() {
    this.getFavoritesLoggedIn();
  }

  populateFavorite(yelpId: string): Observable<any> {
    const url = `${YELP_BUSINESS_DETAILS_API}${yelpId}`;

    const infoObjToPull = {
      config_url: url,
    };

    return this.infoObjectService.pullInfoObject(infoObjToPull);
  }

  removeFavorite(evt: any) {
    this.favoriteItems.find((favorite, index) => {
      if (favorite.id === evt.favoriteId) {
        this.favoriteItems.splice(index, 1);
      }
    });

    if (this.favoriteItems.length === 0) {
      this.noFavorites = true;
    }

    this.infoObjectWindow.open = false;
  }

  pullSearchMarker(infoObject: any): void {
    this.infoObjectWindow.open = true;
    this.infoObject = infoObject;
  }

  ngOnInit(): void {
    this.bgColor = localStorage.getItem('spotbie_backgroundColor');
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn');

    this.getFavorites();
  }
}
