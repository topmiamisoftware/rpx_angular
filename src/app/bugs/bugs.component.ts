import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {BugsService} from './bugs.service';

@Component({
  selector: 'app-bugs',
  templateUrl: './bugs.component.html',
  styleUrls: ['./bugs.component.css'],
})
export class BugsComponent implements OnInit {
  public success: boolean = false;

  public submitted: boolean = false;

  public bugsForm: UntypedFormGroup;

  public showSubmitBug: boolean = true;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private bugsService: BugsService
  ) {}

  get f() {
    return this.bugsForm.controls;
  }
  get description() {
    return this.bugsForm.get('description').value;
  }

  public initForm() {
    const description_validators = [
      Validators.minLength(100),
      Validators.maxLength(500),
      Validators.required,
    ];

    this.bugsForm = this.formBuilder.group({
      description: ['', description_validators],
    });
  }

  public insertBug(): void {
    this.submitted = true;

    if (this.bugsForm.invalid) return;

    const bugsObj = {
      description: this.description,
    };

    this.bugsService.insertBug(bugsObj).subscribe(resp => {
      this.insertBugCallback(resp);
    });
  }

  public insertBugCallback(resp: any): void {
    if (resp.success) {
      this.success = true;
      this.showSubmitBug = false;
    } else console.log('insertBugCallback', resp);
  }

  ngOnInit(): void {
    this.initForm();
  }
}
