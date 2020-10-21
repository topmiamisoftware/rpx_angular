import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import * as spotbieGlobals from '../../../globals';
import { HttpResponse } from '../../../models/http-reponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FriendshipsService } from '../../spotbie-logged-in/friends/friendships.service';

const PROFILE_HEADER_API = spotbieGlobals.API + "api/settings.service.php";

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};

@Component({
  selector: 'app-questions-answer',
  templateUrl: './questions-answer.component.html',
  styleUrls: ['./questions-answer.component.css']
})
export class QuestionsAnswerComponent implements OnInit {

  @Output() closeWindow = new EventEmitter();
  @Output() friendRequested = new EventEmitter();
  
  @Input() user;

  @ViewChild('spotbie_questions_info') spotbie_questions_info;

  public loading : boolean = false;
  private exe_api_key : string;
  public spotbie_questions_form : FormGroup; 
  
  public question_1 : string;
  public question_2 : string;
  public question_3 : string;

  public help_text : string = "This user requires you to answer their questions.";
  public background_color : string;

  public answers_submitted : boolean = false;

  public spotbie_questions_info_text : string = '';

  constructor(private http: HttpClient,
    private friendshipService : FriendshipsService,
    private formBuilder : FormBuilder) { }

  sendRequest(){
    this.loading = true;
    let answers_object = {
      answer_0 : this.spotbie_answer_1,
      answer_1 : this.spotbie_answer_2,
      answer_2 : this.spotbie_answer_3
    };
    let block_user_obj = { exe_api_key : this.exe_api_key,
                           exe_friend_action : "requestWithAnswers", 
                           exe_friend_id : this.user.user_info.exe_user_id, 
                           answers_object : answers_object };
    //this.friendshipService.friendService(block_user_obj, function(a){this.sendRequestCallback(a);}.bind(this));
  }

  sendRequestCallback(httpResponse : HttpResponse){
    this.loading = false;
    if(httpResponse.status == '200'){
      if(httpResponse.responseObject == 'requested'){
        this.friendRequested.emit();
      } else if(httpResponse.responseObject == 'wrong_answer_0'){
        this.help_text = "Answer # 1 is incorrect.";
      } else if(httpResponse.responseObject == 'wrong_answer_1'){
        this.help_text = "Answer # 2 is incorrect.";
      } else if(httpResponse.responseObject == 'wrong_answer_2'){
        this.help_text = "Answer # 3 is incorrect.";
      }
    } else {
      alert("Problem with app. Please re-fresh/re-open.");
      console.log("cancelRequestCallback Error : ", httpResponse);
    }
  }

  initQuestionsForm(){
    const answer_1_validators = [Validators.required, Validators.maxLength(100)];
    const answer_2_validators = [Validators.required, Validators.maxLength(100)];    
    const answer_3_validators = [Validators.required, Validators.maxLength(100)];

    this.spotbie_questions_form = this.formBuilder.group({
      spotbie_answer_1 : ['', answer_1_validators],
      spotbie_answer_2 : ['', answer_2_validators],
      spotbie_answer_3 : ['', answer_3_validators]
    });
    this.getQuestions();    
  }
  getQuestions(){
    let get_profile_header_object = { exe_api_key : this.exe_api_key, exe_settings_action : "getQuestionsOnly", public_exe_user_id : this.user.user_info.exe_user_id };

    this.http.post<HttpResponse>(PROFILE_HEADER_API, get_profile_header_object, HTTP_OPTIONS)
    .subscribe( resp => {
      let httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      });
      this.getQuestionsCallback(httpResponse);
    },
      error => {
        console.log("Profile Questions Error : ", error);
    });
  }
  getQuestionsCallback(httpResponse : HttpResponse){
    this.loading = false;
    if(httpResponse.status == "200"){
      //console.log("Questions : ", httpResponse);   
      this.populateQuestions(httpResponse.responseObject);
    } else {
      console.log("Questions Error : ", httpResponse);   
    }
  }
  populateQuestions(questions_object){
    this.question_1 = questions_object.question_0;
    this.question_2 = questions_object.question_1;
    this.question_3 = questions_object.question_2;
  }
  cancel(){
    this.closeWindow.emit();
  }
  get spotbie_answer_1() { return this.spotbie_questions_form.get('spotbie_answer_1').value; }
  get spotbie_answer_2() { return this.spotbie_questions_form.get('spotbie_answer_2').value; }
  get spotbie_answer_3() { return this.spotbie_questions_form.get('spotbie_answer_3').value; }  
  get g() { return this.spotbie_questions_form.controls; }    

  ngOnInit() {
    //console.log("Pending Friend Input : ", this.pending_friend);
    this.loading =  true;
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey');
    this.background_color = localStorage.getItem('spotbie_backgroundColor');
    this.initQuestionsForm();
  }
}