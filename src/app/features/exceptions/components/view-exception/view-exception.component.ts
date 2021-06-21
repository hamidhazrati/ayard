import { Component, Inject, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Task } from '../../models/task.model';
import { TrimFormControl } from '@app/shared/form/trim-form-control';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/auth/auth-service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-view-exception',
  templateUrl: './view-exception.component.html',
  styleUrls: ['./view-exception.component.scss'],
})
export class ViewExceptionComponent implements OnInit {
  form: FormGroup;

  isMaker = false;
  isChecker = false;
  showConfirmTextbox = false;
  showOnStatusConflict = false;
  updateTaskErrorMessage = 'Error has occured while performing operation. Try again later.';
  userName = '';
  buttonDisplayActionText = '';
  reasonLabel = '';
  taskStatus: string;

  errors = {
    required: ({ label }) => {
      return `Reason required`;
    },
    maxlength: ({ label }) => {
      return `Maximum length 512 exceeded.`;
    },
  };

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public task: Task,
    public dialogRef: MatDialogRef<ViewExceptionComponent, Task>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private taskService: TaskService,
  ) {
    this.form = this.formBuilder.group({
      reason: new TrimFormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.isUserMaker();
    this.isUserChecker();
    this.setUserName();
  }

  isUserMaker() {
    this.authService.isAuthorised('cashflow:write').then((maker) => (this.isMaker = maker));
  }

  isUserChecker() {
    this.authService.isAuthorised('cashflow:approve').then((checker) => (this.isChecker = checker));
  }

  setUserName() {
    this.authService.getUserName().then((user) => (this.userName = user));
  }

  public onCloseDialogEvent() {
    this.dialogRef.close();
  }

  release() {
    this.showConfirmTextbox = true;
    this.buttonDisplayActionText = 'release';
    this.reasonLabel = 'release';
    this.taskStatus = 'IN_REVIEW_RELEASE';
  }
  override() {
    this.showConfirmTextbox = true;
    this.buttonDisplayActionText = 'override';
    this.reasonLabel = 'override';
    this.taskStatus = 'IN_REVIEW_OVERRIDE';
  }
  reject() {
    this.showConfirmTextbox = true;
    this.buttonDisplayActionText = 'rejection';
    this.reasonLabel = 'rejecting';
    this.taskStatus = 'IN_REVIEW_REJECT';
  }

  checkerConfirm() {
    this.showConfirmTextbox = true;
    this.buttonDisplayActionText = '';
    this.reasonLabel = 'confirming';

    switch (this.task.statusInfo.status) {
      case 'IN_REVIEW_RELEASE':
        this.taskStatus = 'RELEASE';
        break;
      case 'IN_REVIEW_OVERRIDE':
        this.taskStatus = 'OVERRIDE';
        break;
      case 'IN_REVIEW_REJECT':
        this.taskStatus = 'REJECT';
        break;
    }
  }

  checkerReject() {
    this.showConfirmTextbox = true;
    this.buttonDisplayActionText = 'rejection';
    this.reasonLabel = 'rejecting';
    this.taskStatus = 'RAISED';
  }

  cancelConfirmBox() {
    this.showConfirmTextbox = false;
    this.form.controls.reason.setValue('');
  }

  getStatusToDisplay(status: string) {
    return status.split('_').join(' ');
  }

  hasAction(action: string) {
    return this.task.availableActions.includes(action);
  }

  updateStatus() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }
    this.taskService
      .updateTasks([this.task.id], this.taskStatus, this.form.controls.reason.value)
      .pipe(take(1))
      .subscribe(
        () => {
          this.taskService.updateTasksEvent$.next(true);
          this.onCloseDialogEvent();
        },
        (error) => {
          this.showOnStatusConflict = true;
          if (error.status === 409) {
            this.updateTaskErrorMessage =
              'The status of this task has already changed and this action is no longer available';
          }
        },
      );
  }
}
