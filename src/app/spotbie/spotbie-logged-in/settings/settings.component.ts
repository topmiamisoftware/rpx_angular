import { Component, OnInit, ViewChild, NgZone } from '@angular/core'
import { HttpResponse } from '../../../models/http-reponse'
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import * as spotbieGlobals from '../../../globals'
import { HttpHeaders, HttpClient } from '@angular/common/http'
import { User } from '../../../models/user'
import { MapsAPILoader, MouseEvent } from '@agm/core'
import { ValidatePassword } from '../../../helpers/password.validator'
import { MustMatch } from '../../../helpers/must-match.validator'
import { MenuLoggedInComponent } from '../menu-logged-in.component'
import { ValidateUsername } from 'src/app/helpers/username.validator'
import { ValidatePersonName } from 'src/app/helpers/name.validator'
import { UserauthService } from 'src/app/services/userauth.service'

const SETTINGS_API = spotbieGlobals.API + '/settings.service.php'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  @ViewChild('spotbieSettingsInfoText') spotbieSettingsInfoText
  @ViewChild('spotbie_password_change_info_text') spotbiePasswordInfoText
  @ViewChild('current_password_info') spotbieCurrentPasswordInfoText

  @ViewChild('spotbie_deactivation_info') spotbieAccountDeactivationInfo

  @ViewChild('addressSearch') addressSearch

  public bg_color: string

  public lat: number
  public lng: number
  public zoom: number = 18
  public iconUrl: string

  public locationFound = false

  public personal_account = true
  public ghost_light_color = 'green'
  public privacy_light_color = 'green'
  public privacy_state = 'ON'
  public ghost_mode_state = 'ON'
  public privacy_help = { help_text: 'Setting your privacy to OFF will allow users who ARE NOT your friends to view your profile (includes posts, albums, and contact info). Setting your privacy to ON will only allow users who are your friends to view your profile. If your privacy mode is set to ON, users who are not your friends will be able to send your friend requests and view partial profile info(includes most recent profile picture, username, and your full name.)'}
  public ghost_mode_help = { help_text: 'Setting Ghost Mode to OFF will allow users who ARE NOT your friends to spot on you the Spotbie Map as yourself. If you set Ghost Mode to ON, users who are NOT your friends will identify you on the map as GHOST, while users who ARE your friends will identify you as yourself.'}

  public settings_form: FormGroup

  public password_form: FormGroup

  public save_password = false

  public deactivation_form: FormGroup
  public account_deactivation = false
  public deactivation_submitted = false

  public loading = false

  public animal_list = new Array(
    { animal_name: 'Alligator', animal_img: '../../assets/images/animals/alligator.png'},
    { animal_name: 'Bunny', animal_img: '../../assets/images/animals/bunny.png'},
    { animal_name: 'Cat', animal_img: '../../assets/images/animals/cat.png'},
    { animal_name: 'Cheetah', animal_img: '../../assets/images/animals/cheetah.png'},
    { animal_name: 'Dragon', animal_img: '../../assets/images/animals/dragon.png'},
    { animal_name: 'Elephant', animal_img: '../../assets/images/animals/elephant.png'},
    { animal_name: 'Fox', animal_img: '../../assets/images/animals/fox.png'},
    { animal_name: 'Giraffe', animal_img: '../../assets/images/animals/giraffe.png'},
    { animal_name: 'Honey Bee', animal_img: '../../assets/images/animals/honey_bee.png'},
    { animal_name: 'Iguana', animal_img: '../../assets/images/animals/iguana.png'},
    { animal_name: 'Jaguar', animal_img: '../../assets/images/animals/jaguar.png'},
    { animal_name: 'Koala', animal_img: '../../assets/images/animals/koala.png'},
    { animal_name: 'Lion', animal_img: '../../assets/images/animals/lion.png'},
    { animal_name: 'Manta Ray', animal_img: '../../assets/images/animals/manta_ray.png'},
    { animal_name: 'Nighthawk', animal_img: '../../assets/images/animals/nighthawk.png'},
    { animal_name: 'Ostrich', animal_img: '../../assets/images/animals/ostrich.png'},
    { animal_name: 'Panda', animal_img: '../../assets/images/animals/panda.png'},
    { animal_name: 'Parrot', animal_img: '../../assets/images/animals/parrot.png'},
    { animal_name: 'Phoenix', animal_img: '../../assets/images/animals/phoenix.png'},
    { animal_name: 'Poison Dart Frog', animal_img: '../../assets/images/animals/poison_dart_frog.png'},
    { animal_name: 'Quagga', animal_img: '../../assets/images/animals/quagga.png'},
    { animal_name: 'Raven', animal_img: '../../assets/images/animals/raven.png'},
    { animal_name: 'Rhino', animal_img: '../../assets/images/animals/rhino.png'},
    { animal_name: 'Sea Turtle', animal_img: '../../assets/images/animals/sea_turtle.png'},
    { animal_name: 'Sloth', animal_img: '../../assets/images/animals/sloth.png'},
    { animal_name: 'Tiger', animal_img: '../../assets/images/animals/tiger.png'},
    { animal_name: 'Uakari', animal_img: '../../assets/images/animals/uakari.png'},
    { animal_name: 'Vampire Bat', animal_img: '../../assets/images/animals/vampire_bat.png'},
    { animal_name: 'Weasel', animal_img: '../../assets/images/animals/weasel.png'},
    { animal_name: 'Whale Shark', animal_img: '../../assets/images/animals/whale_shark.png'},
    { animal_name: 'Xerus', animal_img: '../../assets/images/animals/xerus.png'},
    { animal_name: 'Yak', animal_img: '../../assets/images/animals/yak.png'},
    { animal_name: 'Zebra Shark', animal_img: '../../assets/images/animals/zebra_shark.png'}
  )

  public chosen_animal: any
  public load_animals = false

  private exe_api_key: string

  public account_type_list = ['Personal', 'Content Creator']
  public chosen_account_type: string
  public load_account_types = false

  public account_type_category: string

  public help_text = ''

  public user: User

  public submitted = false

  public adSettingsWindow = {open: false}

  public geoCoder: any
  public address: any
  public address_results: google.maps.places.QueryAutocompletePrediction[]
  public password_submitted: boolean = false

  constructor(private host: MenuLoggedInComponent,
              private http: HttpClient,
              private formBuilder: FormBuilder,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private userAuthService: UserauthService) { }

  private fetchCurrentSettings(): any {

    this.userAuthService.getSettings().subscribe(
      resp =>{
        this.populateSettings(resp)
      },
      error =>{
        console.log("Error", error)
      }
    )

  }

  private populateSettings(settings_response: any) {

    if (settings_response.message == 'success') {

      this.user = settings_response.user
      this.user.spotbie_user = settings_response.spotbie_user

      this.settings_form.get('spotbie_username').setValue(this.user.username)
      this.settings_form.get('spotbie_first_name').setValue(this.user.spotbie_user.first_name)
      this.settings_form.get('spotbie_last_name').setValue(this.user.spotbie_user.last_name)
      this.settings_form.get('spotbie_email').setValue(this.user.email)
      this.settings_form.get('spotbie_phone_number').setValue(this.user.spotbie_user.phone_number)
      //this.settings_form.get('spotbie_acc_type').setValue(this.user.exe_user_type)

      this.password_form.get('spotbie_password').setValue('userpassword')
      this.password_form.get('spotbie_confirm_password').setValue('123456789')

      //this.chosen_account_type = this.user.exe_user_type

      this.account_type_category = 'Personal'
      this.settings_form.get('spotbie_animal').setValue(this.user.spotbie_user.animal)
      this.settings_form.get('spotbie_privacy').setValue(this.user.spotbie_user.privacy)
      this.settings_form.get('spotbie_ghost_mode').setValue(this.user.spotbie_user.ghost_mode)

      if (this.user.spotbie_user.privacy == true) {
        this.privacy_state = 'ON'
        this.privacy_light_color = 'green'
      } else {
        this.privacy_state = 'OFF'
        this.privacy_light_color = 'red'
      }

      if (this.user.spotbie_user.ghost_mode == true) {
        this.ghost_mode_state = 'ON'
        this.ghost_light_color = 'green'
      } else {
        this.ghost_mode_state = 'OFF'
        this.ghost_light_color = 'red'
      }

      /*if (this.chosen_account_type == 'Personal' || this.chosen_account_type == 'Content Creator') {


      } else {

        this.user.spotbie_origin = settings_response.responseObject.place_attributes.place_coords
        this.user.spotbie_origin_description = settings_response.responseObject.place_attributes.place_description
        this.user.spotbie_place_address = settings_response.responseObject.place_attributes.place_address

        this.account_type_category = 'Business'
        this.initSettingsForm('business')

      }*/

    } else
      console.log('Settings Error: ', settings_response)

    this.loading = false

  }

  openWindow(window: any){
    window.open = true
  }

  searchMaps() {
    //console.log('searching')
    // this function will search for an address
    const inputAddress = this.addressSearch.nativeElement

    const service = new google.maps.places.AutocompleteService()

    const _this = this

    service.getQueryPredictions({ input: inputAddress.value }, function(predictions, status) {

      if (status != google.maps.places.PlacesServiceStatus.OK) {
        return
      }

      _this.ngZone.run(() => { // <== added
        _this.address_results = predictions
      })

    })
  }

  focusPlace(place) {

    // console.log("Prediction", place)
    this.geoCoder.geocode({placeId: place.place_id}, function(results, status) {

      if (status !== 'OK') {
        return
      }

      this.ngZone.run(() => { // <== added
        this.locationFound = false
        this.lat = +results[0].geometry.location.lat()
        this.lng = +results[0].geometry.location.lng()
        this.settings_form.get('spotbie_origin').setValue(this.lat + ',' + this.lng)
        this.locationFound = true
      }).bind(this)

      // console.log("Lat and lng " + _this.lat + "," + _this.lng )
      // console.log(results[0].geometry.location.lat)

      // Set the position of the marker using the place ID and location.
      // this.place = {placeId: place.place_id, location: results[0].geometry.location}

    })

  }

  mapsAutocomplete() {

    this.mapsAPILoader.load().then(() => {

      this.geoCoder = new google.maps.Geocoder

      const inputAddress = this.addressSearch.nativeElement

      const autocomplete = new google.maps.places.Autocomplete(inputAddress, {
        types: ['address']
      })

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace()

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return
          }

          // set latitude, longitude and zoom
          this.lat = place.geometry.location.lat()
          this.lng = place.geometry.location.lng()
          this.zoom = 18

        })
      })

    })

  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude
        this.lng = position.coords.longitude
        this.zoom = 18
        this.getAddress(this.lat, this.lng)
      })
    }
  }

  markerDragEnd($event: MouseEvent) {
    console.log($event)
    this.lat = $event.coords.lat
    this.lng = $event.coords.lng
    this.getAddress(this.lat, this.lng)
  }

  getAddress(latitude, longitude) {

    this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {

      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 18
          this.address = results[0].formatted_address
          this.settings_form.get('spotbie_place_address').setValue(this.address)
          this.settings_form.get('spotbie_origin').setValue(this.lat + ',' + this.lng)
        } else {
          window.alert('No results found')
        }
      } else {
        window.alert('Geocoder failed due to: ' + status)
      }

    })

  }

  showPosition(lat, lng) {

    this.locationFound = true
    this.lat = lat
    this.lng = lng

  }

  public savePassword(): void {

    if (this.password_form.invalid) {
      this.spotbiePasswordInfoText.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    if (this.password !== this.confirm_password) {
      this.spotbiePasswordInfoText.nativeElement.innerHTML = 'Passwords must match.'
      return
    }

    this.spotbiePasswordInfoText.nativeElement.innerHTML = 'Great, your passwords match!'

    this.save_password = true

    const current_password_validators = [Validators.required]

    this.password_form.addControl('spotbie_current_password', new FormControl('', current_password_validators))

    this.password_form.get('spotbie_current_password').setValue('123456789')

  }

  public completeSavePassword(): void {

    if(this.loading) return
    
    this.loading = true

    if (this.password_form.invalid) return

    const savePasswordObj = {
      password: this.password,
      passwordConfirmation: this.confirm_password,
      currentPassword: this.current_password
    }

    this.userAuthService.passwordChange(savePasswordObj).subscribe( 
      resp => {
        this.passwordChangeCallback(resp)
      },
      error => {
        console.log('error', error)
      }
    )

  }

  private passwordChangeCallback(resp: any) {

    console.log("passwordChangeCallback", resp)

    if (resp.success) {

      switch (resp.message) {

        case 'saved':

          this.spotbieCurrentPasswordInfoText.nativeElement.innerHTML = 'Your password was updated.'

          this.password_form.get('spotbie_current_password').setValue('123456789')
          this.password_form.get('spotbie_password').setValue('asdrqweee')
          this.password_form.get('spotbie_confirm_password').setValue('asdeqweqq')
          
          this.spotbiePasswordInfoText.nativeElement.innerHTML = 'Would you like to change your password?'

          setTimeout(function() {
            this.password_submitted = false
            this.save_password = false
          }.bind(this), 2000)

          break

        case 'SB-E-000':
          // server error
          this.save_password = false
          this.password_submitted = false
          this.spotbiePasswordInfoText.nativeElement.innerHTML = 'There was an error with the server. Try again.'
          break
          
      }

      this.spotbieSettingsInfoText.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })

    } else
      console.log(resp)

    this.loading = false

  }

  public cancelPasswordSet() {
    this.password_submitted = false
    this.save_password = false
  }

  public changeAnimal() {
    this.load_animals = true
  }

  public selectAnimal(animal) {
    this.chosen_animal = animal
    this.settings_form.get('spotbie_animal').setValue(animal.animal_name)
    this.load_animals = false
  }

  public changeAccType() {
    this.load_account_types = true
  }

  public selectAccountType(account_type: string) {

    this.settings_form.get('spotbie_acc_type').setValue(account_type)
    this.chosen_account_type = account_type

    this.user.exe_user_type = 'Content Creator'

    /*if (this.chosen_account_type == 'Personal' || this.chosen_account_type == 'Content Creator') {
      this.initSettingsForm('basic')
    } else {
      this.initSettingsForm('business')
    }*/

    this.load_account_types = false

  }

  private initSettingsForm(action: string) {

    // will set validators for form and take care of animations
    const username_validators = [Validators.required, Validators.maxLength(15)]
    const first_name_validators = [Validators.required, Validators.maxLength(72)]
    const last_name_validators = [Validators.required, Validators.maxLength(72)]
    const email_validators = [Validators.email, Validators.required, Validators.maxLength(135)]
    const phone_validators = [Validators.required]

    const password_validators = [Validators.required]
    const password_confirm_validators = [Validators.required]

    switch (action) {

      case 'basic':

        this.settings_form = this.formBuilder.group({
          spotbie_username: ['', username_validators],
          spotbie_first_name: ['', first_name_validators],
          spotbie_last_name: ['', last_name_validators],
          spotbie_email: ['', email_validators],
          spotbie_phone_number: ['', phone_validators],
          spotbie_acc_type: [],
          spotbie_animal: [],
          spotbie_ghost_mode: [],
          spotbie_privacy: []
        }, {
          validators: [ValidateUsername('spotbie_username'),
                    ValidatePersonName('spotbie_first_name'),
                    ValidatePersonName('spotbie_last_name')]
        })

        this.password_form = this.formBuilder.group({
          spotbie_password: ['', password_validators],
          spotbie_confirm_password: ['', password_confirm_validators]
        }, {
          validators: [ValidatePassword('spotbie_password'),
                    MustMatch('spotbie_password', 'spotbie_confirm_password')]
        })

        this.fetchCurrentSettings()

        break

      case 'personal':

        this.settings_form.get('spotbie_animal').setValue(this.user.exe_animal)
        this.account_type_category = 'Personal'
        this.settings_form.get('spotbie_privacy').setValue(this.user.privacy)
        this.settings_form.get('spotbie_ghost_mode').setValue(this.user.ghost)

        break

      case 'business':

        const spotbie_place_address_validators = [Validators.required]
        const spotbie_origin_validators = [Validators.required]
        const spotbie_origin_description_validators = [Validators.required]

        this.settings_form.addControl('spotbie_place_address', new FormControl('', spotbie_place_address_validators))

        if (this.user.spotbie_place_address != null) {
          this.settings_form.get('spotbie_place_address').setValue(this.user.spotbie_place_address)
        } else {
          this.settings_form.get('spotbie_place_address').setValue('search for location')
        }

        this.settings_form.addControl('spotbie_origin', new FormControl('', spotbie_origin_validators))

        if (this.user.spotbie_origin != null) {
          this.settings_form.get('spotbie_origin').setValue(this.user.spotbie_origin)
          const coords = this.user.spotbie_origin.split(',')
          const lat = +coords[0]
          const lng = +coords[1]
          this.showPosition(lat, lng)
        } else {
          this.settings_form.get('spotbie_origin').setValue( this.lat + ',' + this.lng)
        }


        this.settings_form.addControl('spotbie_origin_description', new FormControl('', spotbie_origin_description_validators))

        if (this.user.spotbie_origin_description != null) {
          this.settings_form.get('spotbie_origin_description').setValue(this.user.spotbie_origin_description)
        } else {
          this.settings_form.get('spotbie_origin_description').setValue('Enter your ' + this.chosen_account_type +  ' description.')
        }

        this.account_type_category = 'Business'

        setTimeout(function() {
          this.mapsAutocomplete() 
        }.bind(this))

        break
    }
  }

  get username() { return this.settings_form.get('spotbie_username').value }
  get first_name() { return this.settings_form.get('spotbie_first_name').value }
  get last_name() { return this.settings_form.get('spotbie_last_name').value }
  get email() { return this.settings_form.get('spotbie_email').value }
  get spotbie_phone_number() { return this.settings_form.get('spotbie_phone_number').value }
  //get account_type() { return this.settings_form.get('spotbie_acc_type').value }
  get animal() { return this.settings_form.get('spotbie_animal').value }
  get spotbie_place_address() {return this.settings_form.get('spotbie_place_address').value }
  get spotbie_origin() { return this.settings_form.get('spotbie_origin').value }
  get spotbie_origin_description() { return this.settings_form.get('spotbie_origin_description').value }
  get spotbie_ghost_mode() {return this.settings_form.get('spotbie_ghost_mode').value }
  get spotbie_privacy() {return this.settings_form.get('spotbie_privacy').value }
  get f() { return this.settings_form.controls }

  get password() { return this.password_form.get('spotbie_password').value }
  get confirm_password() { return this.password_form.get('spotbie_confirm_password').value }
  get current_password() { return this.password_form.get('spotbie_current_password').value }
  get g() { return this.password_form.controls }

  get deactivation_password() { return this.deactivation_form.get('spotbie_deactivation_password').value }
  get h() { return this.deactivation_form.controls }

  public saveSettings() {

    this.loading = true
    this.submitted = true

    if (this.settings_form.invalid) {

      console.log("", this.settings_form)

      this.loading = false
      this.spotbieSettingsInfoText.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      
      return

    }

    this.user.username = this.username
    this.user.exe_user_first_name = this.first_name
    this.user.exe_user_last_name = this.last_name
    this.user.email = this.email
    //this.user.exe_user_type = this.account_type
    this.user.ph = this.spotbie_phone_number;

    if (this.account_type_category == 'Business') {
      this.user.spotbie_place_address = this.spotbie_place_address
      this.user.spotbie_origin = this.spotbie_origin
      this.user.spotbie_origin_description = this.spotbie_origin_description
    } else {
      this.user.exe_animal = this.animal
      this.user.ghost = this.spotbie_ghost_mode
      this.user.privacy = this.spotbie_privacy
    }

    this.userAuthService.saveSettings(this.user).subscribe( 
      resp => {
        this.saveSettingsCallback(resp)
      }
    )
  }

  private saveSettingsCallback(resp: any) {
    
    this.loading = false

    if (resp.success) {

      this.spotbieSettingsInfoText.nativeElement.innerHTML = 'Your settings were saved.'
        
      this.spotbieSettingsInfoText.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })

    } else
      console.log('Failed Save Settings: ', resp)

  }

  public cancelDeactivateAccount() {
    this.account_deactivation = false
  }

  public startDeactivateAccount(): void {

    this.account_deactivation = true

    const deactivation_password_validator = [Validators.required]

    this.deactivation_form = this.formBuilder.group({
      spotbie_deactivation_password: ['', deactivation_password_validator]
    })

    this.deactivation_form.get('spotbie_deactivation_password').setValue('123456789')

  }

  public deactivateAccount() {

    if(this.loading) return

    this.loading = true

    if (this.deactivation_form.invalid) {
      this.spotbieAccountDeactivationInfo.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    this.userAuthService.deactivateAccount( this.deactivation_password).subscribe(
      resp => {
        this.deactivateCallback(resp)
      }
    )

  }

  private deactivateCallback(resp: any) {

    this.loading = false

    if (resp.success) {

      switch (resp.message) {
        case 'saved':

          // account deactivation complete
          setTimeout(function() {

            this.spotbieAccountDeactivationInfo.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
            this.spotbieAccountDeactivationInfo.nativeElement.innerHTML = 'Your account was deativated. You can re-activate your account by loggin-in again. While deactivated your account is non-accessible to any of our users.'
            this.host.logOut()

          }.bind(this), 1500)

          break

        case 'SB-E-000':
          // Server error
          this.deactivation_submitted = false
          this.spotbieAccountDeactivationInfo.nativeElement.innerHTML = 'Deactivation failed. Server Error, please try again.'
          break

      }
      
    } else 
      console.log('deactivateCallback', resp)
    
  }

  public toggleGhostMode() {
    let ghost_mode: number
    if (this.spotbie_ghost_mode == 1) {
      this.ghost_mode_state = 'OFF'
      ghost_mode = 0
    } else {
      this.ghost_mode_state = 'ON'
      ghost_mode = 1
    }
    this.settings_form.get('spotbie_ghost_mode').setValue(ghost_mode)
  }

  public togglePrivacy() {
    let spotbie_privacy: number
    if (this.spotbie_privacy == 1) {
      this.privacy_state = 'OFF'
      spotbie_privacy = 0
    } else {
      this.privacy_state = 'ON'
      spotbie_privacy = 1
    }
    this.settings_form.get('spotbie_privacy').setValue(spotbie_privacy)
  }

  public toggleHelp(help_object) {
    this.help_text = help_object.help_text
  }

  public getLight(light_name: any) {
    if (light_name == 1) { return {'background-color': 'green'} } else { return {'background-color': 'red'} }
  }

  public closeWindow() {
    this.host.settingsWindow.open = false
  }

  public closeAnimals(){
    this.load_animals = false
  }

  ngOnInit() {
    this.loading = true
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
    this.bg_color = localStorage.getItem('spotbie_backgroundColor')
    this.initSettingsForm('basic')
  }

}
