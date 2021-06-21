import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '@app/auth/auth-service';
import { Task } from '@app/features/exceptions/models/task.model';
import { TaskService } from '@app/features/exceptions/services/task.service';
import { from } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-resolve-exceptions',
  templateUrl: './resolve-exceptions.component.html',
  styleUrls: ['./resolve-exceptions.component.scss'],
})
export class ResolveExceptionsComponent implements OnInit {
  public reasonLabel = '';
  public btnLabel = '';
  public status = '';
  public serverError = '';
  public showForm = false;
  public allTasksNotUpdatedByUser: boolean;
  public form: FormGroup = this.setupForm();
  public isMaker = false;
  public isChecker = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public tasks: Task[],
    public dialogRef: MatDialogRef<ResolveExceptionsComponent, Task[]>,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    this.isUserMaker();
    this.isUserChecker();
    this.checkTasksNotUpdatedByUser();
    this.setupForm();
  }

  public isUserMaker(): void {
    this.authService.isAuthorised('cashflow:write').then((maker) => (this.isMaker = maker));
  }

  public isUserChecker(): void {
    this.authService.isAuthorised('cashflow:approve').then((checker) => (this.isChecker = checker));
  }

  public isRaised(): boolean {
    return this.tasks[0].statusInfo.status === 'RAISED';
  }

  public checkTasksNotUpdatedByUser(): void {
    from(this.authService.getUserName())
      .pipe(take(1))
      .subscribe((userName: string) => {
        const tasksUpdatedBy: string[] = this.tasks.map((task: Task) => task.statusInfo.updatedBy);
        this.allTasksNotUpdatedByUser = !tasksUpdatedBy.includes(userName);
      });
  }

  public setupForm(): FormGroup {
    return this.formBuilder.group({
      reason: ['', Validators.required],
    });
  }

  public onCloseDialogEvent(): void {
    this.dialogRef.close();
  }

  public action(label: string, status: string, btnLabel?: string): void {
    this.reasonLabel = label;
    this.status = status;
    this.btnLabel = btnLabel || label;
    this.showForm = true;
  }

  public hasAction(action: string): boolean {
    return this.tasks[0].availableActions.includes(action);
  }

  private calculateStatus(): string {
    return this.tasks[0].statusInfo.status.replace('IN_REVIEW_', '');
  }

  public confirm(): void {
    this.action('confirming', this.calculateStatus(), ' ');
  }

  public reject(): void {
    this.action('rejecting', 'RAISED', 'rejection');
  }

  public cancelUpdate(): void {
    this.showForm = false;
    this.form.reset();
  }

  public updateStatus(): void {
    if (this.form.valid) {
      const taskIds: string[] = this.tasks.map((task: Task) => task.id);

      this.taskService
        .updateTasks(taskIds, this.status, this.form.get('reason').value)
        .pipe(take(1))
        .subscribe(
          () => {
            this.taskService.updateTasksEvent$.next(true);
            this.onCloseDialogEvent();
          },
          (error) => {
            if (error.status === 409) {
              this.serverError =
                'The status of this task has already changed and this action is no longer available';
            }
          },
        );
    }
  }
}
