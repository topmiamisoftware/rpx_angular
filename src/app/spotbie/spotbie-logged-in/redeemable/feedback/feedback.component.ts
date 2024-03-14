import {Component, Inject, OnInit} from '@angular/core';
import {LoyaltyPointsService} from '../../../../services/loyalty-points/loyalty-points.service';
import {Feedback} from '../../../../models/feedback';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {CommonModule} from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
  ],
})
export class FeedbackComponent implements OnInit {
  feedbackForm: UntypedFormGroup;
  formSavedFailed$ = new BehaviorSubject(false);
  formSavedSuccessfully$ = new BehaviorSubject(false);
  formSubmitted$ = new BehaviorSubject(false);

  constructor(
    private feedbackService: LoyaltyPointsService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FeedbackComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {feedback: Feedback; ledgerId: string; businessName: string}
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.feedbackForm = this.formBuilder.group({
      feedbackText: [
        '',
        [
          Validators.required,
          Validators.maxLength(1500),
          Validators.minLength(100),
        ],
      ],
    });

    console.log('feedbackText', this.data.feedback);

    if (this.data.feedback?.feedback_text) {
      this.feedbackForm
        .get('feedbackText')
        .setValue(this.data.feedback.feedback_text);
    }
  }

  get feedbackText() {
    return this.feedbackForm.get('feedbackText').value;
  }

  get f() {
    return this.feedbackForm.controls;
  }

  cancel() {
    this.dialogRef.close({data: {role: 'cancel'}});
  }

  confirm() {
    this.formSubmitted$.next(true);

    if (this.data.feedback?.uuid) {
      this.updateFeedback();
    } else {
      this.saveFeedback();
    }
  }

  saveFeedback() {
    if (this.feedbackForm.invalid) {
      return;
    }

    this.feedbackService
      .saveFeedback(this.feedbackText, this.data.ledgerId)
      .subscribe(resp => {
        if (resp) {
          this.formSavedSuccessfully$.next(true);
          setTimeout(
            () =>
              this.dialogRef.close({
                feedback: resp.feedback,
                role: 'feedback_sent',
              }),
            1500
          );
        } else {
          this.formSavedFailed$.next(true);
        }
      });
  }

  updateFeedback() {
    this.feedbackService
      .updateFeedback(this.feedbackText, this.data.feedback.uuid)
      .subscribe(
        resp => {
          this.formSavedSuccessfully$.next(true);
          setTimeout(
            () =>
              this.dialogRef.close({
                feedback: {feedback_text: this.feedbackText},
                role: 'feedback_updated',
              }),
            1500
          );
        },
        error => {
          this.formSavedFailed$.next(true);
          setTimeout(
            () => this.dialogRef.close({data: {role: 'feedback_not_sent'}}),
            1500
          );
        }
      );
  }
}
