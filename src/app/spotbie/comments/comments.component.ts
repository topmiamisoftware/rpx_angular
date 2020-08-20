import { Component, OnInit, Input } from '@angular/core'
import { HttpResponse } from 'src/app/models/http-reponse'
import { I_Comment } from './comment-interface/comment.interface'
import { I_CommentSubject } from './comment-interface/comment-subject.interface'
import { ToastResponse } from '../../helpers/toast-helper/toast-models/toast-response'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ToastRequest } from 'src/app/helpers/toast-helper/toast-models/toast-request'

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  @Input() current_subject : I_CommentSubject

  @Input() comments_config : any

  public logged_in : boolean = false
  
  public logged_in_user : string

  private comments_ite : number = 0

  public load_more : boolean = false

  public loading : boolean = false

  public comment_list : Array<I_Comment> = []

  public no_comments : boolean = false

  public comment_form : FormGroup

  public comment_submitted : boolean = false

  public toast_helper : boolean = false

  private current_comment : I_Comment

  public toast_helper_config : ToastRequest = {
      type : "confirm",
      text : {
        info_text : "",
        confirm : "Yes",
        decline : "No",
      },
      actions: {
        confirm : this.deleteComment.bind(this),
        decline : this.cancelCommentDelete.bind(this),
        acknowledge : this.commentDeleted.bind(this)
      }
  }

  constructor(private form_builder : FormBuilder) { }

  private cancelCommentDelete() : void {
    this.current_comment = null
    this.toast_helper = false
  }

  public deleteCommentInit(comment : I_Comment) : void {
    this.current_comment = comment
    this.toast_helper_config.type = "confirm"
    this.toast_helper_config.text.info_text = "Are you sure you want to delete this comment?"
    this.toast_helper = true
  }

  private deleteComment(){
    this.loading = true
    this.current_subject.deleteComment(this.current_comment.c_id, this.deleteCommentCallback.bind(this))
  }

  private deleteCommentCallback(delete_comment_response : HttpResponse) : void {

    if(delete_comment_response.status == '200' && delete_comment_response.responseObject == 'success'){

      this.toast_helper_config.type = "acknowledge"
      this.toast_helper_config.text.info_text = "Your comment was deleted."

    } else {

      this.toast_helper_config.type = "acknowledge"
      this.toast_helper_config.text.info_text = "There was an error deleting your comment."       
      console.log("deleteCommentCallback Error : ", delete_comment_response)
    
    }
    
    this.toast_helper = true
    this.loading = false

  }

  public commentDeleted() : void {
    let i = this.comment_list.indexOf(this.current_comment)
    this.comment_list.splice(i, 1)
  }

  public addComment() : void { 

    if (this.comment_submitted) return; else this.comment_submitted = true

    if (this.comment_form.invalid) return

    this.loading = true

    let comment = this.spotbie_comment_text

    this.current_subject.addComment(comment, this.addCommentCallback.bind(this))

  }

  private addCommentCallback(add_comment_response : HttpResponse) : void{
    if(add_comment_response.status == '200'){
      if(add_comment_response.responseObject == 'success'){
        this.comments_ite = 0
        this.pullComments()
      } else console.log("addAlbumMediaCommentCallback  : ", add_comment_response)
    } else {
      console.log("addAlbumMediaCommentCallback Error : ", add_comment_response)
    }
  }

  public dismissToast(toast_response ?: ToastResponse) : void{
    if(typeof toast_response.callback == "function"){
      toast_response.callback()
    }
    this.toast_helper = false
  }

  get f() { return this.comment_form.controls }
  get spotbie_comment_text() { return this.comment_form.get('spotbie_comment_text').value }
    
  private pullComments() : void{
    this.current_subject.pullComments(this.comments_ite, this.pullCommentsCallback.bind(this))
  }

  private pullCommentsCallback(comments_response : HttpResponse) : void{

    if(comments_response.status == '200'){

      if(comments_response.responseObject == '0x'){

        this.no_comments = true
        
      } else {

        this.no_comments = false
        this.comments_ite = this.comments_ite + 10
        let comments_list = comments_response.responseObject

        if(comments_list.length > 10){
          comments_list.pop()
          this.load_more = true
        } else {
          this.load_more = false
        }

        comments_list.forEach(comment => {
          this.comment_list.push(comment)
          //console.log("The Comment ", comment)
        })

      }
      this.loading = false
    } else
      console.log("Pull Comments Error : ", comments_response)

  }

  private initCommentsForm(){

    const comment_validators = [Validators.maxLength(360), Validators.required]

    this.comment_form = this.form_builder.group({
      spotbie_comment_text : ['', comment_validators],
    })    

  }

  ngOnInit() : void {

    let logged_in = localStorage.getItem("spotbie_loggedIn")
    this.logged_in_user = localStorage.getItem("spotbie_userId")
    if(logged_in == '1'){
      this.logged_in = true
      this.initCommentsForm()
    } else {
      this.logged_in = false
    }
    
    //console.log("comments_config:", this.comments_config)

    this.pullComments()

  }

}
