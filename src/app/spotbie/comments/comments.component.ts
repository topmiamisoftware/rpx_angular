import { Component, OnInit, Input } from '@angular/core'
import { I_CommentSubject } from './comment-interface/comment-subject.interface'
import { ToastResponse } from '../../helpers/toast-helper/toast-models/toast-response'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ToastRequest } from 'src/app/helpers/toast-helper/toast-models/toast-request'
import { Comment } from './comment-model/comment'

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  @Input() current_subject: I_CommentSubject

  @Input() comments_config: any

  public logged_in: boolean = false
  
  public logged_in_user: string

  private comments_page: number = 1

  public load_more: boolean = false

  public loading: boolean = false

  public comment_list: Array<Comment> = []

  public no_comments: boolean = false

  public comment_form: FormGroup

  public comment_submitted: boolean = false

  public toast_helper: boolean = false

  private current_comment: Comment

  public toast_helper_config: ToastRequest = {
      type: "confirm",
      text: {
        info_text: "",
        confirm: "Yes",
        decline: "No",
      },
      actions: {
        confirm: this.deleteComment.bind(this),
        decline: this.cancelCommentDelete.bind(this),
        acknowledge: this.commentDeleted.bind(this)
      }
  }

  constructor(private form_builder: FormBuilder) { }

  private cancelCommentDelete(): void {
    this.current_comment = null
    this.toast_helper = false
  }

  public deleteCommentInit(comment: Comment): void {
    this.current_comment = comment
    this.toast_helper_config.type = "confirm"
    this.toast_helper_config.text.info_text = "Are you sure you want to delete this comment?"
    this.toast_helper = true
  }

  private deleteComment(){
    this.loading = true
    this.current_subject.deleteComment(this.current_comment.id).subscribe(
      resp =>{
        this.deleteCommentCallback(resp)
      },
      error =>{
        console.log("deleteComment", error)
      }
    )
  }

  private deleteCommentCallback(delete_comment_response: any): void {

    if(delete_comment_response.message == 'success'){

      this.toast_helper_config.type = "acknowledge"
      this.toast_helper_config.text.info_text = "Your comment was deleted."

    } else {

      this.toast_helper_config.type = "acknowledge"
      this.toast_helper_config.text.info_text = "There was an error deleting your comment."       
      console.log("deleteCommentCallback Error: ", delete_comment_response)
    
    }
    
    this.toast_helper = true
    this.loading = false

  }

  public commentDeleted(): void {
    let i = this.comment_list.indexOf(this.current_comment)
    this.comment_list.splice(i, 1)
  }

  public addComment(): void {

    if (this.comment_submitted) return; else this.comment_submitted = true

    if (this.comment_form.invalid) return

    this.loading = true

    let comment = this.spotbie_comment_text

    this.current_subject.addComment(comment).subscribe(
      resp =>{
        this.addCommentCallback(resp)
      },
      error =>{
        console.log("addComment", error)
      }
    )

  }

  private addCommentCallback(add_comment_response: any): void{

      if(add_comment_response.message == 'success'){
        this.comments_page = 0
        this.pullComments()
      } else {
        console.log("addAlbumMediaCommentCallback : ", add_comment_response)
      }

  }

  public dismissToast(toast_response ?: ToastResponse): void{

    if(typeof toast_response.callback == "function"){
      toast_response.callback()
    }

    this.toast_helper = false

  }

  get f() { return this.comment_form.controls }
  get spotbie_comment_text() { return this.comment_form.get('spotbie_comment_text').value }
    
  private pullComments(): void{

    this.current_subject.pullComments(this.comments_page).subscribe(
      resp =>{
        this.pullCommentsCallback(resp)
      },
      error =>{
        console.log("pullComments", error)
      }
    )

  }

  private pullCommentsCallback(comments_response: any): void{

    console.log("comments_response", comments_response)

    if(comments_response.message == 'no_comments'){

      this.no_comments = true
      
    } else if(comments_response.message == 'success'){

      this.no_comments = false
      
      const current_page = comments_response.comment_list.current_page
      const last_page = comments_response.comment_list.last_page
      
      let comments_list = comments_response.comment_list.data

      if(current_page < last_page){
        this.load_more = true
        this.comments_page++
        console.log("comments page", this.comments_page)
      } else
        this.load_more = false

      comments_list.forEach(comment => {
        this.comment_list.push(comment)
      })

      console.log("comment llist", this.comment_list)

    }

    this.loading = false

  }

  private initCommentsForm(){

    const comment_validators = [Validators.maxLength(360), Validators.required]

    this.comment_form = this.form_builder.group({
      spotbie_comment_text: ['', comment_validators],
    })    

  }

  ngOnInit(): void {

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
