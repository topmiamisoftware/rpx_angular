import { HttpClient, HttpEventType } from '@angular/common/http'
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Ad } from 'src/app/models/ad'
import { LoyaltyPointBalance } from 'src/app/models/loyalty-point-balance'
import { LoyaltyPointsService } from 'src/app/services/loyalty-points/loyalty-points.service'
import { AdCreatorService } from 'src/app/services/spotbie-logged-in/ad-manager-menu/ad-creator/ad-creator.service'
import * as spotbieGlobals from '../../../../globals'

const AD_MEDIA_UPLOAD_API_URL = `${spotbieGlobals.API}ad/upload-media`
const AD_MEDIA_MAX_UPLOAD_SIZE = 25e+6

@Component({
  selector: 'app-ad-creator',
  templateUrl: './ad-creator.component.html',
  styleUrls: ['./ad-creator.component.css']
})
export class AdCreatorComponent implements OnInit {

  @Input() ad: Ad

  @ViewChild('spbInputInfo') spbInputInfo
  @ViewChild('adMediaInput') adMediaInput
  @ViewChild('spbTopAnchor') spbTopAnchor

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
    { name: 'Header Banner ($15.99/monthly)', dimensions: '728x90'}, 
    { name: 'Related-Nearby Box ($13.99/monthly)', dimensions: '300x250'}, 
    { name: 'In-Content Related-Nearby ($6.99)', dimensions: '336x280'}, 
  ]

  public adCreated: boolean = false
  public adDeleted: boolean = false

  public uploadMediaForm: boolean = false

  public loyaltyPointBalance: LoyaltyPointBalance

  public selected: number = 0

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

    if(this.ad !== null && this.ad !== undefined){
      
      //console.log("ad is ", this.ad)

      this.selected = this.ad.type
      this.adCreatorForm.get('adType').setValue(this.ad.type)
      this.adCreatorForm.get('adName').setValue(this.ad.name)
      this.adCreatorForm.get('adDescription').setValue(this.ad.description)     

    }

    this.adCreatorFormUp = true
    this.loading = false

  }

  public saveAd(){
    
    this.adFormSubmitted = true
    this.spbTopAnchor.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    
    let itemObj = new Ad()
    itemObj.name = this.adName   
    itemObj.description = this.adDescription
    itemObj.type = this.adType

    if(this.ad === null || this.ad === undefined){

      this.adCreatorService.saveAd(itemObj).subscribe(
        resp =>{        
          this.saveAdCb(resp)
        }
      )

    } else {

      itemObj.id = this.ad.id

      this.adCreatorService.updateAd(itemObj).subscribe(
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

    console.log('adMediaUploadFinished', httpResponse)

    if (httpResponse.success){
      this.adUploadImage = httpResponse.image
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

    console.log("adType", this.adType)

    switch(this.adType){

      case 0:
        return 'header-banner'
        
      case 1:
        return 'related-nearby-box'
        
      case 2:
        return 'in-content-related-nearby-box'      

    }

  }

  ngOnInit(): void {

    this.initAdForm()

  }

}
