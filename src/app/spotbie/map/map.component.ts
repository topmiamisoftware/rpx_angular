import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {MatSliderChange} from '@angular/material/slider';
import {AgmMap, AgmInfoWindow} from '@agm/core';
import {
  metersToMiles,
  setYelpRatingImage,
} from '../../helpers/info-object-helper';
import {DeviceDetectorService} from 'ngx-device-detector';
import {LocationService} from '../../services/location-service/location.service';
import {BusinessDashboardComponent} from '../spotbie-logged-in/business-dashboard/business-dashboard.component';
import {UserDashboardComponent} from '../spotbie-logged-in/user-dashboard/user-dashboard.component';
import {BottomAdBannerComponent} from '../ads/bottom-ad-banner/bottom-ad-banner.component';
import {
  EVENT_CATEGORIES,
  FOOD_CATEGORIES,
  SHOPPING_CATEGORIES,
} from './map_extras/map_extras';
import {HeaderAdBannerComponent} from '../ads/header-ad-banner/header-ad-banner.component';
import {Business} from '../../models/business';
import {MapObjectIconPipe} from '../../pipes/map-object-icon.pipe';
import * as map_extras from './map_extras/map_extras';
import * as sorterHelpers from '../../helpers/results-sorter.helper';
import {SortOrderPipe} from '../../pipes/sort-order.pipe';
import {DateFormatPipe, TimeFormatPipe} from '../../pipes/date-format.pipe';
import {environment} from '../../../environments/environment';

const YELP_BUSINESS_SEARCH_API = 'https://api.yelp.com/v3/businesses/search';
const BANNED_YELP_IDS = map_extras.BANNED_YELP_IDS;

const SBCM_INTERVAL = 16000;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  @Input() business = false;
  @Input() spotType: any;

  @Output() signUpEvt = new EventEmitter();
  @Output() openBusinessSettingsEvt = new EventEmitter();

  @ViewChild('spotbie_map') spotbie_map: AgmMap;
  @ViewChild('spotbie_user_marker_info_window')
  spotbie_user_marker_info_window: AgmInfoWindow;
  @ViewChild('businessHomeDashboard')
  businessHomeDashboard: BusinessDashboardComponent;
  @ViewChild('userHomeDashboard') userHomeDashboard: UserDashboardComponent;
  @ViewChild('featureWrapper') featureWrapper: ElementRef;
  @ViewChild('featureWrapperAnchor') featureWrapperAnchor: ElementRef;
  @ViewChild('scrollMapAppAnchor') scrollMapAppAnchor: ElementRef;
  @ViewChild('bottomAdBanner') bottomAdBanner: BottomAdBannerComponent = null;
  @ViewChild('singleAdApp') singleAdApp: HeaderAdBannerComponent = null;
  @ViewChild('viewParentWindow') viewParentWindow: ElementRef;

  private showOpenedParam: string;
  private n2_x = 0;
  private n3_x = 7;
  private rad_11 = null;
  private rad_1 = null;
  private finderSearchTimeout: any;
  private searchResultsOriginal: Array<any> = [];

  isLoggedIn: string;
  iconUrl: string;
  spotbie_username: string;
  bg_color: string;
  user_default_image: string;
  searchResultsSubtitle: string;
  searchCategoriesPlaceHolder: string;
  sort_by_txt = 'Distance';
  sorting_order = 'asc';
  sortAc = 0;
  totalResults = 0;
  current_offset = 0;
  itemsPerPage = 20;
  around_me_search_page = 1;
  loadedTotalResults = 0;
  allPages = 0;
  maxDistanceCap = 45;
  maxDistance = 10;
  searchCategory: number;
  previousSearchCategory: number;
  searchCategorySorter: number;
  search_keyword: string;
  type_of_info_object: string;
  eventDateParam: string;
  sortEventDate = 'none';
  showingOpenedStatus = 'Showing Opened & Closed';
  searchApiUrl: string;
  lat: number;
  lng: number;
  ogLat: number;
  ogLng: number;
  fitBounds = false;
  zoom = 18;
  map = false;
  showSearchResults: boolean;
  show_search_box: boolean;
  locationFound = false;
  sliderRight = false;
  catsUp = false;
  loading = false;
  toastHelper = false;
  displaySurroundingObjectList = false;
  showNoResultsBox = false;
  showMobilePrompt = true;
  showMobilePrompt2 = false;
  firstTimeShowingMap = true;
  showOpened = false;
  current_search_type = '0';
  surroundingObjectList = [];
  searchResults = [];
  event_categories;
  event_classifications = map_extras.EVENT_CATEGORIES;
  food_categories = map_extras.FOOD_CATEGORIES;
  shopping_categories = map_extras.SHOPPING_CATEGORIES;
  number_categories: number;
  bottom_banner_categories: number;
  map_styles = map_extras.MAP_STYLES;
  infoObject: any;
  infoObjectWindow: any = {open: false};
  currentMarker: any;
  categories: any;
  myFavoritesWindow = {open: false};
  update_distance_timeout: any;
  isDesktop = false;
  isTablet = false;
  isMobile = false;
  displayLocationEnablingInstructions = false;
  bannedYelpIDs = BANNED_YELP_IDS;
  communityMemberList: Array<Business> = [];
  eventsClassification: number = null;
  getSpotBieCommunityMemberListInterval: any = false;
  currentCategoryList: any;

  constructor(
    private locationService: LocationService,
    private deviceService: DeviceDetectorService,
    private mapIconPipe: MapObjectIconPipe
  ) {}

  priceSortDesc(a, b) {
    a = a.price;
    b = b.price;

    if (a === undefined) {
      return 1;
    } else if (b === undefined) {
      return -1;
    }
    return a.length > b.length ? -1 : b.length > a.length ? 1 : 0;
  }

  deliverySort() {
    this.searchResults = this.searchResults.filter(searchResult => {
      return searchResult.transactions.indexOf('delivery') > -1;
    });
  }

  pickUpSort() {
    this.searchResults = this.searchResults.filter(searchResult => {
      return searchResult.transactions.indexOf('pickup') > -1;
    });
  }

  reservationSort() {
    this.searchResults = this.searchResults.filter(searchResult => {
      return searchResult.transactions.indexOf('restaurant_reservation') > -1;
    });
  }

  eventsToday() {
    this.sortEventDate = 'today';

    let startTime = new Date().toISOString().slice(0, 11);
    startTime = `${startTime}00:00:00Z`;

    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 1);

    let newEndTime = endTime.toISOString().slice(0, 11);
    newEndTime = `${newEndTime}00:00:00Z`;

    this.eventDateParam = `startEndDateTime=${startTime},${newEndTime}`;
    this.apiSearch(this.search_keyword);
  }

  eventsThisWeekend() {
    this.sortEventDate = 'weekend';
    const startTime = this.nextWeekdayDate(new Date(), 5);

    let newStartTime = startTime.toISOString().slice(0, 11);
    newStartTime = `${newStartTime}00:00:00Z`;

    const endTime = this.nextWeekdayDate(new Date(), 1);

    let newEndTime = endTime.toISOString().slice(0, 11);
    newEndTime = `${newEndTime}00:00:00Z`;

    this.eventDateParam = `startEndDateTime=${newStartTime},${newEndTime}`;
    this.apiSearch(this.search_keyword);
  }

  nextWeekdayDate(date, dayInWeek) {
    const ret = new Date(date || new Date());
    ret.setDate(ret.getDate() + ((dayInWeek - 1 - ret.getDay() + 7) % 7) + 1);
    return ret;
  }

  showOpen() {
    this.showOpened = !this.showOpened;

    if (!this.showOpened) {
      this.showingOpenedStatus = 'Show Opened and Closed';
      this.showOpenedParam = 'open_now=true';
    } else {
      this.showingOpenedStatus = 'Show Opened';
      const unixTime = Math.floor(Date.now() / 1000);
      this.showOpenedParam = `open_at=${unixTime}`;
    }
    this.apiSearch(this.search_keyword);
  }

  updateDistance(evt: MatSliderChange): void {
    clearTimeout(this.update_distance_timeout);

    this.update_distance_timeout = setTimeout(() => {
      this.maxDistance = evt.value;

      if (this.showNoResultsBox) {
        this.apiSearch(this.search_keyword);
      } else {
        const results = this.searchResultsOriginal.filter(searchResult => {
          return searchResult.distance < this.maxDistance;
        });

        this.loadedTotalResults = results.length;
        this.searchResults = results;
        this.sortBy(this.sortAc);
      }
    }, 500);
  }

  changeSorting() {
    this.sortBy(this.sortAc);
  }

  sortBy(ac: number) {
    this.sortAc = ac;

    switch (ac) {
      case 0:
        this.sort_by_txt = 'Distance';
        break;
      case 1:
        this.sort_by_txt = 'Rating';
        break;
      case 2:
        this.sort_by_txt = 'Reviews';
        break;
      case 3:
        this.sort_by_txt = 'Price';
        break;
      case 4:
        this.sort_by_txt = 'Delivery';
        break;
      case 5:
        this.sort_by_txt = 'Pick-up';
        break;
      case 6:
        this.sort_by_txt = 'Reservations';
        break;
      case 7:
        this.sort_by_txt = 'Events Today';
        break;
      case 8:
        this.sort_by_txt = 'Events This Weekend';
        break;
    }

    if (ac !== 4 && ac !== 5 && ac !== 6 && ac !== 7 && ac !== 8) {
      if (this.sorting_order === 'desc') {
        this.sorting_order = 'asc';
      } else {
        this.sorting_order = 'desc';
      }
    }

    switch (ac) {
      case 0:
        // sort by distance
        if (this.sorting_order === 'desc')
          this.searchResults = this.searchResults.sort(
            sorterHelpers.distanceSortDesc
          );
        else
          this.searchResults = this.searchResults.sort(
            sorterHelpers.distanceSortAsc
          );

        break;
      case 1:
        // sort by rating
        if (this.sorting_order === 'desc')
          this.searchResults = this.searchResults.sort(
            sorterHelpers.ratingSortDesc
          );
        else
          this.searchResults = this.searchResults.sort(
            sorterHelpers.ratingSortAsc
          );

        break;
      case 2:
        // sort by reviews
        if (this.sorting_order === 'desc')
          this.searchResults = this.searchResults.sort(
            sorterHelpers.reviewsSortDesc
          );
        else
          this.searchResults = this.searchResults.sort(
            sorterHelpers.reviewsSortAsc
          );

        break;
      case 3:
        // sort by price
        if (this.sorting_order === 'desc')
          this.searchResults = this.searchResults.sort(this.priceSortDesc);
        else
          this.searchResults = this.searchResults.sort(
            sorterHelpers.priceSortAsc
          );

        break;
      case 4:
        // sort by delivery
        this.deliverySort();
        break;
      case 5:
        // sort by pick up
        this.pickUpSort();
        break;
      case 6:
        // sort by reservation
        this.reservationSort();
        break;
      case 7:
        // sort events by today
        this.eventsToday();
        break;
      case 8:
        // sort by this weekend
        this.eventsThisWeekend();
        break;
    }
  }

  classificationSearch(): void {
    this.loading = true;
    this.locationService.getClassifications().subscribe(resp => {
      this.classificationSearchCallback(resp);
    });
  }

  classificationSearchCallback(httpResponse: any) {
    this.loading = false;

    if (httpResponse.success) {
      const classifications: Array<any> =
        httpResponse.data._embedded.classifications;

      classifications.forEach(classification => {
        if (
          classification.type &&
          classification.type.name &&
          classification.type.name !== 'Undefined'
        ) {
          classification.name = classification.type.name;
        } else if (
          classification.segment &&
          classification.segment.name &&
          classification.segment.name !== 'Undefined'
        ) {
          classification.name = classification.segment.name;
          classification.segment._embedded.genres.forEach(genre => {
            genre.show_sub_sub = false;
            if (
              genre.name === 'Chanson Francaise' ||
              genre.name === 'Medieval/Renaissance' ||
              genre.name === 'Religious' ||
              genre.name === 'Undefined' ||
              genre.name === 'World'
            ) {
              classification.segment._embedded.genres.splice(
                classification.segment._embedded.genres.indexOf(genre),
                1
              );
            }
          });
        }

        if (classification.name !== undefined) {
          classification.show_sub = false;

          if (
            classification.name !== 'Donation' &&
            classification.name !== 'Parking' &&
            classification.name !== 'Transportation' &&
            classification.name !== 'Upsell' &&
            classification.name !== 'Venue Based' &&
            classification.name !== 'Event Style' &&
            classification.name !== 'Individual' &&
            classification.name !== 'Merchandise' &&
            classification.name !== 'Group'
          ) {
            this.event_categories.push(classification);
          }
        }
      });
      this.event_categories = this.event_categories.reverse();
      this.catsUp = true;
    } else {
      console.log('getClassifications Error ', httpResponse);
    }

    this.loading = false;
  }

  showEventSubCategory(subCat: any) {
    if (
      subCat._embedded.subtypes !== undefined &&
      subCat._embedded.subtypes.length === 1
    ) {
      this.apiSearch(subCat.name);
      return;
    } else if (
      subCat._embedded.subgenres !== undefined &&
      subCat._embedded.subgenres.length === 1
    ) {
      this.apiSearch(subCat.name);
      return;
    }
    subCat.show_sub_sub = !subCat.show_sub_sub;
  }

  showEventSub(classification: any) {
    this.eventsClassification = this.event_classifications.indexOf(
      classification.name
    );
    classification.show_sub = !classification.show_sub;
  }

  newKeyWord() {
    this.totalResults = 0;
    this.allPages = 0;
    this.current_offset = 0;
    this.around_me_search_page = 1;
    this.searchResults = [];
  }

  apiSearch(keyword: string, resetEventSorter = false) {
    this.loading = true;
    this.search_keyword = keyword;

    keyword = encodeURIComponent(keyword);

    this.communityMemberList = [];

    if (this.search_keyword !== keyword) {
      this.newKeyWord();
    }

    if (resetEventSorter) {
      this.eventDateParam = undefined;
      this.sortEventDate = 'none';
    }

    let apiUrl: string;

    switch (this.searchCategory) {
      case 3:
        apiUrl = `size=2&latlong=${this.lat},${this.lng}&classificationName=${keyword}&radius=45&${this.eventDateParam}`;
        this.number_categories = this.event_categories.indexOf(
          this.search_keyword
        );
        break;
      case 1:
        apiUrl = `${this.searchApiUrl}?latitude=${this.lat}&longitude=${this.lng}&term=${keyword}&categories=${keyword}&${this.showOpenedParam}&radius=40000&sort_by=rating&limit=20&offset=${this.current_offset}`;
        this.number_categories = this.food_categories.indexOf(
          this.search_keyword
        );
        break;
      case 2:
        apiUrl = `${this.searchApiUrl}?latitude=${this.lat}&longitude=${this.lng}&term=${keyword}&categories=${keyword}&${this.showOpenedParam}&radius=40000&sort_by=rating&limit=20&offset=${this.current_offset}`;
        this.number_categories = this.shopping_categories.indexOf(
          this.search_keyword
        );
    }

    const searchObj = {
      config_url: apiUrl,
    };

    const searchObjSb = {
      loc_x: this.lat,
      loc_y: this.lng,
      categories: JSON.stringify(this.number_categories),
    };

    switch (this.searchCategory) {
      case 3:
        // Retrieve the SpotBie Community Member Results
        this.locationService.getEvents(searchObj).subscribe(resp => {
          this.getEventsSearchCallback(resp);
        });
        // Retrieve the SpotBie Community Member Results
        this.locationService
          .getSpotBieCommunityMemberList(searchObjSb)
          .subscribe(resp => {
            this.getSpotBieCommunityMemberListCb(resp);
          });
        break;
      case 1:
      case 2:
        // Retrieve the thirst party API Yelp Results
        this.locationService.getBusinesses(searchObj).subscribe(resp => {
          this.getBusinessesSearchCallback(resp);
        });

        // Retrieve the SpotBie Community Member Results
        this.locationService
          .getSpotBieCommunityMemberList(searchObjSb)
          .subscribe(resp => {
            this.getSpotBieCommunityMemberListCb(resp);
          });
        break;
    }
  }

  openWelcome() {
    this.scrollMapAppAnchor.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    this.catsUp = false;
    this.map = false;
    this.show_search_box = false;
    this.showSearchResults = false;
    this.infoObject = null;
    this.searchResults = [];
    this.infoObjectWindow.open = false;
  }

  sortingOrderClass(sortingOrder: string) {
    return new SortOrderPipe().transform(sortingOrder);
  }

  spawnCategories(category: number): void {
    this.scrollMapAppAnchor.nativeElement.scrollIntoView();
    this.show_search_box = true;
    this.infoObject = null;

    if (this.searchCategory !== category) {
      this.previousSearchCategory = this.searchCategory;
    }

    // If the category we picked is the same one as the
    // previously opened one then we can skip some steps.
    if (category === this.previousSearchCategory) {
      window.navigator.geolocation.getCurrentPosition(coords => {
        this.showPosition(coords);
      });

      return;
    }

    if (!this.locationFound) {
      if (this.mobileStartLocation() === false) {
        return;
      }
    } else if (this.showMobilePrompt) {
      this.showMobilePrompt = false;
    }

    this.zoom = 18;
    this.fitBounds = false;
    this.map = true;

    if (this.searchResults.length === 0) {
      this.showSearchResults = false;
    }

    this.searchCategory = category;

    switch (this.searchCategory) {
      case 1:
        this.searchApiUrl = YELP_BUSINESS_SEARCH_API;
        this.searchCategoriesPlaceHolder = 'Search Places to Eat...';
        this.categories = this.food_categories;
        this.bottom_banner_categories = this.categories.indexOf(
          this.categories[Math.floor(Math.random() * this.categories.length)]
        );
        break;
      case 2:
        this.searchApiUrl = YELP_BUSINESS_SEARCH_API;
        this.searchCategoriesPlaceHolder = 'Search Shopping...';
        this.categories = this.shopping_categories;
        this.bottom_banner_categories = this.categories.indexOf(
          this.categories[Math.floor(Math.random() * this.categories.length)]
        );
        break;
      case 3:
        this.event_categories = [];
        this.searchCategoriesPlaceHolder = 'Search Events...';
        this.categories = this.event_categories;
        this.bottom_banner_categories = this.categories.indexOf(
          this.categories[Math.floor(Math.random() * this.categories.length)]
        );
        this.classificationSearch();
        return;
    }

    this.catsUp = true;
  }

  cleanCategory() {
    if (this.searchCategory !== this.previousSearchCategory) {
      this.searchResults = [];
      switch (this.searchCategory) {
        case 1:
        case 2:
          this.type_of_info_object = 'yelp_business';
          this.maxDistanceCap = 25;
          break;
        case 3:
          this.type_of_info_object = 'ticketmaster_events';
          this.maxDistanceCap = 45;
          return;
      }
    }
  }

  goToQrCode() {
    // scroll to qr Code
    this.closeCategories();
    this.openWelcome();

    setTimeout(() => {
      if (this.business) {
        this.businessHomeDashboard.scrollToQrAppAnchor();
      } else {
        this.userHomeDashboard.scrollToQrAppAnchor();
      }
    }, 750);
  }

  goToLp() {
    // scroll to loyalty points
    this.closeCategories();
    this.openWelcome();

    setTimeout(() => {
      if (this.business) {
        this.businessHomeDashboard.scrollToLpAppAnchor();
      } else {
        this.userHomeDashboard.scrollToLpAppAnchor();
      }
    }, 750);
  }

  goToRewardMenu() {
    // scroll to reward menu
    this.closeCategories();
    this.openWelcome();

    setTimeout(() => {
      if (this.business) {
        this.businessHomeDashboard.scrollToRewardMenuAppAnchor();
      } else {
        this.userHomeDashboard.scrollToRewardMenuAppAnchor();
      }
    }, 750);
  }

  closeCategories(): void {
    this.catsUp = false;
  }

  searchSpotBie(evt: any): void {
    this.search_keyword = evt.target.value;
    const searchTerm = encodeURIComponent(evt.target.value);

    clearTimeout(this.finderSearchTimeout);

    this.finderSearchTimeout = setTimeout(() => {
      this.loading = true;

      let apiUrl: string;

      if (this.searchCategory === 3) {
        apiUrl = `size=20&latlong=${this.lat},${this.lng}&keyword=${searchTerm}&radius=45`;

        const searchObj = {
          config_url: apiUrl,
        };

        this.locationService.getEvents(searchObj).subscribe(resp => {
          this.getEventsSearchCallback(resp);
        });
      } else {
        // Used for loading places to eat and shopping from yelp
        apiUrl = `${this.searchApiUrl}?latitude=${this.lat}&longitude=${this.lng}&term=${searchTerm}&${this.showOpenedParam}&radius=40000&sort_by=best_match&limit=20&offset=${this.current_offset}`;

        const searchObj = {
          config_url: apiUrl,
        };

        this.locationService.getBusinesses(searchObj).subscribe(resp => {
          this.getBusinessesSearchCallback(resp);
        });

        const searchObjSb = {
          loc_x: this.lat,
          loc_y: this.lng,
          categories: this.search_keyword,
        };

        this.locationService
          .getSpotBieCommunityMemberList(searchObjSb)
          .subscribe(resp => {
            this.getSpotBieCommunityMemberListCb(resp);
          });
      }
    }, 1500);
  }

  displayPageNext(page: number) {
    if (page < this.allPages) return {};
    else return {display: 'none'};
  }

  displayPage(page: number) {
    if (page > 0) return {};
    else return {display: 'none'};
  }

  goToPage(page: number) {
    this.around_me_search_page = page;
    this.current_offset =
      this.around_me_search_page * this.itemsPerPage - this.itemsPerPage;
    this.apiSearch(this.search_keyword);
    this.scrollMapAppAnchor.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  loadMoreResults(action: number) {
    switch (action) {
      case 0:
        if (this.around_me_search_page === 1)
          this.around_me_search_page = Math.ceil(
            this.totalResults / this.itemsPerPage
          );
        else this.around_me_search_page--;
        break;
      case 1:
        if (
          this.around_me_search_page ===
          Math.ceil(this.totalResults / this.itemsPerPage)
        ) {
          this.around_me_search_page = 1;
          this.current_offset = 0;
        } else {
          this.around_me_search_page++;
        }
        break;
    }
    this.current_offset =
      this.around_me_search_page * this.itemsPerPage - this.itemsPerPage;
    this.apiSearch(this.search_keyword);
    this.scrollMapAppAnchor.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  hideSearchResults(): void {
    this.showSearchResults = !this.showSearchResults;
  }

  formatPhoneNumber(phoneNumberString) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      const intlCode = match[1] ? '+1 ' : '';
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
  }

  openSearchResult(search_result) {
    // console.log('Open Reuslt ', search_result)
  }

  dismissToast(evt: Event) {
    this.toastHelper = false;
  }

  getMapWrapperClass() {
    if (this.showSearchResults) {
      return 'spotbie-map sb-map-results-open';
    } else {
      return 'spotbie-map';
    }
  }

  getMapClass() {
    if (this.showSearchResults) {
      return 'spotbie-agm-map sb-map-results-open';
    } else {
      if (this.isMobile) {
        return 'spotbie-agm-map sb-map-results-open';
      }
      return 'spotbie-agm-map';
    }
  }

  getEventsSearchCallback(httpResponse: any): void {
    this.loading = false;

    if (httpResponse.success) {
      this.totalResults = httpResponse.data.page.totalElements;
      const eventObject = httpResponse.data;

      if (this.totalResults === 0 || eventObject._embedded === undefined) {
        this.showNoResultsBox = true;
        this.loading = false;
        this.searchResults = [];
        return;
      } else {
        this.showNoResultsBox = false;
        this.sortEventDate = 'none';
      }

      this.cleanCategory();

      window.scrollTo(0, 0);

      this.showSearchResults = true;
      this.catsUp = false;
      this.loading = false;
      const eventObjectList = eventObject._embedded.events;
      this.totalResults = eventObjectList.length;
      this.allPages = Math.ceil(this.totalResults / this.itemsPerPage);

      if (this.allPages === 0) {
        this.allPages = 1;
      }

      for (let i = 0; i < eventObjectList.length; i++) {
        eventObjectList[i].coordinates = {
          latitude: '',
          longitude: '',
        };

        eventObjectList[i].coordinates.latitude = parseFloat(
          eventObjectList[i]._embedded.venues[0].location.latitude
        );
        eventObjectList[i].coordinates.longitude = parseFloat(
          eventObjectList[i]._embedded.venues[0].location.longitude
        );
        eventObjectList[i].icon = eventObjectList[i].images[0].url;
        eventObjectList[i].image_url = this.ticketMasterLargestImage(
          eventObjectList[i].images
        );
        eventObjectList[i].type_of_info_object = 'ticketmaster_event';

        const dtObj = new Date(eventObjectList[i].dates.start.localDate);
        const timeDate = new DateFormatPipe().transform(dtObj);
        const timeHr = new TimeFormatPipe().transform(
          eventObjectList[i].dates.start.localTime
        );

        eventObjectList[i].dates.start.spotbieDate = timeDate;
        eventObjectList[i].dates.start.spotbieHour = timeHr;

        this.searchResults.push(eventObjectList[i]);
      }

      this.sorting_order = 'desc';
      this.sortBy(0);
      this.searchCategorySorter = this.searchCategory;
      this.searchResultsSubtitle = 'Events';
      this.searchResultsOriginal = this.searchResults;
      this.showSearchResults = true;
      this.spotbie_user_marker_info_window.open();
      this.displaySurroundingObjectList = false;
      this.show_search_box = true;
      this.loadedTotalResults = this.searchResults.length;
      this.maxDistance = 45;
    } else {
      console.log('getEventsSearchCallback Error: ', httpResponse);
    }

    this.loading = false;
  }

  ticketMasterLargestImage(imageList: any) {
    const largestDimension = Math.max.apply(
      Math,
      imageList.map(image => {
        return image.width;
      })
    );

    const largestImage = imageList.find(image => {
      return image.width === largestDimension;
    });

    return largestImage.url;
  }

  getSpotBieCommunityMemberListCb(httpResponse: any) {
    if (httpResponse.success) {
      const communityMemberList: Array<Business> = httpResponse.data;

      communityMemberList.forEach((business: Business) => {
        business.type_of_info_object = 'spotbie_community';
        business.is_community_member = true;

        switch (this.searchCategory) {
          case 1:
            if (business.photo === '')
              business.photo = 'assets/images/home_imgs/find-places-to-eat.svg';
            this.currentCategoryList = FOOD_CATEGORIES;
            break;
          case 2:
            if (business.photo === '')
              business.photo =
                'assets/images/home_imgs/find-places-for-shopping.svg';
            this.currentCategoryList = SHOPPING_CATEGORIES;
            break;
          case 3:
            if (business.photo === '')
              business.photo = 'assets/images/home_imgs/find-events.svg';
            this.currentCategoryList = EVENT_CATEGORIES;
        }

        const cleanCategories = [];

        this.currentCategoryList.reduce(
          (
            previousValue: string,
            currentValue: string,
            currentIndex: number,
            array: string[]
          ) => {
            if (business.categories.indexOf(currentIndex) > -1) {
              cleanCategories.push(this.currentCategoryList[currentIndex]);
            }
            return currentValue;
          }
        );

        business.cleanCategories = cleanCategories.toString();
        business.rewardRate = business.loyalty_point_dollar_percent_value / 100;
      });

      this.communityMemberList = communityMemberList;

      if (!this.getSpotBieCommunityMemberListInterval) {
        this.getSpotBieCommunityMemberListInterval = setInterval(() => {
          const searchObjSb = {
            loc_x: this.lat,
            loc_y: this.lng,
            categories: JSON.stringify(this.number_categories),
          };

          // Retrieve the SpotBie Community Member Results
          this.locationService
            .getSpotBieCommunityMemberList(searchObjSb)
            .subscribe(resp => {
              this.getSpotBieCommunityMemberListCb(resp);
            });
        }, SBCM_INTERVAL);
      }
    }
  }

  getBusinessesSearchCallback(httpResponse: any): void {
    this.loading = false;
    this.maxDistanceCap = 25;
    this.fitBounds = true;

    if (httpResponse.success) {
      this.totalResults = httpResponse.data.total;

      if (this.totalResults === 0) {
        this.showNoResultsBox = true;
        return;
      } else {
        this.showNoResultsBox = false;
      }

      window.scrollTo(0, 0);
      this.cleanCategory();
      this.showSearchResults = true;
      this.catsUp = false;
      const placesResult = httpResponse.data;
      this.populateYelpResults(placesResult);

      this.searchCategorySorter = this.searchCategory;
      this.displaySurroundingObjectList = false;
      this.show_search_box = true;
    } else {
      console.log('Place Search Error: ', httpResponse);
    }
  }

  private async populateYelpResults(data: any) {
    let results = data.businesses;

    let i = 0;
    const resultsToRemove = [];

    results.forEach(business => {
      // Remove some banned yelp results.
      if (this.bannedYelpIDs.indexOf(business.id) > -1) {
        resultsToRemove.push(i);
      }

      business.rating_image = setYelpRatingImage(business.rating);
      business.type_of_info_object = this.type_of_info_object;
      business.type_of_info_object_category = this.searchCategory;
      business.is_community_member = false;

      if (business.is_closed) business.is_closed_msg = 'Closed';
      else business.is_closed_msg = 'Open';

      if (business.price) business.price_on = '1';

      if (business.image_url === '') business.image_url = '0';

      let friendly_transaction = '';

      business.transactions = business.transactions.sort();

      switch (business.transactions.length) {
        case 0:
          // console.log("single business Transaction ",  business.transactions)
          friendly_transaction = '';
          business.transactions_on = '0';
          break;
        case 1:
        case 2:
        case 3:
          business.transactions_on = '1';
          business.transactions = [
            business.transactions.slice(0, -1).join(', '),
            business.transactions.slice(-1)[0],
          ].join(business.transactions.length < 2 ? '' : ', and ');
          friendly_transaction = business.transactions.replace(
            'restaurant_reservation',
            'reservations'
          );
          friendly_transaction = friendly_transaction + '.';
          break;
      }
      business.friendly_transactions = friendly_transaction;
      business.distance = metersToMiles(business.distance);
      business.icon = business.image_url;

      i++;
    });

    for (let y = 0; y < resultsToRemove.length; y++) {
      results.splice(resultsToRemove[y], 1);
    }

    this.searchResultsOriginal = results;

    results = results.filter(searchResult => {
      return searchResult.distance < this.maxDistance;
    });

    this.searchResults = results;

    if (this.sorting_order === 'desc') this.sorting_order = 'asc';
    else this.sorting_order = 'desc';

    this.sortBy(this.sortAc);

    switch (this.searchCategory) {
      case 1:
        this.searchResultsSubtitle = 'Spots';
        break;
      case 2:
        this.searchResultsSubtitle = 'Shopping Spots';
        break;
    }

    this.loadedTotalResults = this.searchResults.length;
    this.allPages = Math.ceil(this.totalResults / this.itemsPerPage);

    if (this.allPages === 0) this.allPages = 1;

    if (this.loadedTotalResults > 1000) {
      this.totalResults = 1000;
      this.loadedTotalResults = 1000;
      this.allPages = 20;
    }
  }

  pullSearchMarker(infoObject: any): void {
    this.infoObjectWindow.open = true;
    this.infoObject = infoObject;
  }

  checkSearchResultsFitBounds() {
    if (this.communityMemberList.length < 3 && this.searchResults.length > 0)
      return true;
    else return false;
  }

  checkCommunityMemberFitBounds() {
    if (this.searchResults.length < 3 || this.communityMemberList.length >= 3)
      return true;
    else return false;
  }

  showPosition(position: any): void {
    this.locationFound = true;
    this.displayLocationEnablingInstructions = false;

    if (environment.fakeLocation) {
      this.lat = environment.myLocX;
      this.lng = environment.myLocY;
      this.ogLat = environment.myLocX;
      this.ogLng = environment.myLocY;
    } else {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.ogLat = position.coords.latitude;
      this.ogLng = position.coords.longitude;
    }

    this.spotbie_map.triggerResize(true);

    if (this.firstTimeShowingMap) {
      this.firstTimeShowingMap = false;
      this.drawPosition();
    }

    this.showMobilePrompt2 = false;
    // this.loading = false
  }

  drawPosition() {
    this.iconUrl = this.user_default_image;
    this.saveUserLocation();
  }

  pullMarker(mapObject: any): void {
    this.currentMarker = mapObject;
    this.sliderRight = true;
  }

  getSingleCatClass(i) {
    if (i % 2 === 0) return 'spotbie-single-cat';
    else return 'spotbie-single-cat single-cat-light';
  }

  selfMarker(): void {
    this.currentMarker = {
      user_web_options: {bg_color: this.bg_color},
      user_info: {
        exe_username: this.spotbie_username,
        exe_user_default_picture: localStorage.getItem(
          'spotbie_userDefaultImage'
        ),
      },
    };

    this.sliderRight = true;
  }

  closeMarkerOverlay(): void {
    this.sliderRight = false;
  }

  saveUserLocation(): void {
    const save_location_obj = {
      loc_x: this.lat,
      loc_y: this.lng,
    };

    if (this.isLoggedIn === '1') {
      this.locationService.saveCurrentLocation(save_location_obj).subscribe(
        resp => {
          this.saveCurrentLocationCallback(resp);
        },
        error => {
          console.log('saveAndRetrieve Error', error);
        }
      );
    } else this.retrieveSurroudings();
  }

  saveCurrentLocationCallback(resp: any): void {
    if (resp.message === 'success') this.retrieveSurroudings();
    else console.log('saveCurrentLocationCallback Error', resp);
  }

  retrieveSurroudings() {
    const retrieveSurroundingsObj = {
      loc_x: this.lat,
      loc_y: this.lng,
      search_type: this.current_search_type,
    };

    this.locationService.retrieveSurroudings(retrieveSurroundingsObj).subscribe(
      resp => {
        this.retrieveSurroudingsCallback(resp);
      },
      error => {
        console.log('saveAndRetrieve Error', error);
      }
    );
  }

  retrieveSurroudingsCallback(resp: any) {
    const surroundingObjectList = resp.surrounding_object_list;
    const totalObjects = surroundingObjectList.length;

    if (totalObjects === undefined) return;

    let i = 0;

    for (let k = 0; k < totalObjects; k++) {
      i++;

      const coords = this.getNewCoords(
        surroundingObjectList[k].loc_x,
        surroundingObjectList[k].loc_y,
        i,
        totalObjects
      );

      surroundingObjectList[k].loc_x = coords.lat;
      surroundingObjectList[k].loc_y = coords.lng;

      if (surroundingObjectList[k].ghost_mode === 1) {
        surroundingObjectList[k].default_picture =
          'assets/images/ghost_white.jpg';
        surroundingObjectList[k].username = 'User is a Ghost';
        surroundingObjectList[k].description =
          'This user is a ghost. Ghost Users are not able to be befriended and their profiles remain hidden.';
      } else
        surroundingObjectList[k].description = unescape(
          surroundingObjectList[k].description
        );

      surroundingObjectList[k].map_icon = this.mapIconPipe.transform(
        surroundingObjectList[k].default_picture
      );
    }

    this.loading = false;
    this.showMobilePrompt2 = false;
    this.createObjectMarker(surroundingObjectList);
  }

  getMapPromptMobileClass() {
    if (this.isMobile)
      return 'map-prompt-mobile align-items-center justify-content-center';
    else return 'map-prompt-mobile align-items-center';
  }

  getMapPromptMobileInnerWrapperClassOne() {
    if (this.isMobile) return 'map-prompt-v-align mt-2';
  }

  createObjectMarker(surroundingObjectList): void {
    this.surroundingObjectList = surroundingObjectList;
  }

  getNewCoords(x, y, i, f): any {
    // Gives the current position an alternate coordina
    // i is the current item
    // f is the total items

    let radius = null;

    if (this.n2_x - this.n3_x === 0) {
      radius = this.rad_1 + this.rad_11;
      this.rad_1 = radius;
      this.n2_x = 0;
      this.n3_x = this.n3_x + 7;
    } else radius = this.rad_1;

    this.n2_x = this.n2_x + 1;

    const angle = (i / this.n3_x) * Math.PI * 2;
    x = this.lat + Math.cos(angle) * radius;
    y = this.lng + Math.sin(angle) * radius;

    return {lat: x, lng: y};
  }

  closeSearchResults() {
    this.closeCategories();
    this.showSearchResults = false;
    this.displaySurroundingObjectList = true;
    this.show_search_box = false;
    this.map = false;
  }

  myFavorites(): void {
    this.myFavoritesWindow.open = true;
  }

  closeFavorites(): void {
    this.myFavoritesWindow.open = false;
  }

  promptForLocation() {
    if (this.isDesktop) {
      this.acceptLocationPrompt();
    }
  }

  openBusinessSettings() {
    this.openBusinessSettingsEvt.emit();
  }

  acceptLocationPrompt() {
    localStorage.setItem('spotbie_locationPrompted', '0');
    this.startLocation();
  }

  showMapError() {
    this.displayLocationEnablingInstructions = true;
    this.map = false;
    this.loading = false;
    this.closeCategories();
    this.cleanCategory();
  }

  mobileStartLocation(): boolean {
    this.loading = true;

    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        this.showPosition.bind(this),
        err => {
          console.log('map err', err);
          this.showMapError();
          return false;
        }
      );
    } else {
      this.showMapError();
      return false;
    }

    this.showMobilePrompt = false;
    this.showMobilePrompt2 = true;

    return true;
  }

  startLocation() {
    /*    if(this.isLoggedIn === '1' && !this.business) {
      this.spawnCategories({category: 'food'})
    }*/
  }

  signUp() {
    this.signUpEvt.emit();
  }

  ngOnInit() {
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();
    this.isMobile = this.deviceService.isMobile();

    if (this.isDesktop || this.isTablet) {
      this.rad_11 = 0.00002;
    } else {
      this.rad_11 = 0.000014;
    }

    this.rad_1 = this.rad_11;
  }

  ngAfterViewInit() {
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn');
    this.bg_color = localStorage.getItem('spotbie_backgroundColor');
    this.user_default_image = localStorage.getItem('spotbie_userDefaultImage');
    this.spotbie_username = localStorage.getItem('spotbie_userLogin');

    if (this.isLoggedIn !== '1') {
      this.user_default_image = 'assets/images/guest-spotbie-user-01.svg';
      this.spotbie_username = 'Guest';
      this.bg_color = '#353535';
    }

    this.promptForLocation();
  }
}
