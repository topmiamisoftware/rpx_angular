import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { Component, OnInit, ViewChild, NgZone, ElementRef, Output, EventEmitter } from '@angular/core'
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import * as spotbieGlobals from '../../../globals'
import { User } from '../../../models/user'
import { AgmMap, MapsAPILoader, MouseEvent } from '@agm/core'
import { ValidatePassword } from '../../../helpers/password.validator'
import { MustMatch } from '../../../helpers/must-match.validator'
import { ValidateUsername } from 'src/app/helpers/username.validator'
import { ValidatePersonName } from 'src/app/helpers/name.validator'
import { UserauthService } from 'src/app/services/userauth.service'

import * as calendly from '../../../helpers/calendly/calendlyHelper'
import * as map_extras from 'src/app/spotbie/map/map_extras/map_extras'

import { Business } from 'src/app/models/business'
import { HttpClient, HttpEventType } from '@angular/common/http'
import { MatChipInputEvent } from '@angular/material/chips'
import { map, startWith } from 'rxjs/operators'

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs/internal/Observable';
import { LocationService } from 'src/app/services/location-service/location.service';

const PLACE_TO_EAT_API = spotbieGlobals.API + 'place-to-eat'

const PLACE_TO_EAT_MEDIA_MAX_UPLOAD_SIZE = 25e+6

const MAX_DISTANCE = 80467

declare const google: any

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    @ViewChild('spotbieSettingsInfoText') spotbieSettingsInfoText: ElementRef

    @ViewChild('spotbie_password_change_info_text') spotbiePasswordInfoText: ElementRef
    @ViewChild('current_password_info') spotbieCurrentPasswordInfoText: ElementRef

    @ViewChild('spotbie_deactivation_info') spotbieAccountDeactivationInfo

    @ViewChild('addressSearch') addressSearch

    @ViewChild('userAccountTypeNormalScroll') userAccountTypeNormalScroll

    @ViewChild('spotbie_map') spotbie_map: AgmMap

    @ViewChild('spotbieSettingsWindow') spotbieSettingsWindow

    @ViewChild('placeToEatMediaUploadInfo') placeToEatMediaUploadInfo
    @ViewChild('placeToEatMediaInput') placeToEatMediaInput
    
    @Output('closeWindowEvt') closeWindowEvt = new EventEmitter()

    public bg_color: string

    public lat: number
    public lng: number
    public zoom: number = 12
    public fitBounds: boolean = false
    public iconUrl: string

    public locationFound = false

    public personal_account = true

    public settingsForm: FormGroup
    public businessSettingsForm: FormGroup

    public originPhoto: string = '../../assets/images/home_imgs/find-places-to-eat.svg'

    public password_form: FormGroup

    public save_password = false

    public deactivation_form: FormGroup
    public account_deactivation = false
    public deactivation_submitted = false

    public loading = false

    public accountTypePhotos = [
        '../../assets/images/home_imgs/find-users.svg',
        '../../assets/images/home_imgs/find-places-to-eat.svg',
        '../../assets/images/home_imgs/find-events.svg',
        '../../assets/images/home_imgs/find-places-for-shopping.svg'
    ]

    public accountTypeList = ['PLACE TO EAT', 'EVENTS', 'RETAIL STORE']
    public chosen_account_type: number
    public loadAccountTypes = false

    public account_type_category: string
    public account_type_category_friendly_name: string

    public help_text = ''

    public user: User
    
    public submitted: boolean = false
    public placeFormSubmitted: boolean = false

    public adSettingsWindow = {open: false}

    public geoCoder: any
    public address: any
    public address_results: any
    public password_submitted: boolean = false
    
    public settingsFormInitiated: boolean = false
    
    public map_styles = map_extras.MAP_STYLES

    public locationPrompt: boolean = true
    public showNoResultsBox: boolean = false
    public showMobilePrompt: boolean = false
    public showMobilePrompt2: boolean = false

    public placeSettingsFormUp: boolean = false

    public place: any 

    public claimBusiness: boolean = false

    public passKeyVerificationFormUp: boolean = false
    public passKeyVerificationForm: FormGroup
    public passKeyVerificationSubmitted: boolean = false

    public businessVerified: boolean = false

    public placeToEatMediaMessage: string
    public placeToEatMediaUploadProgress: number = 0

    public customPatterns = { 
                                '0': { pattern: new RegExp('\[0-9\]')},
                                'A': { pattern: new RegExp('\[A-Z\]')}
                            }
        
    public calendlyUp: boolean = false
    
    public businessCategoryList: Array<string> = []

    public selectable = true
    public removable = true
    public separatorKeysCodes: number[] = [ENTER, COMMA]

    public filteredBusinessCategories: Observable<string[]>

    public activeBusinessCategories: string[] = []

    @ViewChild('businessInput') businessInput: ElementRef<HTMLInputElement>;

    constructor(private http: HttpClient,
                private formBuilder: FormBuilder,
                private mapsAPILoader: MapsAPILoader,
                private ngZone: NgZone,
                private userAuthService: UserauthService,
                private locationService: LocationService){ }

    add(event: MatChipInputEvent): void {

        const value = (event.value || '').trim()

        // Add our category 

        if (value) this.activeBusinessCategories.push(value)

        this.businessSettingsForm.get('originCategories').setValue(null)

    }

    remove(category: string): void {

        const index = this.activeBusinessCategories.indexOf(category)

        if (index >= 0) this.activeBusinessCategories.splice(index, 1)
        
        this.businessSettingsForm.get('originCategories').setValue(null)

    }

    selected(event: MatAutocompleteSelectedEvent): void {

        if(this.activeBusinessCategories.indexOf(event.option.viewValue) > -1) return

        this.activeBusinessCategories.push(event.option.viewValue)
        this.businessInput.nativeElement.value = ''

        this.businessSettingsForm.get('originCategories').setValue( null )

    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase()
        return this.activeBusinessCategories.filter(category => category.toLowerCase().includes(filterValue))
    }

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

    public cancelPlaceSettings(){
        this.placeSettingsFormUp = false
    }

    private populateSettings(settings_response: any) {

        if (settings_response.message == 'success') {
            
            this.user = settings_response.user
            this.user.spotbie_user = settings_response.spotbie_user

            if(this.user.spotbie_user.user_type == 0 && !this.settingsFormInitiated){
                //User type has not been set, so we must prompt the user for it.
                this.loadAccountTypes = true        
            }

            if(!this.settingsFormInitiated){

                this.chosen_account_type = this.user.spotbie_user.user_type
                    
                switch(this.chosen_account_type){
                case 1:  
                    this.account_type_category = 'PLACE TO EAT'
                    this.account_type_category_friendly_name = 'PLACE TO EAT'         
                    break
                case 2:
                    this.account_type_category = 'EVENTS'
                    this.account_type_category_friendly_name = 'EVENTS BUSINESS'  
                    break
                case 3:
                    this.account_type_category = 'RETAIL STORE' 
                    this.account_type_category_friendly_name = 'RETAIL STORE'  
                    break
                case 4:
                case 0:
                    this.account_type_category = 'PERSONAL'
                    this.account_type_category_friendly_name = 'PERSONAL' 
                    break
                }

            }

            this.settingsFormInitiated = true 

            this.settingsForm.get('spotbie_username').setValue(this.user.username)
            this.settingsForm.get('spotbie_first_name').setValue(this.user.spotbie_user.first_name)
            this.settingsForm.get('spotbie_last_name').setValue(this.user.spotbie_user.last_name)
            this.settingsForm.get('spotbie_email').setValue(this.user.email)
            this.settingsForm.get('spotbie_phone_number').setValue(this.user.spotbie_user.phone_number)
            this.settingsForm.get('spotbie_acc_type').setValue(this.account_type_category)
            
            this.password_form.get('spotbie_password').setValue('userpassword')
            this.password_form.get('spotbie_confirm_password').setValue('123456789')

            console.log("chosen_account_type", this.chosen_account_type)

            if ( (this.chosen_account_type == 1 || 
                  this.chosen_account_type == 2 || 
                  this.chosen_account_type == 3 )
                  && settings_response.business !== null
            ){

                this.user.business = new Business()
                
                this.user.business.loc_x = settings_response.business.loc_x
                this.user.business.loc_y = settings_response.business.loc_y
                this.user.business.name = settings_response.business.name
                this.user.business.description = settings_response.business.description
                this.user.business.address = settings_response.business.address
                this.user.business.photo = settings_response.business.photo
                
                this.originPhoto = this.user.business.photo 

                console.log("My user Business", this.user.business)

            }      
        
        } else
            console.log('Settings Error: ', settings_response)

        this.loading = false

    }

    get passKey() {return this.passKeyVerificationForm.get('passKey').value }
    get j() { return this.passKeyVerificationForm.controls }

    public startBusinessVerification(){    

        console.log("startBusinessVerification start")

        this.loading = true
        this.placeFormSubmitted = true

        if (this.businessSettingsForm.invalid) {

            this.loading = false
            this.spotbieSettingsWindow.nativeElement.scrollTo(0,0)
            
            console.log("startBusinessVerification middle")

            return

        }

        const passKeyValidators = [Validators.required, Validators.minLength(6)]

        this.passKeyVerificationForm = this.formBuilder.group({
        passKey: ['', passKeyValidators]
        })

        this.passKeyVerificationFormUp = true
        this.loading = false

        console.log("startBusinessVerification end")
        
    }

    public closePassKey(){
        this.passKeyVerificationForm = null
        this.passKeyVerificationFormUp = false
    }

    public calendly(){
        
        this.calendlyUp = !this.calendlyUp

        if(this.calendlyUp) calendly.spawnCalendly(this.originTitle, this.originAddress)

    }

    public claimThisBusiness(){   

        this.loading = true
        this.passKeyVerificationSubmitted = true

        if(this.passKeyVerificationForm.invalid){
        this.loading = false
        return
        }

        let businessInfo = {
        accountType: this.chosen_account_type,
        name: this.originTitle,
        description: this.originDescription,
        address: this.originAddress,
        photo: this.originPhoto,
        loc_x: this.lat,
        loc_y: this.lng,
        categories: JSON.stringify(this.activeBusinessCategories),
        passkey: this.passKey
        }

        console.log("Save this business", businessInfo)

        this.userAuthService.verifyBusiness(businessInfo).subscribe(
        (resp) => {
            this.claimThisBusinessCB(resp)
        }
        )

    } 

    private claimThisBusinessCB(resp: any){

        if(resp.message == 'passkey_mismatch'){
        
        this.passKeyVerificationForm.get('passKey').setErrors({'invalid': true})

        } else if(resp.message == 'success'){

        this.passKeyVerificationSubmitted = false
        this.passKeyVerificationForm = null
        this.passKeyVerificationFormUp = false      

        localStorage.setItem('spotbie_userType', this.chosen_account_type.toString())

        this.businessVerified = true

        setTimeout(()=>{
            window.location.reload()
        }, 500)

        }

        this.loading = false 

    }

    public claimWithGoogle(){

        let businessInfo = {
        accountType: this.chosen_account_type
        }

        this.userAuthService.verifyBusiness(businessInfo).subscribe(
        (resp) => {
            this.claimThisBusinessCB(resp)
        }
        )

    } 

    openWindow(window: any){
        window.open = true
    }

    public searchMapsKeyDown(evt){
        
        if(evt.key == 'Enter')
        this.searchMaps()

    }

    searchMaps() {
        //console.log('searching')
        // this function will search for an address
        
        const inputAddress = this.addressSearch.nativeElement

        const service = new google.maps.places.AutocompleteService()

        let location = new google.maps.LatLng(this.lat, this.lng)

        service.getQueryPredictions({ 
        input: inputAddress.value,
        componentRestrictions: { country: "us"},
        radius: MAX_DISTANCE, 
        location, 
        types: ['establishment']
        }, (predictions, status) => {

        if (status != google.maps.places.PlacesServiceStatus.OK)
            return      

        let filteredPredictions = []

        for(let i = 0; i < predictions.length; i++){

            if(predictions[i].place_id !== null && predictions[i].place_id !== undefined)
            filteredPredictions.push(predictions[i])        

        }

        this.ngZone.run(() => {            
            this.address_results = filteredPredictions  
        })

        })
        
    }

    public focusPlace(place) {

        this.loading = true
        this.place = place
        this.locationFound = false
        this.getPlaceDetails()
        
    }

    public getPlaceDetails(){

        const request = {
        placeId: this.place.place_id,
        fields: ["name", "photo", "geometry", "formatted_address"],
        };
        
        const map = document.getElementById('spotbieMapG')
        const service = new google.maps.places.PlacesService(map)    
        
        service.getDetails(request, (place, status) => {          

        this.place = place

        this.lat = place.geometry.location.lat()
        this.lng = place.geometry.location.lng()

        this.zoom = 18

        this.businessSettingsForm.get('spotbieOrigin').setValue(this.lat + ',' + this.lng)      
        this.businessSettingsForm.get('originTitle').setValue(place.name)
        this.businessSettingsForm.get('originAddress').setValue(place.formatted_address)
        
        if(place.photos)
            this.originPhoto = place.photos[0].getUrl()
        else
            this.originPhoto = '../../assets/images/home_imgs/find-places-to-eat.svg'

        this.locationFound = true
        this.claimBusiness = true
        this.loading = false          

        })    

        //Clear Address/Place Predictions
        this.address_results = []

    }

    public getBusinessImgStyle(){

        if(this.originPhoto === null) return

        if(this.originPhoto.includes('home_imgs'))
        return 'sb-originPhoto-sm'
        else
        return 'sb-originPhoto-lg'
        
    }

    public startRewardMediaUploader(): void{
        this.placeToEatMediaInput.nativeElement.click()
    }

    public uploadMedia(files): void {

        const file_list_length = files.length

        if (file_list_length === 0) {
        this.placeToEatMediaMessage = 'You must upload at least one file.'
        return
        } else if (file_list_length > 1) {
        this.placeToEatMediaMessage = 'Upload only one background image.'
        return
        }

        this.loading = true

        const formData = new FormData()
        
        let file_to_upload
        let upload_size = 0

        for (let i = 0; i < file_list_length; i++) {

        file_to_upload = files[i] as File

        upload_size += file_to_upload.size

        if (upload_size > PLACE_TO_EAT_MEDIA_MAX_UPLOAD_SIZE) {
            this.placeToEatMediaMessage = 'Max upload size is 25MB.'
            this.loading = false
            return
        }

        formData.append('background_picture', file_to_upload, file_to_upload.name)

        }
        
        let endPoint = `${PLACE_TO_EAT_API}/upload-photo`

        this.http.post(endPoint, formData, {reportProgress: true, observe: 'events'}).subscribe(event => {

        if (event.type === HttpEventType.UploadProgress)
            this.placeToEatMediaUploadProgress = Math.round(100 * event.loaded / event.total)
        else if (event.type === HttpEventType.Response)
            this.placeToEatMediaUploadFinished(event.body)

        })

        return

    }

    private placeToEatMediaUploadFinished(httpResponse: any): void {

        console.log('placeToEatMediaUploadFinished', httpResponse)

        if (httpResponse.success)
        this.originPhoto = httpResponse.background_picture
        else
        console.log('placeToEatMediaUploadFinished', httpResponse)
        
        this.loading = false

    }

    mapsAutocomplete() {

        this.mapsAPILoader.load().then(() => {

        this.geoCoder = new google.maps.Geocoder

        const inputAddress = this.addressSearch.nativeElement

        const autocomplete = new google.maps.places.Autocomplete(inputAddress, {
            componentRestrictions: { country: "us", distance_meters: MAX_DISTANCE },
            types: ['establishment']
        })

        autocomplete.addListener('place_changed', () => {

            this.ngZone.run(() => {

            console.log("place_changed")

            // get the place result
            const place: any = autocomplete.getPlace()

            // verify result
            if (place.geometry === undefined || place.geometry === null) return

            // set latitude, longitude and zoom
            this.lat = place.geometry.location.lat()
            this.lng = place.geometry.location.lng()
            this.zoom = 18

            })

        })

        })
    
    }


    public promptForLocation(){

        let locationPrompted = localStorage.getItem('spotbie_locationPrompted');

        this.locationPrompt = false

        if (locationPrompted == '1')
        this.startLocation() 
        else
        this.locationPrompt = true
        
    }

    public acceptLocationPrompt(){

        this.locationPrompt = false
        localStorage.setItem('spotbie_locationPrompted', '0')
        this.startLocation()

    }

    public mobilePrompt2Toggle(){

        this.loading = false
        this.showMobilePrompt2 = false

    }

    public mobilePrompt2ToggleOff(){

        this.loading = false
        this.showMobilePrompt2 = false

    }

    public mobileStartLocation(){
        
        this.setCurrentLocation()
        this.showMobilePrompt = false
        this.showMobilePrompt2 = true
    
    }

    public startLocation(){
        this.showMobilePrompt = true
    }  

    // Get Current Location Coordinates
    private setCurrentLocation() {

        if ('geolocation' in navigator) {

        navigator.geolocation.getCurrentPosition((position) => {
            this.lat = position.coords.latitude
            this.lng = position.coords.longitude
            this.zoom = 18
            this.locationFound = true
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

    async getAddress(latitude, longitude) {

        await this.mapsAPILoader.load().then(() => {
        
        this.geoCoder = new google.maps.Geocoder
        
        })

        await this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {

        if (status === 'OK') {

            if (results[0]) {
            this.zoom = 18
            this.address = results[0].formatted_address
            this.businessSettingsForm.get('originAddress').setValue(this.address)
            this.businessSettingsForm.get('spotbieOrigin').setValue(this.lat + ',' + this.lng)
            } else
            window.alert('No results found')
            
        } else
            window.alert('Geocoder failed due to: ' + status)
        

        })

    }

    showPosition(position: any) {

        this.locationFound = true

        this.lat = position.coords.latitude
        this.lng = position.coords.longitude

        this.showMobilePrompt2 = false

    }

    public savePassword(): void {
        
        this.spotbiePasswordInfoText.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })

        console.log("savePassword", this.password_form)

        if (this.password_form.invalid) {
            console.log("password_form invalid error", this.password_form.errors)
            this.spotbiePasswordInfoText.nativeElement.style.display = 'block'            
            return
        }

        if (this.password !== this.confirm_password) {
            console.log("confirm password error")
            this.spotbiePasswordInfoText.nativeElement.style.display = 'block'
            this.spotbiePasswordInfoText.nativeElement.innerHTML = 'Passwords must match.'
            return
        }

        this.spotbiePasswordInfoText.nativeElement.style.display = 'block'
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
            
            this.spotbiePasswordInfoText.nativeElement.style.display = 'block'
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
            this.spotbiePasswordInfoText.nativeElement.style.display = 'block'            
            this.spotbiePasswordInfoText.nativeElement.innerHTML = 'There was an error with the server. Try again.'
            break
            
        }

        this.spotbieSettingsWindow.nativeElement.scrollTo(0,0)

        } else
        console.log(resp)

        this.loading = false

    }

    public cancelPasswordSet() {
        this.password_submitted = false
        this.save_password = false
    }

    public changeAccType() {
        this.loadAccountTypes = true
    }

    public selectAccountType(account_type: string) {

        this.account_type_category = account_type

        switch(this.account_type_category){
        case 'PERSONAL':
            this.chosen_account_type = 4
            this.originPhoto = this.accountTypePhotos[0]
            this.account_type_category_friendly_name = 'PERSONAL'
            break
        case 'PLACE TO EAT':
            this.chosen_account_type = 1
            this.originPhoto = this.accountTypePhotos[1]
            this.account_type_category_friendly_name = 'PLACE TO EAT'
            this.mobileStartLocation()
            break
        case 'EVENTS':
            this.chosen_account_type = 2
            this.originPhoto = this.accountTypePhotos[2]
            this.account_type_category_friendly_name = 'EVENTS BUSINESS'
            this.mobileStartLocation()
            break
        case 'RETAIL STORE':
            this.chosen_account_type = 3
            this.originPhoto = this.accountTypePhotos[3]
            this.account_type_category_friendly_name = 'RETAIL STORE'
            this.mobileStartLocation()
            break
        }

        this.settingsForm.get('spotbie_acc_type').setValue(this.account_type_category)

        switch(this.chosen_account_type){

        case 4://personal account
            this.initSettingsForm('personal')
            break

        case 1://place to eat account
            this.initSettingsForm('place_to_eat')
            break

        case 2://events account type
            this.initSettingsForm('events')
            break

        case 3://shopping account type
            this.initSettingsForm('shopping')
            break

        default:
            this.initSettingsForm('personal')

        }

        this.loadAccountTypes = false    

    }

    private async initSettingsForm(action: string) {

        // will set validators for form and take care of animations
        const username_validators = [Validators.required, Validators.maxLength(135)]
        const first_name_validators = [Validators.required, Validators.maxLength(72)]
        const last_name_validators = [Validators.required, Validators.maxLength(72)]
        const email_validators = [Validators.email, Validators.required, Validators.maxLength(135)]
        const phone_validators = []

        const password_validators = [Validators.required]
        const password_confirm_validators = [Validators.required]

        switch (action) {

        case 'personal':

            this.settingsForm = this.formBuilder.group({
            spotbie_username: ['', username_validators],
            spotbie_first_name: ['', first_name_validators],
            spotbie_last_name: ['', last_name_validators],
            spotbie_email: ['', email_validators],
            spotbie_phone_number: ['', phone_validators],
            spotbie_acc_type: [],
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

            this.account_type_category = 'PERSONAL'

            this.fetchCurrentSettings()               

            break
        
        case 'events':
        case 'shopping':
        case 'place_to_eat':

            const originTitleValidators = [Validators.required]
            const originAddressValidators = [Validators.required]
            const originValidators = [Validators.required]
            const originDescriptionValidators = [Validators.required, Validators.maxLength(350), Validators.minLength(100)]

            this.businessSettingsForm = this.formBuilder.group({
            originAddress: ['', originAddressValidators],
            originTitle: ['', originTitleValidators],
            originDescription: ['', originDescriptionValidators],
            spotbieOrigin: ['', originValidators],
            originCategories: ['']
            })

            if(this.user.business !== undefined){

            this.businessSettingsForm.get('originAddress').setValue(this.user.business.address)
            
            this.businessSettingsForm.get('spotbieOrigin').setValue(`${this.user.business.loc_x},${this.user.business.loc_y}`)    

            let position = {
                coords : { latitude : this.user.business.loc_x, longitude : this.user.business.loc_y }
            }

            this.showPosition(position)
            this.originPhoto = this.user.business.photo
            this.businessSettingsForm.get('originDescription').setValue(this.user.business.description)
            this.businessSettingsForm.get('originTitle').setValue(this.user.business.name)
            
            } else {

            this.businessSettingsForm.get('originAddress').setValue('SEARCH FOR LOCATION')
            this.businessSettingsForm.get('spotbieOrigin').setValue( this.lat + ',' + this.lng)

            }        

            //Set the filtered places to eat categories event listener.
            this.filteredBusinessCategories = this.businessSettingsForm.get('originCategories').valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) => fruit ? this._filter(fruit) : this.businessCategoryList.slice())
            )

            this.placeSettingsFormUp = true

            switch(action){
            case 'events':
                
                this.account_type_category = 'EVENTS'
                this.account_type_category_friendly_name = 'EVENTS BUSINESS'

                await this.classificationSearch().subscribe(
                resp =>{
                    this.classificationSearchCallback(resp)
                }
                )

                break

            case 'place_to_eat':
            
                this.account_type_category = 'PLACE TO EAT'
                this.account_type_category_friendly_name = 'PLACE TO EAT'
                this.businessCategoryList = map_extras.FOOD_CATEGORIES
            
                break
            
            case 'shopping':            
                this.account_type_category = 'RETAIL STORE'
                this.account_type_category_friendly_name = 'RETAIL STORE'
                this.businessCategoryList = map_extras.SHOPPING_CATEGORIES
                break            
            } 

            this.fetchCurrentSettings()

            break
        }
    }

    get username() { return this.settingsForm.get('spotbie_username').value }
    get first_name() { return this.settingsForm.get('spotbie_first_name').value }
    get last_name() { return this.settingsForm.get('spotbie_last_name').value }
    get email() { return this.settingsForm.get('spotbie_email').value }
    get spotbie_phone_number() { return this.settingsForm.get('spotbie_phone_number').value }
    get account_type() { return this.settingsForm.get('spotbie_acc_type').value }
    get f() { return this.settingsForm.controls }

    get password() { return this.password_form.get('spotbie_password').value }
    get confirm_password() { return this.password_form.get('spotbie_confirm_password').value }
    get current_password() { return this.password_form.get('spotbie_current_password').value }
    get g() { return this.password_form.controls }

    get deactivation_password() { return this.deactivation_form.get('spotbie_deactivation_password').value }
    get h() { return this.deactivation_form.controls }

    get originAddress() {return this.businessSettingsForm.get('originAddress').value }
    get spotbieOrigin() { return this.businessSettingsForm.get('spotbieOrigin').value }
    get originTitle() { return this.businessSettingsForm.get('originTitle').value }
    get originDescription() { return this.businessSettingsForm.get('originDescription').value }
    get originCategories() { return this.businessSettingsForm.get('originCategories').value }
    get i() { return this.businessSettingsForm.controls }

    public saveSettings() {

        this.loading = true
        this.submitted = true

        if (this.settingsForm.invalid) {

            this.loading = false
            this.spotbieSettingsWindow.nativeElement.scrollTo(0,0)
            
            return

        }

        this.user.username = this.username
        this.user.spotbie_user.first_name = this.first_name
        this.user.spotbie_user.last_name = this.last_name
        this.user.email = this.email
        this.user.spotbie_user.phone_number = this.spotbie_phone_number
        this.user.spotbie_user.user_type = this.chosen_account_type

        this.userAuthService.saveSettings(this.user).subscribe({
            next: (resp) => {
                this.saveSettingsCallback(resp)   
            },
            error:(error: any) => {
                
                if(error.error.errors.email[0] == 'notUnique')
                    this.settingsForm.get('spotbie_email').setErrors({ notUnique: true })

                    
                this.spotbieSettingsInfoText.nativeElement.innerHTML = `
                    <span class='spotbie-text-gradient spotbie-error'>
                        There was an error saving.
                    </span>
                `

                this.spotbieSettingsWindow.nativeElement.scrollTo(0,0)

                this.loading = false
                this.placeSettingsFormUp = false 
                
            }
        })

    }

    private saveSettingsCallback(resp: any) {
        
        this.loading = false
        this.placeSettingsFormUp = false 

        if (resp.success) {

            this.spotbieSettingsInfoText.nativeElement.innerHTML = `
                <span class='sb-text-light-green-gradient'>
                Your settings were saved.       
                </span>
            `
            
            this.spotbieSettingsWindow.nativeElement.scrollTo(0,0)

            localStorage.setItem('spotbie_userLogin', resp.user.username)
            localStorage.setItem('spotbie_userType', resp.user.spotbie_user.user_type)

        } else {

            this.spotbieSettingsInfoText.nativeElement.innerHTML = `
                <span class='spotbie-text-gradient spotbie-error'>
                    There was an error saving.     
                </span>
            `
            console.log('Failed Save Settings: ', resp)            

        }
        

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

    public closeWindow() {
        window.location.reload()
    }

    public classificationSearch(): Observable<any>{

        this.loading = true    
        return this.locationService.getClassifications()

    }

    public classificationSearchCallback(resp){
    
        console.log("classificationSearchCallback", resp)

        this.loading = false

        if(resp.success){

        let classifications: Array<any> = resp.data._embedded.classifications
        
        classifications.forEach( classification => {

            if(classification.type && classification.type.name && classification.type.name !== "Undefined"){

            classification.name = classification.type.name        

            } else if(classification.segment && classification.segment.name && classification.segment.name !== "Undefined"){

            classification.name = classification.segment.name

            classification.segment._embedded.genres.forEach(genre => {

                genre.show_sub_sub = false

                if(genre.name === "Chanson Francaise" ||
                genre.name === "Medieval/Renaissance" ||
                genre.name === "Religious" ||
                genre.name === "Undefined" ||
                genre.name === "World"){

                    classification.segment._embedded.genres.splice(classification.segment._embedded.genres.indexOf(genre), 1)

                }

            });          

            }

            if(classification.name !== undefined){

            classification.show_sub = false

            if(classification.name !== 'Donation' &&
            classification.name !== 'Parking' &&
            classification.name !== 'Transportation' &&
            classification.name !== 'Upsell' &&
            classification.name !== 'Venue Based' &&
            classification.name !== 'Event Style' &&
            classification.name !== 'Individual' &&
            classification.name !== 'Merchandise' &&
            classification.name !== 'Group'){
            
                this.businessCategoryList.push(classification.name)
            
            }

            }

        })

        this.businessCategoryList = this.businessCategoryList.reverse()

        } else
        console.log("getClassifications Error ", resp)

        this.loading = false
      
    }

    ngOnInit(): void {
        this.loading = true
        this.initSettingsForm('personal')
    }

}