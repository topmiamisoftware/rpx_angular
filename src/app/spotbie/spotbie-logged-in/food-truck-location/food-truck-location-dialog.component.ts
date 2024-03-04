import {
  AfterViewInit,
  Component,
  Inject,
  Injector,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {SpotbiePipesModule} from '../../../spotbie-pipes/spotbie-pipes.module';
import {AgmCoreModule, AgmMap, MapsAPILoader} from '@agm/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import * as map_extras from '../../map/map_extras/map_extras';
import {UserauthService} from '../../../services/userauth.service';
import {User} from '../../../models/user';
import {environment} from '../../../../environments/environment';
import GeocoderResult = google.maps.GeocoderResult;
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  faCheckCircle,
  faLocationArrow,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {HelperModule} from '../../../helpers/helper.module';

const MAX_DISTANCE = 80467;

declare const google: any;
@Component({
  selector: 'app-food-truck-location',
  templateUrl: './food-truck-location-dialog.component.html',
  styleUrls: ['./food-truck-location-dialog.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    SpotbiePipesModule,
    AgmCoreModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    FontAwesomeModule,
    HelperModule,
  ],
  standalone: true,
})
export class FoodTruckLocationDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('addressSearch') addressSearch;
  @ViewChild('spotbie_map') spotbie_map: AgmMap;

  locationFound = false;
  city: string = null;
  country: string = null;
  line1: string = null;
  line2: string = null;
  postalCode: string = null;
  state: string = null;
  originPhoto = '../../assets/images/home_imgs/find-places-to-eat.svg';
  lat: number;
  lng: number;
  zoom = 16;
  fitBounds = false;
  businessSettingsForm: UntypedFormGroup = null;
  addressResults;
  mapStyles: google.maps.MapTypeStyle[] = map_extras.MAP_STYLES;
  user: User;
  loading = false;
  businessSettingsFormUp = false;
  geoCoder: any;
  place: any;
  address: any;
  businessFormSubmitted = false;
  originTitle: string;
  faSearchLocation = faLocationArrow;
  faCheckCircle = faCheckCircle;
  locationSavedSuccessfully = false;
  locationSavedSuccessfullyMessage: string;

  constructor(
    private userService: UserauthService,
    private injector: Injector,
    private ngZone: NgZone,
    private formBuilder: UntypedFormBuilder,
    private mapsAPILoader: MapsAPILoader,
    public dialogRef: MatDialogRef<FoodTruckLocationDialogComponent>,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = this.userService.userProfile;
    this.originTitle = this.userService.userProfile.business.name;
    this.lat = this.user.business.loc_x;
    this.lng = this.user.business.loc_y;
  }

  ngAfterViewInit() {
    this.initSettingsForm();
  }

  saveLocation() {
    this.loading = true;

    const businessInfo = {
      address: this.originAddress,
      city: this.city,
      country: this.country,
      line1: this.line1,
      line2: this.line2,
      postal_code: this.postalCode,
      state: this.state,
      photo: this.originPhoto,
      loc_x: this.lat,
      loc_y: this.lng,
    };

    this.businessFormSubmitted = true;

    this.userService.saveLocation(businessInfo).subscribe(resp => {
      if (resp.success) {
        this.locationSavedSuccessfully = true;
        this.locationSavedSuccessfullyMessage = 'LOCATION UPDATED SUCCESSFULLY';
      } else {
        this.locationSavedSuccessfully = false;
        this.locationSavedSuccessfullyMessage =
          'There was a problem saving location. Try again.';
      }

      this.loading = false;
    });

    if (this.businessSettingsForm.invalid) {
      this.loading = false;
      return;
    }

    this.loading = false;
  }

  get originAddress() {
    return this.businessSettingsForm.get('originAddress').value;
  }

  get spotbieOrigin() {
    return this.businessSettingsForm.get('spotbieOrigin').value;
  }

  get i() {
    return this.businessSettingsForm.controls;
  }

  focusPlace(place) {
    this.loading = true;
    this.place = place;
    this.locationFound = false;
    this.getPlaceDetails();
  }

  getPlaceDetails() {
    const ngZone = this.injector.get(NgZone);

    const request = {
      placeId: this.place.place_id,
      fields: ['name', 'photo', 'geometry', 'adr_address', 'formatted_address'],
    };

    const map: HTMLDivElement = document.getElementById(
      'spotbieMapG'
    ) as HTMLDivElement;
    const mapService = new google.maps.places.PlacesService(map);

    mapService.getDetails(request, (place, status) => {
      ngZone.run(() => {
        this.place = place;
        this.lat = place.geometry.location.lat();
        this.lng = place.geometry.location.lng();
        this.zoom = 18;

        this.getAddress(this.lat, this.lng);

        this.businessSettingsForm
          .get('spotbieOrigin')
          .setValue(this.lat + ',' + this.lng);

        this.businessSettingsForm
          .get('originAddress')
          .setValue(place.formatted_address);

        this.locationFound = true;

        this.originPhoto =
          '../../assets/images/home_imgs/find-places-to-eat.svg';

        this.loading = false;
      });
    });
    this.addressResults = [];
  }

  getBusinessImgStyle() {
    if (this.originPhoto === null) return;

    if (this.originPhoto.includes('home_imgs')) return 'sb-originPhoto-sm';
    else return 'sb-originPhoto-lg';
  }

  searchMapsKeyDown(evt) {
    if (evt.key === 'Enter') this.searchMaps();
  }

  searchMaps() {
    const inputAddress = this.addressSearch.nativeElement;
    const service = new google.maps.places.AutocompleteService();
    const location = new google.maps.LatLng(this.lat, this.lng);

    service.getQueryPredictions(
      {
        input: inputAddress.value,
        componentRestrictions: {country: 'us'},
        radius: MAX_DISTANCE,
        location,
        types: ['establishment'],
      },
      (predictions, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        const filteredPredictions = [];

        for (const item of predictions) {
          if (item.place_id !== null && item.place_id !== undefined) {
            filteredPredictions.push(item);
          }
        }

        this.ngZone.run(() => {
          this.addressResults = filteredPredictions;
        });
      }
    );
  }

  private async initSettingsForm() {
    this.businessSettingsForm = this.formBuilder.group({
      originAddress: ['', [Validators.required]],
      spotbieOrigin: ['', [Validators.required]],
    });

    this.businessSettingsForm
      .get('originAddress')
      .setValue(this.user.business.address);

    this.businessSettingsForm
      .get('spotbieOrigin')
      .setValue(`${this.user.business.loc_x},${this.user.business.loc_y}`);

    const position = {
      coords: {
        latitude: this.user.business.loc_x,
        longitude: this.user.business.loc_y,
      },
    };

    this.showPosition(position, true);

    this.businessSettingsFormUp = true;
  }

  showPosition(position: any, override = false) {
    this.locationFound = true;

    if (environment.fakeLocation && !override) {
      this.lat = environment.myLocX;
      this.lng = environment.myLocY;
    } else {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    }
  }

  setAsCurrentLocation() {
    this.loading = true;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        if (environment.fakeLocation) {
          this.lat = environment.myLocX;
          this.lng = environment.myLocY;
        } else {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        }

        this.zoom = 18;
        this.locationFound = true;
        this.getAddress(this.lat, this.lng);
      });
    }
  }

  getAddressCompoenent(results, field) {
    for (let j = 0; j < results.address_components.length; j++) {
      for (let k = 0; k < results.address_components[j].types.length; k++) {
        if (results.address_components[j].types[k] === field) {
          return results.address_components[j].short_name;
        }
      }
    }
  }

  async getAddress(latitude, longitude) {
    await this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
    });

    await this.geoCoder.geocode(
      {location: {lat: latitude, lng: longitude}},
      (results: GeocoderResult, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 18;
            this.address = results[0].formatted_address;
            this.city = this.getAddressCompoenent(results[0], 'locality');
            this.line1 =
              results[0].address_components[0].long_name +
              ' ' +
              results[0].address_components[1].long_name;
            this.state = this.getAddressCompoenent(
              results[0],
              'administrative_area_level_1'
            );
            this.country = this.getAddressCompoenent(results[0], 'country');
            this.postalCode = this.getAddressCompoenent(
              results[0],
              'postal_code'
            );

            this.businessSettingsForm
              .get('originAddress')
              .setValue(this.address);

            this.businessSettingsForm
              .get('spotbieOrigin')
              .setValue(this.lat + ',' + this.lng);

            this.loading = false;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  close() {
    this.dialogRef.close(null);
  }

  ngOnInit(): void {}
}
