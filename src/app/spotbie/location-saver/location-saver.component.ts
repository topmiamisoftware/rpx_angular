import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MyPlacesService } from './my-places/my-places.service';

@Component({
  selector: 'app-location-saver',
  templateUrl: './location-saver.component.html',
  styleUrls: ['./location-saver.component.css']
})
export class LocationSaverComponent implements OnInit {

  @Output() closeWindow = new EventEmitter()

  public bgColor : string;

  public locationSaverForm: FormGroup

  public isLoggedIn: string

  public submitted: boolean = false

  constructor(private formBuilder: FormBuilder, 
              private myPlacesService: MyPlacesService) { }

  public closeWindowX(): void{
    this.closeWindow.emit(null)
  }

  get f() { return this.locationSaverForm.controls }
  get placeDescription() {return this.locationSaverForm.get('placeDescription').value }
  get placeName() {return this.locationSaverForm.get('placeName').value }

  public initForm(): void{
    
    const descriptionValidators = [Validators.maxLength(300)]
    const nameValidators = [Validators.maxLength(35)]

    this.locationSaverForm = this.formBuilder.group({
      placeName: ['', nameValidators],
      placeDescription: ['', descriptionValidators],
    })

  }

  public savePlace(): void{

    let placeObj = {
      place_name: this.placeName,
      place_description: this.placeDescription
    }

    if(this.isLoggedIn == '1'){
      this.myPlacesService.addPlace(placeObj).subscribe(
        resp =>{
          
        }
      )
    } else {

    }
  
  }

  ngOnInit() {

    this.bgColor = localStorage.getItem('spotbie_backgroundColor')
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn')

    this.initForm()

  }

}
