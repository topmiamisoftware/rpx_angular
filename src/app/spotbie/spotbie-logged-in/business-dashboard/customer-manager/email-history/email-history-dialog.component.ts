import {Component, Inject, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {EmailGroup} from '../models';
import {EmailGroupEntitiesState} from './email-group.state';
import {MatTableModule} from '@angular/material/table';
import {SpotbiePipesModule} from '../../../../../spotbie-pipes/spotbie-pipes.module';
import {AlertDialogComponent} from '../../../../../helpers/alert/alert.component';

@Component({
  selector: 'app-email-history-dialog',
  templateUrl: './email-history-dialog.component.html',
  styleUrls: ['./email-history-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    SpotbiePipesModule,
  ],
})
export class EmailHistoryDialogComponent implements OnInit {
  emailGroupList$: Observable<EmailGroup[]> =
    this.emailGroupEntitiesState.entitiesArray$;

  displayedColumns: string[] = [
    'total',
    'total_sent',
    'email_body',
    'created_at',
  ];

  constructor(
    public dialogRef: MatDialogRef<EmailHistoryDialogComponent>,
    private emailGroupEntitiesState: EmailGroupEntitiesState,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.emailGroupEntitiesState.getEmailGroupList();
  }

  viewGroup(emailGroup: EmailGroup) {
    this.matDialog.open(AlertDialogComponent, {
      data: {
        alertTitle: 'Full Email Message',
        alertText: emailGroup.email_body,
      },
    });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
}
