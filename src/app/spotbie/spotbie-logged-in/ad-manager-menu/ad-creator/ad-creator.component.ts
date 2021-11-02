import { HttpClient, HttpEventType } from '@angular/common/http'
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Ad } from 'src/app/models/ad'
import { Business } from 'src/app/models/business'
import { LoyaltyPointBalance } from 'src/app/models/loyalty-point-balance'
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service'
import { AdCreatorService } from 'src/app/services/spotbie-logged-in/ad-manager-menu/ad-creator/ad-creator.service'
import { BottomAdBannerComponent } from 'src/app/spotbie/ads/bottom-ad-banner/bottom-ad-banner.component'
import { NearbyFeaturedAdComponent } from 'src/app/spotbie/ads/nearby-featured-ad/nearby-featured-ad.component'
import { SingleAdComponent } from 'src/app/spotbie/ads/single-ad/single-ad.component'
import * as spotbieGlobals from '../../../../globals'

const AD_MEDIA_UPLOAD_API_URL = `${spotbieGlobals.API}in-house/upload-media`
const AD_MEDIA_MAX_UPLOAD_SIZE = 25e+6

@Component({
  selector: 'app-ad-creator',
  templateUrl: './ad-creator.component.html',
  styleUrls: ['./ad-creator.component.css']
})
export class AdCreatorComponent implements OnInit {

  @Input() ad: Ad = null

  @ViewChild('spbInputInfo') spbInputInfo
  @ViewChild('adMediaInput') adMediaInput
  @ViewChild('spbTopAnchor') spbTopAnchor

  @ViewChild('adApp') adApp: SingleAdComponent | BottomAdBannerComponent | NearbyFeaturedAdComponent

  @Output() closeWindowEvt = new EventEmitter()
  @Output() closeThisEvt = new EventEmitter()
  @Output() closeAdCreatorAndRefetchAdListEvt = new EventEmitter()

  public loading: boolean = false

  public adCreatorForm: FormGroup
  public adCreatorFormUp: boolean = false

  public adFormSubmitted: boolean = false

  public adUploadImage: string = '../../assets/images/home_imgs/find-places-to-eat.svg'

  public adMediaMessage: string = "Upload Ad Image"

  public adMediaUploadProgress: number = 0

  public businessPointsDollarValue: string = '0'
  
  public dollarValueCalculated: boolean = false
  
  public adTypeList: Array<any> = [
    { name: 'Header Banner ($15.99/monthly)', dimensions: '1200x370'}, 
    { name: 'Related-Nearby Box ($13.99/monthly)', dimensions: '600x600'}, 
    { name: 'Footer Banner ($10.99)', dimensions: '1200x370'} 
  ]

  public adCreated: boolean = false
  public adDeleted: boolean = false

  public loyaltyPointBalance: LoyaltyPointBalance

  public selected: number = 0

  public business: Business = null

  constructor(private formBuilder: FormBuilder,
              private adCreatorService: AdCreatorService,
              private http: HttpClient,
              private loyaltyPointsService: LoyaltyPointsService) { 
                
                this.loyaltyPointsService.userLoyaltyPoints$.subscribe(
                  loyaltyPointsBalance => {

                    this.loyaltyPointBalance = loyaltyPointsBalance                    

                  }
                )

              }

  get adType() {return this.adCreatorForm.get('adType').value }
  get adValue() {return this.adCreatorForm.get('adValue').value }
  get adName() {return this.adCreatorForm.get('adName').value }
  get adDescription() {return this.adCreatorForm.get('adDescription').value }
  get adImage() {return this.adCreatorForm.get('adImage').value }  

  get f() { return this.adCreatorForm.controls }

  public initAdForm(){

    const adTypeValidators = [Validators.required]
    const adValueValidators = [Validators.required]

    const adNameValidators = [Validators.required, Validators.maxLength(50)]
    const adDescriptionValidators = [Validators.required, Validators.maxLength(250), Validators.minLength(50)]

    const adImageValidators = [Validators.required]

    this.adCreatorForm = this.formBuilder.group({
      adType: ['', adTypeValidators],
      adValue: ['', adValueValidators],
      adName: ['', adNameValidators],
      adDescription: ['', adDescriptionValidators],
      adImage: ['', adImageValidators]
    })

    console.log("Our ad", this.ad)

    if(this.ad !== null && this.ad !== undefined){
      
      this.adCreatorForm.get('adType').setValue(this.ad.type)
      this.adCreatorForm.get('adName').setValue(this.ad.name)
      this.adCreatorForm.get('adDescription').setValue(this.ad.description)     

      this.selected = this.ad.type

    } else {
      this.selected = 0
    }

    this.adCreatorFormUp = true
    this.loading = false

  }

  public saveAd(){

    this.adFormSubmitted = true
    this.spbTopAnchor.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    
    let adObj = new Ad()
    adObj.name = this.adName   
    adObj.description = this.adDescription
    adObj.images = this.adUploadImage
    adObj.type = this.adType

    if(this.ad === null || this.ad === undefined){

      this.adCreatorService.saveAd(adObj).subscribe(
        resp =>{        
          this.saveAdCb(resp)
        }
      )

    } else {

      adObj.id = this.ad.id

      this.adCreatorService.updateAd(adObj).subscribe(
        resp =>{        
          this.saveAdCb(resp)
        }
      )

    }

  } 

  public saveAdCb(resp: any){

    console.log(resp)

    if(resp.success){

      this.adCreated = true    

      setTimeout(() => {
        this.closeAdCreatorAndRefetchAdList()
      }, 1500)    
        
    }

  }

  public startAdMediaUploader(): void{
    this.adMediaInput.nativeElement.click()
  }

  public uploadMedia(files): void {

    const file_list_length = files.length

    if (file_list_length === 0) {
      this.adMediaMessage = 'You must upload at least one file.'
      return
    } else if (file_list_length > 1) {
      this.adMediaMessage = 'Upload only one item image.'
      return
    }

    this.loading = true

    const formData = new FormData()
    
    let file_to_upload
    let upload_size = 0

    for (let i = 0; i < file_list_length; i++) {

      file_to_upload = files[i] as File

      upload_size += file_to_upload.size

      if (upload_size > AD_MEDIA_MAX_UPLOAD_SIZE) {
        this.adMediaMessage = 'Max upload size is 25MB.'
        this.loading = false
        return
      }

      formData.append('image', file_to_upload, file_to_upload.name)

    }

    let token = localStorage.getItem('spotbiecom_session')

    this.http.post(AD_MEDIA_UPLOAD_API_URL, formData, 
                    {
                      reportProgress: true, 
                      observe: 'events', 
                      withCredentials: true, headers: {
                        'Authorization' : `Bearer ${token}`
                      }
                    }
                  ).subscribe(event => {

      if (event.type === HttpEventType.UploadProgress)
        this.adMediaUploadProgress = Math.round(100 * event.loaded / event.total)
      else if (event.type === HttpEventType.Response)
        this.adMediaUploadFinished(event.body)

    })

    return

  }

  private adMediaUploadFinished(httpResponse: any): void {

    if (httpResponse.success){

      this.adUploadImage = httpResponse.image

      this.adApp.updateAdImage(this.adUploadImage)

      this.adCreatorForm.get('adImage').setValue(this.adUploadImage)
    
    } else
      console.log('adMediaUploadFinished', httpResponse)
    
    this.loading = false

  }

  public adTypeChange(){

  }

  public closeThis(){
    this.closeThisEvt.emit()
  }

  public closeWindow(){
    this.closeWindowEvt.emit()
  }

  public closeAdCreatorAndRefetchAdList(){
    this.closeAdCreatorAndRefetchAdListEvt.emit()
  }

  public deleteMe(){
    
    this.adCreatorService.deleteMe(this.ad).subscribe(
      resp => {
        this.deleteMeCb(resp)
      }
    )

  }

  private deleteMeCb(resp){

    if(resp.success){

      this.adDeleted = true    
      setTimeout(() => {
        this.closeAdCreatorAndRefetchAdList()
      }, 1500)  
      
    }

  }

  public adFormatClass(){

    switch(this.adType){

      case 0:
        return 'header-banner'
        
      case 1:
        return 'related-nearby-box'
        
      case 2:
        return 'footer-banner'      

    }

  }

  ngOnInit(): void {

    this.initAdForm()

  }

}
