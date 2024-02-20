import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {InfoObjectServiceService} from './info-object-service.service';
import {ShareService} from '@ngx-share/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  spotbieMetaDescription,
  spotbieMetaImage,
  spotbieMetaTitle,
} from '../../../constants/spotbie';
import {InfoObject} from '../../../models/info-object';
import {Ad} from '../../../models/ad';
import {InfoObjectType} from '../../../helpers/enum/info-object-type.enum';
import {SpotbieMetaService} from '../../../services/meta/spotbie-meta.service';
import {environment} from '../../../../environments/environment';
import {setYelpRatingImage} from '../../../helpers/info-object-helper';
import {externalBrowserOpen} from '../../../helpers/cordova/web-intent';
import {DateFormatPipe, TimeFormatPipe} from '../../../pipes/date-format.pipe';
import {Business} from '../../../models/business';

const YELP_BUSINESS_DETAILS_API = 'https://api.yelp.com/v3/businesses/';

const SPOTBIE_META_DESCRIPTION = spotbieMetaDescription;
const SPOTBIE_META_TITLE = spotbieMetaTitle;
const SPOTBIE_META_IMAGE = spotbieMetaImage;

@Component({
  selector: 'app-info-object',
  templateUrl: './info-object.component.html',
  styleUrls: ['./info-object.component.css'],
})
export class InfoObjectComponent implements OnInit {
  @Input() infoObject: InfoObject;
  @Input() ad: Ad;
  @Input() fullScreenMode = false;
  @Input() lat: number = null;
  @Input() lng: number = null;
  @Input() accountType: string | number;
  @Input() eventsClassification: number = null;
  @Input() categories: number;

  @Output() closeWindow = new EventEmitter();
  @Output() removeFavoriteEvent = new EventEmitter();

  bgColor: string;
  loading: boolean;
  rewardMenuUp: boolean;
  urlApi: string;
  infoObjectImageUrl: string;
  infoObjectCategory: number;
  showFavorites = true;
  isLoggedIn: string;
  infoObjectLink: string;
  infoObjectDescription: string;
  infoObjectTitle: string;
  successful_url_copy: boolean;
  objectCategories = '';
  objectDisplayAddress: string;
  eInfoObjectType: any = InfoObjectType;
  displayAds: boolean;

  constructor(
    private infoObjectService: InfoObjectServiceService,
    // private myFavoritesService: MyFavoritesService,
    share: ShareService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spotbieMetaService: SpotbieMetaService
  ) {}

  getFullScreenModeClass() {
    if (this.fullScreenMode) return 'fullScreenMode';
    else return '';
  }

  closeWindowX(): void {
    if (
      this.router.url.indexOf('event') > -1 ||
      this.router.url.indexOf('place-to-eat') > -1 ||
      this.router.url.indexOf('shopping') > -1 ||
      this.router.url.indexOf('community') > -1
    ) {
      this.router.navigate(['/home']);
    } else {
      this.closeWindow.emit(null);
      this.spotbieMetaService.setTitle(SPOTBIE_META_TITLE);
      this.spotbieMetaService.setDescription(SPOTBIE_META_DESCRIPTION);
      this.spotbieMetaService.setImage(SPOTBIE_META_IMAGE);
    }
  }

  private pullInfoObject(): void {
    if (this.router.url.indexOf('event') > -1) {
      const infoObjectId = this.activatedRoute.snapshot.paramMap.get('id');
      this.urlApi = `id=${infoObjectId}`;
    }

    const infoObjToPull = {
      config_url: this.urlApi,
    };

    if (this.router.url.indexOf('event') > -1) {
      this.infoObjectService.pullEventObject(infoObjToPull).subscribe(resp => {
        this.getEventCallback(resp);
        this.loading = false;
      });
    } else {
      this.infoObjectService.pullInfoObject(infoObjToPull).subscribe(resp => {
        this.pullInfoObjectCallback(resp);
        this.loading = false;
      });
    }
  }

  linkCopy(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, inputElement.value.length);
    this.successful_url_copy = true;

    setTimeout(() => {
      this.successful_url_copy = false;
    }, 2500);
  }

  private pullInfoObjectCallback(httpResponse: any): void {
    if (httpResponse.success) {
      const infoObject = httpResponse.data as InfoObject;
      infoObject.type_of_info_object_category = this.infoObjectCategory;

      if (this.infoObject.is_community_member) {
        this.infoObjectImageUrl =
          'assets/images/home_imgs/spotbie-green-icon.svg';
      } else {
        this.infoObjectImageUrl =
          'assets/images/home_imgs/spotbie-white-icon.svg';
      }

      if (
        this.router.url.indexOf('place-to-eat') > -1 ||
        infoObject.type_of_info_object_category === 1
      ) {
        infoObject.type_of_info_object = InfoObjectType.Yelp;
        infoObject.type_of_info_object_category = 1;
        this.infoObjectLink = `${environment.baseUrl}place-to-eat/${infoObject.alias}/${infoObject.id}`;
      }

      if (
        this.router.url.indexOf('shopping') > -1 ||
        infoObject.type_of_info_object_category === 2
      ) {
        infoObject.type_of_info_object = InfoObjectType.Yelp;
        infoObject.type_of_info_object_category = 2;
        this.infoObjectLink = `${environment.baseUrl}shopping/${this.infoObject.alias}/${this.infoObject.id}`;
      }

      if (
        this.router.url.indexOf('events') > -1 ||
        infoObject.type_of_info_object_category === 3
      ) {
        infoObject.type_of_info_object = InfoObjectType.TicketMaster;
        infoObject.type_of_info_object_category = 3;
        this.infoObjectLink = `${environment.baseUrl}event/${this.infoObject.alias}/${this.infoObject.id}`;
      }

      if (this.infoObject.is_community_member) {
        infoObject.type_of_info_object = InfoObjectType.SpotBieCommunity;
        infoObject.image_url = this.infoObject.photo;
        this.infoObjectLink = `${environment.baseUrl}${this.infoObject.name}/${this.infoObject.id}`;
      }

      if (infoObject.hours) {
        infoObject.hours.forEach(hours => {
          if (hours.hours_type === 'REGULAR') {
            this.infoObject.isOpenNow = hours.is_open_now;
          }
        });
      }

      if (infoObject.is_community_member) {
        this.objectDisplayAddress = `${infoObject.location.display_address[0]}, ${infoObject.location.display_address[1]}`;
      } else {
        this.objectDisplayAddress = infoObject.address;
      }

      infoObject.categories.forEach(category => {
        this.objectCategories = `${this.objectCategories}, ${category.title}`;
      });

      this.objectCategories = this.objectCategories.substring(
        2,
        this.objectCategories.length
      );

      switch (this.infoObject.type_of_info_object_category) {
        case 1:
          this.infoObjectTitle = `${infoObject.name} - ${this.objectCategories} - ${this.objectDisplayAddress}`;
          this.infoObjectDescription = `Let's go eat at ${infoObject.name}. I know you'll enjoy some of these categories ${this.objectCategories}. They are located at ${this.objectDisplayAddress}.`;
          break;
        case 2:
          this.infoObjectTitle = `${this.infoObject.name} - ${this.objectCategories} - ${this.objectDisplayAddress}`;
          this.infoObjectDescription = `I really recommend you go shopping at ${infoObject.name}!`;
          break;
      }

      infoObject.rating_image = setYelpRatingImage(infoObject.rating);

      this.spotbieMetaService.setTitle(this.infoObjectTitle);
      this.spotbieMetaService.setDescription(this.infoObjectDescription);
      this.spotbieMetaService.setImage(this.infoObjectImageUrl);

      this.infoObject = infoObject;
      this.loading = false;
    } else {
      console.log('pullInfoObjectCallback', httpResponse);
    }
  }

  openWithGoogleMaps(): void {
    const confirmNav = confirm(
      "We will try to open and navigate on your device's default navigation app."
    );

    let displayAddress = '';

    this.infoObject.location.display_address.forEach(element => {
      displayAddress = displayAddress + ' ' + element;
    });

    if (confirmNav) {
      externalBrowserOpen(`http://www.google.com/maps/place/${displayAddress}`);
    }
  }

  goToTicket(): void {
    externalBrowserOpen(this.infoObject.url);
  }

  getTitleStyling() {
    if (this.infoObject.is_community_member) {
      return 'spotbie-text-gradient sb-titleGreen text-uppercase';
    } else {
      return 'sb-titleGrey text-uppercase';
    }
  }

  getCloseButtonStyling() {
    if (!this.infoObject.is_community_member) return {color: '#332f3e'};
    else return {color: 'white'};
  }

  getOverlayWindowStyling() {
    if (this.infoObject.is_community_member) {
      return 'spotbie-overlay-window communityMemberWindow';
    } else {
      return 'spotbie-overlay-window infoObjectWindow';
    }
  }

  getFontClasses() {
    if (this.infoObject.is_community_member) {
      return 'spotbie-text-gradient text-uppercase';
    } else {
      return 'text-uppercase';
    }
  }

  getIconTheme() {
    if (this.infoObject.is_community_member) {
      return 'material-dark';
    } else {
      return 'material-light';
    }
  }

  getEventCallback(httpResponse: any): void {
    if (httpResponse.success) {
      if (httpResponse.data._embedded.events[0] === undefined) {
        this.loading = false;
        return;
      }

      const event_object = httpResponse.data._embedded.events[0];

      event_object.coordinates = {
        latitude: '',
        longitude: '',
      };

      event_object.coordinates.latitude = parseFloat(
        event_object._embedded.venues[0].location.latitude
      );
      event_object.coordinates.longitude = parseFloat(
        event_object._embedded.venues[0].location.longitude
      );
      event_object.icon = event_object.images[0].url;
      event_object.image_url = event_object.images[8].url;
      event_object.type_of_info_object = 'ticketmaster_event';

      const dt_obj = new Date(event_object.dates.start.localDate);
      const time_date = new DateFormatPipe().transform(dt_obj);
      const time_hr = new TimeFormatPipe().transform(
        event_object.dates.start.localTime
      );

      event_object.dates.start.spotbieDate = time_date;
      event_object.dates.start.spotbieHour = time_hr;

      this.infoObject = event_object;

      this.setEventMetaData();
    } else {
      console.log('getEventsSearchCallback Error: ', httpResponse);
    }

    this.loading = false;
  }

  setEventMetaData() {
    const alias = this.infoObject.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[-]+/g, '-')
      .replace(/[^\w-]+/g, '');
    const title = `${this.infoObject.name} at ${this.infoObject._embedded.venues[0].name}`;

    if (this.infoObject.is_community_member) {
      this.infoObjectImageUrl = `${environment.baseUrl}${this.infoObject.type_of_info_object_category}/${this.infoObject.id}`;
    } else {
      this.infoObjectLink = `${environment.baseUrl}event/${alias}/${this.infoObject.id}`;
    }

    this.infoObjectDescription = `Hey! Let's go to ${this.infoObject.name} together. It's at ${this.infoObject._embedded.venues[0].name} located in ${this.infoObject._embedded.venues[0].address.line1}, ${this.infoObject._embedded.venues[0].city.name} ${this.infoObject._embedded.venues[0].postalCode}. Prices range from $${this.infoObject.priceRanges[0].min} to $${this.infoObject.priceRanges[0].min}`;
    this.infoObjectTitle = title;

    this.spotbieMetaService.setTitle(title);
    this.spotbieMetaService.setDescription(this.infoObjectDescription);
    this.spotbieMetaService.setImage(this.infoObject.image_url);
  }

  visitInfoObjectPage() {
    if (this.infoObject.type_of_info_object === InfoObjectType.Yelp)
      externalBrowserOpen(`${this.infoObject.url}`);
    else if (
      this.infoObject.type_of_info_object === InfoObjectType.TicketMaster
    )
      this.goToTicket();
  }

  getInputClass() {
    if (this.infoObject.is_community_member) return 'sb-infoObjectInputLight';
    else return 'sb-infoObjectInputDark';
  }

  clickGoToSponsored() {
    window.open('/business', '_blank');
  }

  ngOnInit() {
    this.bgColor = localStorage.getItem('spotbie_backgroundColor');
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn');

    if (this.infoObject) {
      this.infoObjectCategory = this.infoObject.type_of_info_object_category;

      switch (this.infoObject.type_of_info_object) {
        case InfoObjectType.Yelp:
          this.urlApi = YELP_BUSINESS_DETAILS_API + this.infoObject.id;
          break;
        case InfoObjectType.TicketMaster:
          this.loading = false;
          return;
        case InfoObjectType.SpotBieCommunity:
          this.rewardMenuUp = true;

          if (this.infoObject.user_type === 1) {
            this.infoObjectLink =
              environment.baseUrl + 'community/' + this.infoObject.qr_code_link;
          } else if (this.infoObject.user_type === 2) {
            this.infoObjectLink =
              environment.baseUrl + 'community/' + this.infoObject.qr_code_link;
          } else if (this.infoObject.user_type === 3) {
            this.infoObjectLink =
              environment.baseUrl + 'community/' + this.infoObject.qr_code_link;
          }

          return;
      }
    } else {
      if (
        this.router.url.indexOf('shopping') > -1 ||
        this.router.url.indexOf('place-to-eat') > -1 ||
        this.router.url.indexOf('events') > -1
      ) {
        const infoObjectId = this.activatedRoute.snapshot.paramMap.get('id');
        this.urlApi = YELP_BUSINESS_DETAILS_API + infoObjectId;
      }
    }
    this.pullInfoObject();
  }
}
