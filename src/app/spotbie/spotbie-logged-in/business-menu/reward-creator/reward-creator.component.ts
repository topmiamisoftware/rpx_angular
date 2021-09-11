import { HttpClient, HttpEventType } from '@angular/common/http'
import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import * as spotbieGlobals from '../../../../globals'

const REWARD_MEDIA_UPLOAD_API_URL = `${spotbieGlobals.API}place-to-eat-items/upload-media`
const REWARD_MEDIA_MAX_UPLOAD_SIZE = 25e+6

@Component({
  selector: 'app-reward-creator',
  templateUrl: './reward-creator.component.html',
  styleUrls: ['./reward-creator.component.css']
})
export class RewardCreatorComponent implements OnInit {

  @Input() userLoyaltyPoints: number = 0
  @Input() userPointToDollarRatio: number = 0

  @ViewChild('rewardMediaInput') rewardMediaInput

  public loading: boolean = false

  public rewardCreatorForm: FormGroup
  public rewardCreatorFormUp: boolean = false

  public rewardFormSubmitted: boolean = false

  public rewardUploadImage: string = '../../assets/images/home_imgs/find-places-to-eat.svg'

  public rewardMediaMessage: string = "Upload an image describing your reward."

  public rewardMediaUploadProgress: number = 0

  rewardTypeList: Array<string> = ['Discount', 'Something From Our Menu']

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient) { }

  get rewardType() {return this.rewardCreatorForm.get('rewardType').value }
  get rewardValue() {return this.rewardCreatorForm.get('rewardValue').value }
  get rewardName() {return this.rewardCreatorForm.get('rewardName').value }
  get rewardDescription() {return this.rewardCreatorForm.get('rewardDescription').value }
  get rewardImage() {return this.rewardCreatorForm.get('rewardImage').value }  

  get f() { return this.rewardCreatorForm.controls }

  public initRewardForm(){

    const rewardTypeValidators = [Validators.required]
    const rewardValueValidators = [Validators.required]
    const rewardNameValidators = [Validators.required, Validators.maxLength(50)]
    const rewardDescriptionValidators = [Validators.required, Validators.maxLength(250), Validators.minLength(50)]

    this.rewardCreatorForm = this.formBuilder.group({
      rewardType: ['', rewardTypeValidators],
      rewardValue: ['', rewardValueValidators],
      rewardName: ['', rewardNameValidators],
      rewardDescription: ['', rewardDescriptionValidators]
    })

    this.rewardCreatorFormUp = true
    this.loading = false

  }

  public calculateDollarValue(){

  }

  public saveReward(){
    
    this.rewardFormSubmitted = true

  }

  public startRewardMediaUploader(): void{
    this.rewardMediaInput.nativeElement.click()
  }

  public uploadMedia(files): void {

    const file_list_length = files.length

    if (file_list_length === 0) {
      this.rewardMediaMessage = 'You must upload at least one file.'
      return
    } else if (file_list_length > 1) {
      this.rewardMediaMessage = 'Upload only one item image.'
      return
    }

    this.loading = true

    const formData = new FormData()
    
    let file_to_upload
    let upload_size = 0

    for (let i = 0; i < file_list_length; i++) {

      file_to_upload = files[i] as File

      upload_size += file_to_upload.size

      if (upload_size > REWARD_MEDIA_MAX_UPLOAD_SIZE) {
        this.rewardMediaMessage = 'Max upload size is 25MB.'
        this.loading = false
        return
      }

      formData.append('background_picture', file_to_upload, file_to_upload.name)

    }

    this.http.post(REWARD_MEDIA_UPLOAD_API_URL, formData, {reportProgress: true, observe: 'events'}).subscribe(event => {

      if (event.type === HttpEventType.UploadProgress)
        this.rewardMediaUploadProgress = Math.round(100 * event.loaded / event.total)
      else if (event.type === HttpEventType.Response)
        this.rewardMediaUploadFinished(event.body)

    })

    return

  }

  private rewardMediaUploadFinished(httpResponse: any): void {

    console.log('rewardMediaUploadFinished', httpResponse)

    if (httpResponse.success)
      this.rewardUploadImage = httpResponse.background_picture
    else
      console.log('rewardMediaUploadFinished', httpResponse)
    
    this.loading = false

  }

  rewardTypeChange(){

    console.log("reward type changed")

  }

  ngOnInit(): void {
    this.initRewardForm()
  }

}
