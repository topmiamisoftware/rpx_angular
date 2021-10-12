import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-choose-account-type',
  templateUrl: './choose-account-type.component.html',
  styleUrls: ['./choose-account-type.component.css']
})
export class ChooseAccountTypeComponent implements OnInit {

  public accountTypeScreen: boolean = false

  public accountModelNameScreen: boolean = false

  public accountTypeForm: FormGroup

  constructor(private formBuilder: FormBuilder) { }

  public saveUserType(){

  }

  public next(){

  }

  public initAccountTypeSettings(){

  }

  public fetchCurrentSettings(){

  }

  ngOnInit(): void {
    


  }

}
