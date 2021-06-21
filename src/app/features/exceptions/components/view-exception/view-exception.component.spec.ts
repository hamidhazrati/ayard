import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GdsTagModule } from '@greensill/gds-ui/tag';

import { ViewExceptionComponent } from './view-exception.component';
import { MockService } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@app/shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TaskService } from '@app/features/exceptions/services/task.service';
import { Task } from '@app/features/exceptions/models/task.model';
import Mocked = jest.Mocked;
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@app/auth/auth-service';
import { MatDividerModule } from '@angular/material/divider';
import { getByTestId, setInputValue } from '@app/shared/utils/test';
import { BehaviorSubject, of, throwError } from 'rxjs';

describe('ViewExceptionsComponent', () => {
  let component: ViewExceptionComponent;
  let fixture: ComponentFixture<ViewExceptionComponent>;
  let taskService: Mocked<TaskService>;
  let dialogRef: Mocked<MatDialogRef<any, any>>;
  const authService = MockService(AuthService);
  let mockAuthService: Mocked<AuthService>;

  const task: Task = {
    id: '1290',
    resourceType: 'CASHFLOW',
    primaryEntity: 'Some Primary Entity 22',
    relatedEntity: 'Some Related Entity',
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
    status: 'RAISED',
    statusInfo: {
      status: 'RAISED',
      updated: '2020-09-18T09:58:10.023Z',
    },
    createdDate: '2020-09-18T09:58:10.023Z',
    lastActionedBy: 'N/A',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatTableModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatIconModule,
        FormsModule,
        SharedModule,
        MatTabsModule,
        MatTableModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatPaginatorModule,
        NoopAnimationsModule,
        GdsTagModule,
      ],
      declarations: [ViewExceptionComponent],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService = MockService(AuthService) as Mocked<AuthService>,
        },
        {
          provide: TaskService,
          useValue: taskService = MockService(TaskService) as Mocked<TaskService>,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: task,
        },
        {
          provide: MatDialogRef,
          useValue: dialogRef = {
            close: jest.fn(),
          } as any,
        },

        RouterTestingModule,
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    taskService.updateTasksEvent$ = new BehaviorSubject<boolean>(null);
    taskService.updateTasks.mockReturnValue(of({ status: 200 }));
    mockAuthService.getUserName.mockReturnValue(Promise.resolve('user@gs'));
    mockAuthService.isAuthorised.mockReturnValue(Promise.resolve(false));
  }));

  describe('WHEN the component has been initialised', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(ViewExceptionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    test('THEN it should initialise with tasks information', () => {
      expect(component).toBeTruthy();
      expect(component.task).toEqual(task);
    });
  });

  describe('GIVEN the current status is RAISED and logged in user is Maker', () => {
    beforeEach(async () => {
      mockAuthService.isAuthorised = jest
        .fn()
        .mockImplementation((claim) => Promise.resolve(claim === 'cashflow:write'));

      fixture = TestBed.createComponent(ViewExceptionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    test('THEN it should show cancel and actions from availableActions', () => {
      fixture.detectChanges();
      expect(getByTestId(fixture, 'cancel')).toBeTruthy();

      component.task.availableActions = ['RELEASE', 'OVERRIDE', 'REJECT'];
      fixture.detectChanges();

      expect(getByTestId(fixture, 'release')).toBeTruthy();
      expect(getByTestId(fixture, 'override')).toBeTruthy();
      expect(getByTestId(fixture, 'reject')).toBeTruthy();

      component.task.availableActions = ['OVERRIDE', 'REJECT'];
      fixture.detectChanges();

      expect(getByTestId(fixture, 'release')).toBeFalsy();
      expect(getByTestId(fixture, 'override')).toBeTruthy();
      expect(getByTestId(fixture, 'reject')).toBeTruthy();

      component.task.availableActions = ['REJECT'];
      fixture.detectChanges();

      expect(getByTestId(fixture, 'release')).toBeFalsy();
      expect(getByTestId(fixture, 'override')).toBeFalsy();
      expect(getByTestId(fixture, 'reject')).toBeTruthy();

      component.task.availableActions = [];
      fixture.detectChanges();

      expect(getByTestId(fixture, 'release')).toBeFalsy();
      expect(getByTestId(fixture, 'override')).toBeFalsy();
      expect(getByTestId(fixture, 'reject')).toBeFalsy();
    });

    test('THEN it should show reject button as disabled. ', () => {
      fixture.detectChanges();

      const rejectButton = fixture.nativeElement.querySelector('[data-testid="reject"]');
      expect(rejectButton.disabled).toEqual(true);

      const releaseButton = fixture.nativeElement.querySelector('[data-testid="release"]');
      expect(releaseButton.disabled).toEqual(false);

      const overrideButton = fixture.nativeElement.querySelector('[data-testid="override"]');
      expect(overrideButton.disabled).toEqual(false);
    });

    describe('WHEN user clicks on cancel button', () => {
      test('THEN dialog should be closed', () => {
        fixture.detectChanges();
        getByTestId(fixture, 'cancel').nativeElement.click();

        fixture.detectChanges();
        expect(dialogRef.close).toHaveBeenCalled();
      });
    });

    describe('WHEN user click on release button', () => {
      test('THEN reason required error should appear  ', () => {
        fixture.detectChanges();

        getByTestId(fixture, 'release').nativeElement.click();
        fixture.detectChanges();

        getByTestId(fixture, 'confirm').nativeElement.click();
        fixture.detectChanges();

        const errorEl = getByTestId(fixture, `reason-error`);

        expect(errorEl).toBeTruthy();
        expect(errorEl.nativeElement.innerHTML).toContain('Reason required');

        expect(taskService.updateTasks).toHaveBeenCalledTimes(0);
      });

      test('THEN status should be updated and dialog box should be closed', () => {
        fixture.detectChanges();

        getByTestId(fixture, 'release').nativeElement.click();
        fixture.detectChanges();

        setInputValue(getByTestId(fixture, 'reason'), 'reason for migrating');
        fixture.detectChanges();

        expect(getByTestId(fixture, 'reasonLabel').nativeElement.textContent).toBe(
          'Reason for release',
        );
        expect(getByTestId(fixture, 'confirm').nativeElement.textContent.trim()).toBe(
          'Confirm release',
        );

        getByTestId(fixture, 'confirm').nativeElement.click();
        fixture.detectChanges();

        expect(dialogRef.close).toHaveBeenCalled();

        expect(taskService.updateTasks).toHaveBeenCalledWith(
          ['1290'],
          'IN_REVIEW_RELEASE',
          'reason for migrating',
        );
      });
    });

    describe('WHEN user click on override button', () => {
      test('THEN reason required error should appear  ', () => {
        fixture.detectChanges();

        getByTestId(fixture, 'override').nativeElement.click();
        fixture.detectChanges();

        getByTestId(fixture, 'confirm').nativeElement.click();
        fixture.detectChanges();

        const errorEl = getByTestId(fixture, `reason-error`);

        expect(errorEl).toBeTruthy();
        expect(errorEl.nativeElement.innerHTML).toContain('Reason required');

        expect(taskService.updateTasks).toHaveBeenCalledTimes(0);
      });

      test('THEN status should be updated and dialog box should be closed', () => {
        fixture.detectChanges();

        getByTestId(fixture, 'override').nativeElement.click();
        fixture.detectChanges();

        setInputValue(getByTestId(fixture, 'reason'), 'reason for overriding');
        fixture.detectChanges();

        expect(getByTestId(fixture, 'reasonLabel').nativeElement.textContent).toBe(
          'Reason for override',
        );
        expect(getByTestId(fixture, 'confirm').nativeElement.textContent.trim()).toBe(
          'Confirm override',
        );

        getByTestId(fixture, 'confirm').nativeElement.click();
        fixture.detectChanges();

        expect(dialogRef.close).toHaveBeenCalled();

        expect(taskService.updateTasks).toHaveBeenCalledWith(
          ['1290'],
          'IN_REVIEW_OVERRIDE',
          'reason for overriding',
        );
      });
    });

    describe('WHEN user click on release button and gets 409 on updateTask', () => {
      test('THEN error should be displayed', () => {
        taskService.updateTasks.mockReturnValue(throwError({ status: 409 }));
        fixture.detectChanges();

        getByTestId(fixture, 'release').nativeElement.click();
        fixture.detectChanges();

        setInputValue(getByTestId(fixture, 'reason'), 'reason for migrating');
        fixture.detectChanges();

        expect(getByTestId(fixture, 'confirm').nativeElement.textContent.trim()).toBe(
          'Confirm release',
        );

        getByTestId(fixture, 'confirm').nativeElement.click();
        fixture.detectChanges();

        expect(component.showOnStatusConflict).toBe(true);
      });
    });
  });

  describe('GIVEN the current status is RAISED and logged in user is checker', () => {
    beforeEach(async () => {
      mockAuthService.isAuthorised = jest
        .fn()
        .mockImplementation((claim) => Promise.resolve(claim === 'cashflow:approve'));

      fixture = TestBed.createComponent(ViewExceptionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    test('THEN it should show cancel button', () => {
      fixture.detectChanges();
      const cancelButton = getByTestId(fixture, 'cancel');
      expect(cancelButton).toBeTruthy();

      const releaseButton = getByTestId(fixture, 'release');
      expect(releaseButton).toBeFalsy();

      const overrideButton = getByTestId(fixture, 'override');
      expect(overrideButton).toBeFalsy();

      const rejectButton = getByTestId(fixture, 'reject');
      expect(rejectButton).toBeFalsy();
    });
  });

  describe('GIVEN the current status is RAISED and logged in user had read role', () => {
    beforeEach(async () => {
      mockAuthService.isAuthorised = jest
        .fn()
        .mockImplementation((claim) => Promise.resolve(claim === 'cashflow:read'));

      fixture = TestBed.createComponent(ViewExceptionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    test('THEN it should show cancel button', () => {
      fixture.detectChanges();
      const cancelButton = getByTestId(fixture, 'cancel');
      expect(cancelButton).toBeTruthy();

      const releaseButton = getByTestId(fixture, 'release');
      expect(releaseButton).toBeFalsy();

      const overrideButton = getByTestId(fixture, 'override');
      expect(overrideButton).toBeFalsy();

      const rejectButton = getByTestId(fixture, 'reject');
      expect(rejectButton).toBeFalsy();
    });
  });

  describe('GIVEN the current status is not RAISED and logged in user is maker', () => {
    beforeEach(async () => {
      mockAuthService.isAuthorised = jest
        .fn()
        .mockImplementation((claim) => Promise.resolve(claim === 'cashflow:write'));

      fixture = TestBed.createComponent(ViewExceptionComponent);
      component = fixture.componentInstance;
      component.task.status = 'IN_REVIEW_RELEASE';
      fixture.detectChanges();
    });

    test('THEN it should show cancel button', () => {
      fixture.detectChanges();
      const cancelButton = getByTestId(fixture, 'cancel');
      expect(cancelButton).toBeTruthy();

      const releaseButton = getByTestId(fixture, 'release');
      expect(releaseButton).toBeFalsy();

      const overrideButton = getByTestId(fixture, 'override');
      expect(overrideButton).toBeFalsy();

      const rejectButton = getByTestId(fixture, 'reject');
      expect(rejectButton).toBeFalsy();
    });
  });

  describe('GIVEN the current status is not RAISED and logged in user had Read role', () => {
    beforeEach(async () => {
      mockAuthService.isAuthorised = jest
        .fn()
        .mockImplementation((claim) => Promise.resolve(claim === 'cashflow:read'));

      fixture = TestBed.createComponent(ViewExceptionComponent);
      component = fixture.componentInstance;
      component.task.status = 'IN_REVIEW_RELEASE';
      fixture.detectChanges();
    });

    test('THEN it should show cancel button', () => {
      fixture.detectChanges();
      const cancelButton = getByTestId(fixture, 'cancel');
      expect(cancelButton).toBeTruthy();

      const releaseButton = getByTestId(fixture, 'release');
      expect(releaseButton).toBeFalsy();

      const overrideButton = getByTestId(fixture, 'override');
      expect(overrideButton).toBeFalsy();

      const rejectButton = getByTestId(fixture, 'reject');
      expect(rejectButton).toBeFalsy();
    });
  });

  describe('GIVEN the current status is not RAISED and logged user is same as maker', () => {
    beforeEach(async () => {
      mockAuthService.isAuthorised = jest
        .fn()
        .mockImplementation((claim) => Promise.resolve(claim === 'cashflow:approve'));

      fixture = TestBed.createComponent(ViewExceptionComponent);
      component = fixture.componentInstance;
      component.task.status = 'IN_REVIEW_RELEASE';
      component.task.statusInfo.updatedBy = 'user@gs';
      fixture.detectChanges();
    });

    test('THEN it should show cancel button', () => {
      fixture.detectChanges();
      const cancelButton = getByTestId(fixture, 'cancel');
      expect(cancelButton).toBeTruthy();

      const releaseButton = getByTestId(fixture, 'release');
      expect(releaseButton).toBeFalsy();

      const overrideButton = getByTestId(fixture, 'override');
      expect(overrideButton).toBeFalsy();

      const rejectButton = getByTestId(fixture, 'reject');
      expect(rejectButton).toBeFalsy();
    });
  });

  describe('GIVEN the current status is IN_REVIEW_RELEASE and logged in user is checker', () => {
    beforeEach(async () => {
      mockAuthService.isAuthorised = jest
        .fn()
        .mockImplementation((claim) => Promise.resolve(claim === 'cashflow:approve'));

      fixture = TestBed.createComponent(ViewExceptionComponent);
      component = fixture.componentInstance;
      component.task.status = 'IN_REVIEW_RELEASE';
      component.task.statusInfo.updatedBy = 'different-user@gs';
      fixture.detectChanges();
    });

    test('THEN it should show confirm, reject and cancel button', () => {
      fixture.detectChanges();
      const cancelButton = getByTestId(fixture, 'checker-confirm');
      expect(cancelButton).toBeTruthy();

      const releaseButton = getByTestId(fixture, 'checker-reject');
      expect(releaseButton).toBeTruthy();

      const overrideButton = getByTestId(fixture, 'cancel');
      expect(overrideButton).toBeTruthy();
    });

    describe('WHEN user click on Confirm button', () => {
      test('THEN reason required error should appear  ', () => {
        fixture.detectChanges();

        getByTestId(fixture, 'checker-confirm').nativeElement.click();
        fixture.detectChanges();

        getByTestId(fixture, 'confirm').nativeElement.click();
        fixture.detectChanges();

        const errorEl = getByTestId(fixture, `reason-error`);

        expect(errorEl).toBeTruthy();
        expect(errorEl.nativeElement.innerHTML).toContain('Reason required');

        expect(taskService.updateTasks).toHaveBeenCalledTimes(0);
      });

      test('THEN status should be updated and dialog box should be closed', () => {
        fixture.detectChanges();

        getByTestId(fixture, 'checker-confirm').nativeElement.click();
        fixture.detectChanges();

        setInputValue(getByTestId(fixture, 'reason'), 'reason for confirming');
        fixture.detectChanges();

        expect(getByTestId(fixture, 'reasonLabel').nativeElement.textContent).toBe(
          'Reason for confirming',
        );
        expect(getByTestId(fixture, 'confirm').nativeElement.textContent.trim()).toBe('Confirm');

        getByTestId(fixture, 'confirm').nativeElement.click();
        fixture.detectChanges();

        expect(dialogRef.close).toHaveBeenCalled();

        expect(taskService.updateTasks).toHaveBeenCalled();
      });
    });

    describe('WHEN user click on Reject button', () => {
      test('THEN reason required error should appear  ', () => {
        fixture.detectChanges();

        getByTestId(fixture, 'checker-reject').nativeElement.click();
        fixture.detectChanges();

        getByTestId(fixture, 'confirm').nativeElement.click();
        fixture.detectChanges();

        const errorEl = getByTestId(fixture, `reason-error`);

        expect(errorEl).toBeTruthy();
        expect(errorEl.nativeElement.innerHTML).toContain('Reason required');

        expect(taskService.updateTasks).toHaveBeenCalledTimes(0);
      });

      test('THEN status should be updated and dialog box should be closed', () => {
        fixture.detectChanges();

        getByTestId(fixture, 'checker-reject').nativeElement.click();
        fixture.detectChanges();

        setInputValue(getByTestId(fixture, 'reason'), 'reason for rejecting');
        fixture.detectChanges();
        expect(getByTestId(fixture, 'reasonLabel').nativeElement.textContent).toBe(
          'Reason for rejecting',
        );
        expect(getByTestId(fixture, 'confirm').nativeElement.textContent.trim()).toBe(
          'Confirm rejection',
        );

        getByTestId(fixture, 'confirm').nativeElement.click();
        fixture.detectChanges();

        expect(dialogRef.close).toHaveBeenCalled();

        expect(taskService.updateTasks).toHaveBeenCalledWith(
          ['1290'],
          'RAISED',
          'reason for rejecting',
        );
      });
    });

    describe('WHEN user clicks on action button and clicks on cancel', () => {
      test('THEN no reason textbox should appear', () => {
        fixture.detectChanges();

        getByTestId(fixture, 'checker-confirm').nativeElement.click();
        fixture.detectChanges();

        getByTestId(fixture, 'confirm-cancel').nativeElement.click();
        fixture.detectChanges();

        expect(component.showConfirmTextbox).toBe(false);
        expect(component.form.controls.reason.value).toBe('');
      });
    });

    describe('WHEN user clicks on confirm button and gets 409 on updateTask', () => {
      test('THEN error should be displayed', () => {
        taskService.updateTasks.mockReturnValue(throwError({ status: 409 }));
        fixture.detectChanges();

        getByTestId(fixture, 'checker-confirm').nativeElement.click();
        fixture.detectChanges();

        setInputValue(getByTestId(fixture, 'reason'), 'reason for confirming');
        fixture.detectChanges();

        expect(getByTestId(fixture, 'confirm').nativeElement.textContent.trim()).toBe('Confirm');

        getByTestId(fixture, 'confirm').nativeElement.click();
        fixture.detectChanges();

        expect(component.showOnStatusConflict).toBe(true);
      });
    });
  });

  describe('GIVEN the current status is IN_REVIEW_OVERRIDE and logged in user is checker', () => {
    beforeEach(async () => {
      mockAuthService.isAuthorised = jest
        .fn()
        .mockImplementation((claim) => Promise.resolve(claim === 'cashflow:approve'));

      fixture = TestBed.createComponent(ViewExceptionComponent);
      component = fixture.componentInstance;
      component.task.status = 'IN_REVIEW_OVERRIDE';
      component.task.statusInfo.updatedBy = 'different-user@gs';
      fixture.detectChanges();
    });

    test('THEN it should show confirm, reject and cancel button', () => {
      fixture.detectChanges();
      const cancelButton = getByTestId(fixture, 'checker-confirm');
      expect(cancelButton).toBeTruthy();

      const releaseButton = getByTestId(fixture, 'checker-reject');
      expect(releaseButton).toBeTruthy();

      const overrideButton = getByTestId(fixture, 'cancel');
      expect(overrideButton).toBeTruthy();
    });

    describe('WHEN user click on Confirm button', () => {
      test('THEN reason required error should appear  ', () => {
        fixture.detectChanges();

        getByTestId(fixture, 'checker-confirm').nativeElement.click();
        fixture.detectChanges();

        getByTestId(fixture, 'confirm').nativeElement.click();
        fixture.detectChanges();

        const errorEl = getByTestId(fixture, `reason-error`);

        expect(errorEl).toBeTruthy();
        expect(errorEl.nativeElement.innerHTML).toContain('Reason required');

        expect(taskService.updateTasks).toHaveBeenCalledTimes(0);
      });

      test('THEN status should be updated and dialog box should be closed', () => {
        fixture.detectChanges();

        getByTestId(fixture, 'checker-confirm').nativeElement.click();
        fixture.detectChanges();

        setInputValue(getByTestId(fixture, 'reason'), 'reason for confirming');
        fixture.detectChanges();

        expect(getByTestId(fixture, 'reasonLabel').nativeElement.textContent).toBe(
          'Reason for confirming',
        );
        expect(getByTestId(fixture, 'confirm').nativeElement.textContent.trim()).toBe('Confirm');

        getByTestId(fixture, 'confirm').nativeElement.click();
        fixture.detectChanges();

        expect(dialogRef.close).toHaveBeenCalled();

        expect(taskService.updateTasks).toHaveBeenCalled();
      });
    });

    describe('WHEN user click on Reject button', () => {
      test('THEN reason required error should appear  ', () => {
        fixture.detectChanges();

        getByTestId(fixture, 'checker-reject').nativeElement.click();
        fixture.detectChanges();

        getByTestId(fixture, 'confirm').nativeElement.click();
        fixture.detectChanges();

        const errorEl = getByTestId(fixture, `reason-error`);

        expect(errorEl).toBeTruthy();
        expect(errorEl.nativeElement.innerHTML).toContain('Reason required');

        expect(taskService.updateTasks).toHaveBeenCalledTimes(0);
      });

      test('THEN status should be updated and dialog box should be closed', () => {
        fixture.detectChanges();

        getByTestId(fixture, 'checker-reject').nativeElement.click();
        fixture.detectChanges();

        setInputValue(getByTestId(fixture, 'reason'), 'reason for rejecting');
        fixture.detectChanges();
        expect(getByTestId(fixture, 'reasonLabel').nativeElement.textContent).toBe(
          'Reason for rejecting',
        );
        expect(getByTestId(fixture, 'confirm').nativeElement.textContent.trim()).toBe(
          'Confirm rejection',
        );

        getByTestId(fixture, 'confirm').nativeElement.click();
        fixture.detectChanges();

        expect(dialogRef.close).toHaveBeenCalled();

        expect(taskService.updateTasks).toHaveBeenCalledWith(
          ['1290'],
          'RAISED',
          'reason for rejecting',
        );
      });
    });
  });
});
