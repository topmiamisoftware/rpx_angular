import { Component, OnInit, ViewChild } from '@angular/core'
import { ProfileHeaderComponent } from '../profile-header.component'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import * as spotbieGlobals from '../../../globals'
import { HttpResponse } from '../../../models/http-reponse'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { displayError } from 'src/app/helpers/error-helper'

const PROFILE_HEADER_API = spotbieGlobals.API + 'api/settings.service.php'

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  @ViewChild('spotbie_questions_info') spotbie_questions_info

  public questions_on : boolean = false
  public questions_state : string = 'OFF'
  public questions_submitted : boolean = false
  public spotbie_questions_form: FormGroup
  public background_color: string

  public help_text : string = ''
  public questions_help = { help_text : 'If you turn your questions ON, users will be required to answer them before they can befriend you. Questions must be answered EXACTLY as you have typed them here.'}

  private exe_api_key: string

  public loading = false

  constructor(private host: ProfileHeaderComponent,
              private http: HttpClient,
              private formBuilder: FormBuilder) { }

  getLight(light_name: any) {
    if (light_name == 1) { return {'background-color': 'green'} } else { return {'background-color' : 'red'} }
  }

  closeWindow() {
    this.host.questionsWindow.open = false
  }

  initQuestionsForm() {

    const question_1_validators = [Validators.required, Validators.maxLength(100)]
    const answer_1_validators = [Validators.required, Validators.maxLength(100)]

    const question_2_validators = [Validators.required, Validators.maxLength(100)]
    const answer_2_validators = [Validators.required, Validators.maxLength(100)]

    const question_3_validators = [Validators.required, Validators.maxLength(100)]
    const answer_3_validators = [Validators.required, Validators.maxLength(100)]

    this.spotbie_questions_form = this.formBuilder.group({
      spotbie_question_1 : ['', question_1_validators],
      spotbie_answer_1 : ['', answer_1_validators],
      spotbie_question_2 : ['', question_2_validators],
      spotbie_answer_2 : ['', answer_2_validators],
      spotbie_question_3 : ['', question_3_validators],
      spotbie_answer_3 : ['', answer_3_validators],
      require_questions : []
    })

    this.getQuestions()

  }

  toggleHelp(help_object) {
    this.help_text = help_object.help_text
  }

  toggleQuestions() {

    let questions: number

    if (this.require_questions == 1) {
      this.questions_state = 'OFF'
      this.questions_on = false
      questions = 0
    } else {
      this.questions_state = 'ON'
      this.questions_on = true
      questions = 1
    }
    this.spotbie_questions_form.get('require_questions').setValue(questions)

  }

  getQuestions() {

    const get_profile_header_object = { exe_api_key : this.exe_api_key, exe_settings_action : 'getQuestions', public_exe_user_id : 'null' }

    this.http.post<HttpResponse>(PROFILE_HEADER_API, get_profile_header_object, HTTP_OPTIONS)
    .subscribe( resp => {
      const httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      })
      this.getQuestionsCallback(httpResponse)
    },
      error => {
        console.log('Profile Questions Error : ', error)
        displayError(error)
    })

  }

  private getQuestionsCallback(questions_response : HttpResponse) : void {
    this.loading = false
    if (questions_response.status == '200') {
      // console.log("Questions : ", httpResponse)
      this.populateQuestions(questions_response.responseObject)
    } else {
      console.log('Questions Error : ', questions_response)
    }
  }

  saveQuestions() {

    if (this.questions_submitted) { return } else { this.questions_submitted = true }

    if (this.spotbie_questions_form.invalid) { return }

    const questions_object = {
      questions_required : this.require_questions,
      question_0 : this.spotbie_question_1,
      answer_0 : this.spotbie_answer_1,
      question_1 : this.spotbie_question_2,
      answer_1 : this.spotbie_answer_2,
      question_2 : this.spotbie_question_3,
      answer_2 : this.spotbie_answer_3
    }

    const get_profile_header_object = { exe_api_key : this.exe_api_key, exe_settings_action : 'saveQuestions', questions_object }

    this.http.post<HttpResponse>(PROFILE_HEADER_API, get_profile_header_object, HTTP_OPTIONS)
    .subscribe( resp => {
      const httpResponse = new HttpResponse ({
        status : resp.status,
        message : resp.message,
        full_message : resp.full_message,
        responseObject : resp.responseObject
      })
      this.saveQuestionsCallback(httpResponse)
    },
      error => {
        console.log('Profile Save Questions Error : ', error)
    })

  }

  saveQuestionsCallback(httpResponse: HttpResponse) {
    this.questions_submitted = false
    if (httpResponse.status == '200') {
      this.spotbie_questions_info.nativeElement.innerHTML = 'Your questions were saved.'
    } else {
      console.log('Profile Save Questions Error : ', httpResponse)
    }
  }

  private populateQuestions(questions_object : any) : void {

    if(questions_object.responseObject == 'questions_not_set'){
      
      questions_object.require_questions = '0'

      questions_object.question_0 = 'Friendship Request Question #1'
      questions_object.answer_0 = 'Friendship Request Answer #1'

      questions_object.question_1 = 'Friendship Request Question #2'
      questions_object.answer_1 = 'Friendship Request Answer #2'

      questions_object.question_2 = 'Friendship Request Question #3'
      questions_object.answer_2 = 'Friendship Request Answer #3'

    }

    this.spotbie_questions_form.get('require_questions').setValue(questions_object.require_questions)

    if (this.require_questions == 0) {
      this.questions_state = 'OFF'
      this.questions_on = false
    } else {
      this.questions_state = 'ON'
      this.questions_on = true
    }

    this.spotbie_questions_form.get('spotbie_question_1').setValue(questions_object.question_0)
    this.spotbie_questions_form.get('spotbie_answer_1').setValue(questions_object.answer_0)

    this.spotbie_questions_form.get('spotbie_question_2').setValue(questions_object.question_1)
    this.spotbie_questions_form.get('spotbie_answer_2').setValue(questions_object.answer_1)

    this.spotbie_questions_form.get('spotbie_question_3').setValue(questions_object.question_2)
    this.spotbie_questions_form.get('spotbie_answer_3').setValue(questions_object.answer_2)

  }

  get spotbie_question_1() { return this.spotbie_questions_form.get('spotbie_question_1').value }
  get spotbie_answer_1() { return this.spotbie_questions_form.get('spotbie_answer_1').value }

  get spotbie_question_2() { return this.spotbie_questions_form.get('spotbie_question_2').value }
  get spotbie_answer_2() { return this.spotbie_questions_form.get('spotbie_answer_2').value }

  get spotbie_question_3() { return this.spotbie_questions_form.get('spotbie_question_3').value }
  get spotbie_answer_3() { return this.spotbie_questions_form.get('spotbie_answer_3').value }

  get require_questions() { return this.spotbie_questions_form.get('require_questions').value }
  
  get g() { return this.spotbie_questions_form.controls }

  ngOnInit() {
    this.loading =  true
    this.background_color = localStorage.getItem('spotbie_backgroundColor')
    this.exe_api_key = localStorage.getItem('spotbie_userApiKey')
    this.initQuestionsForm()
  }
}
