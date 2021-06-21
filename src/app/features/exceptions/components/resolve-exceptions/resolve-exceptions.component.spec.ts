import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '@app/auth/auth-service';
import { Task } from '@app/features/exceptions/models/task.model';
import { TaskService } from '@app/features/exceptions/services/task.service';
import { SharedModule } from '@app/shared/shared.module';
import { getByTestId } from '@app/shared/utils/test';
import { GdsTagModule } from '@greensill/gds-ui/tag';
import { MockService } from 'ng-mocks';
import { BehaviorSubject, of } from 'rxjs';

import { ResolveExceptionsComponent } from './resolve-exceptions.component';
import Mocked = jest.Mocked;

describe('ResolveExceptionsComponent', () => {
  let component: ResolveExceptionsComponent;
  let fixture: ComponentFixture<ResolveExceptionsComponent>;
  let taskService: Mocked<TaskService>;
  let mockAuthService: Mocked<AuthService>;
  let dialogRef: Mocked<MatDialogRef<any, any>>;
  const task: Task = {
    id: '1290',
    resourceType: 'CASHFLOW',
    attributes: {
      contractId: '7990f75f-9e3f-4674-ba9f-4a60027d7873',
      contractName: 'Some Contract',
      resourceId: 'cash-1',
      cashflowFileId: 'file-2',
      documentReference: 'Some doc ref',
      issueDate: '2020-09-14T06:30:01.123Z',
      dueDate: '2020-09-14T06:30:01.123Z',
      facilityId: '5ce32270-e63d-4e21-8fea-48fec58de6d4',
      facilityName: 'Some facility',
      primaryEntity: 'Some Primary Entity 22',
      primaryEntityRole: 'Some Primary Role',
      relatedEntity: 'Some Related Entity',
      relatedEntityRole: 'Some Related Entity Role',
      certifiedAmount: 25000,
      certifiedAmountCurrency: 'USD',
      cashflowStatus: 'REJECTED',
    },
    sourceId: '22',
    type: 'MAX_TENOR',
    message: 'Tenor of 61 is greater than the max allowed tenor of 60',
    availableActions: ['OVERRIDE', 'REJECT', 'RELEASE'],
    statusInfo: {
      status: 'RAISED',
      updated: '2020-09-18T09:58:10.023Z',
    },
    createdDate: '2020-09-18T09:58:10.023Z',
    lastActionedBy: 'N/A',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResolveExceptionsComponent],
      imports: [ReactiveFormsModule, GdsTagModule, SharedModule, BrowserAnimationsModule],
      providers: [
        {
          provide: TaskService,
          useValue: taskService = MockService(TaskService) as Mocked<TaskService>,
        },
        {
          provide: AuthService,
          useValue: mockAuthService = MockService(AuthService) as Mocked<AuthService>,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: [task],
        },
        {
          provide: MatDialogRef,
          useValue: dialogRef = {
            close: jest.fn(),
          } as any,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolveExceptionsComponent);
    component = fixture.componentInstance;
    mockAuthService.isAuthorised.mockReturnValue(Promise.resolve(true));
    mockAuthService.getUserName.mockReturnValue(Promise.resolve('user@gs'));
    fixture.detectChanges();
  });

  describe('GIVEN the component has been initialised', () => {
    it('THEN it should create', () => {
      expect(component).toBeTruthy();
    });

    it('THEN the form should be setup', () => {
      jest.spyOn(component, 'setupForm');
      component.ngOnInit();
      expect(component.setupForm).toHaveBeenCalled();
    });
  });

  describe('GIVEN the close side bar close method is clicked', () => {
    it('THEN the sidebar should close', () => {
      jest.spyOn(component.dialogRef, 'close');
      component.onCloseDialogEvent();
      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });

  describe('GIVEN the `Release` action button has been clicked', () => {
    it('THEN the `label`, `status` are set', () => {
      component.action('release', 'IN_REVIEW_RELEASE');
      expect(component.reasonLabel).toBe('release');
      expect(component.status).toBe('IN_REVIEW_RELEASE');
    });

    it('THEN the form is visible', () => {
      component.action('release', 'IN_REVIEW_RELEASE');
      fixture.detectChanges();
      expect(getByTestId(fixture, 'resolve-exceptions-form')).toBeTruthy();
    });
  });

  describe('GIVEN the `REJECT` action is not available in the tasks', () => {
    it('THEN the `reject` action button is not visible', () => {
      component.tasks[0].availableActions = [];
      expect(component.hasAction(null)).toBeFalsy();
      fixture.detectChanges();
      expect(getByTestId(fixture, 'reject')).toBeFalsy();
    });
  });

  describe('GIVEN the `Cancel` action button has been clicked', () => {
    it('THEN the form is invisible', () => {
      component.cancelUpdate();
      fixture.detectChanges();
      expect(getByTestId(fixture, 'resolve-exceptions-form')).toBeFalsy();
    });

    it('THEN the form is reset', () => {
      jest.spyOn(component.form, 'reset');
      component.cancelUpdate();
      expect(component.form.reset).toHaveBeenCalled();
    });
  });

  describe('GIVEN the form is invalid and then submitted', () => {
    it('THEN the api to update the task statuses is not called', () => {
      jest.spyOn(taskService, 'updateTasks');
      component.form.get('reason').patchValue(null);
      component.updateStatus();
      expect(taskService.updateTasks).not.toHaveBeenCalled();
    });
  });

  describe('GIVEN the form is valid and then submitted', () => {
    beforeEach(() => {
      taskService.updateTasks.mockReturnValue(of({ status: 200 }));
      taskService.updateTasksEvent$ = new BehaviorSubject<boolean>(null);
      component.action('release', 'IN_REVIEW_RELEASE');
      component.form.get('reason').patchValue('Some reason');
    });

    it('THEN the api to update the task statuses is called', () => {
      jest.spyOn(taskService, 'updateTasks');
      component.updateStatus();
      expect(taskService.updateTasks).toHaveBeenCalledWith(
        [task.id],
        'IN_REVIEW_RELEASE',
        'Some reason',
      );
    });

    it('THEN the `updateTasksEvent$` event is triggered', async () => {
      jest.spyOn(taskService.updateTasksEvent$, 'next');
      component.updateStatus();
      expect(taskService.updateTasksEvent$.next).toHaveBeenCalled();
    });
  });
});
