import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutService } from '@app/core/services/layout.service';
import { listExceptionsCrumb } from '@app/features/exceptions/components/list-exceptions/list-exceptions.crumb';
import { ViewExceptionComponent } from '@app/features/exceptions/components/view-exception/view-exception.component';
import { Task } from '@app/features/exceptions/models/task.model';
import { TaskService } from '@app/features/exceptions/services/task.service';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { SideBarDialogService } from '@app/shared/components/side-bar-dialog/side-bar-dialog.service';
import { Page } from '@app/shared/pagination';
import { GdsDataTableModule, GdsSortEvent, SortDirection } from '@greensill/gds-ui/data-table';
import { MockService } from 'ng-mocks';
import { BehaviorSubject, of } from 'rxjs';

import { ListExceptionsComponent } from './list-exceptions.component';
import Mocked = jest.Mocked;

describe('ListExceptionsComponent', () => {
  let component: ListExceptionsComponent;
  let fixture: ComponentFixture<ListExceptionsComponent>;
  let crumbService: Mocked<CrumbService>;
  let sideBarDialogService: Mocked<SideBarDialogService>;
  let taskService: Mocked<TaskService>;
  let layoutService: Mocked<LayoutService>;

  const tasks: Task[] = [
    {
      id: '1234',
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
    },
    {
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
      sourceId: '33',
      type: 'MAX_TENOR',
      message: 'Tenor of 61 is greater than the max allowed tenor of 60',
      availableActions: ['OVERRIDE', 'REJECT', 'RELEASE'],
      statusInfo: {
        status: 'IN_REVIEW_RELEASE',
        updated: '2020-09-19T09:58:10.023Z',
        updatedBy: 'maker',
        reason: 'valid reason',
      },
      previousStatuses: [
        {
          status: 'RAISED',
          updated: '2020-09-18T09:58:10.023Z',
        },
      ],
      createdDate: '2020-09-18T09:58:10.023Z',
      lastActionedBy: 'N/A',
    },
  ];

  const page: Page<Task> = {
    data: tasks,
    meta: {
      paged: {
        size: 2,
        page: 0,
        totalPages: 1,
        pageSize: 10,
        totalSize: 2,
      },
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatPaginatorModule,
        NoopAnimationsModule,
        GdsDataTableModule,
        MatProgressSpinnerModule,
      ],
      declarations: [ListExceptionsComponent],
      providers: [
        {
          provide: CrumbService,
          useValue: crumbService = MockService(CrumbService) as Mocked<CrumbService>,
        },
        {
          provide: TaskService,
          useValue: taskService = MockService(TaskService) as Mocked<TaskService>,
        },
        {
          provide: SideBarDialogService,
          useValue: sideBarDialogService = MockService(SideBarDialogService) as Mocked<
            SideBarDialogService
          >,
        },
        {
          provide: LayoutService,
          useValue: layoutService = MockService(LayoutService) as Mocked<LayoutService>,
        },
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    taskService.updateTasksEvent$ = new BehaviorSubject<boolean>(null);
    taskService.getTasks.mockReturnValue(of(page));
    fixture = TestBed.createComponent(ListExceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    taskService.getTasks.mockClear();
  });

  describe('GIVEN the component has been initialised', () => {
    test('THEN it should set breadcrumbs', () => {
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(listExceptionsCrumb());
    });

    test('THEN it should set hide body grid', () => {
      expect(layoutService.showBodyGrid).toHaveBeenCalledWith(false);
    });

    test('THEN it should initialise with tasks', () => {
      jest.spyOn(component, 'getTasks');
      component.ngOnInit();
      expect(component.getTasks).toHaveBeenCalled();
    });
  });

  describe('GIVEN tasks have been requested', () => {
    test('THEN the task service should be invoked', () => {
      jest.spyOn(taskService, 'getTasks');
      component.getTasks();
      expect(taskService.getTasks).toHaveBeenCalled();
    });

    test('THEN table rows should be set', () => {
      component.getTasks();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.rows.length).toBe(2);
        expect(component.rows).toBe(page.data);
      });
    });
  });

  describe('GIVEN an exception has been clicked', () => {
    test('THEN the sidebar should open', () => {
      jest.spyOn(sideBarDialogService, 'open');
      component.openSideBar(tasks[0]);
      expect(sideBarDialogService.open).toHaveBeenCalledWith(ViewExceptionComponent, tasks[0], 500);
    });
  });

  describe('GIVEN a user sorts the data table', () => {
    const sortEvent: GdsSortEvent = {
      newValue: '',
      prevValue: '',
      sorts: [
        {
          dir: SortDirection.desc,
          prop: 'createdDate',
        },
      ],
    };

    test('THEN sorting has been defined', () => {
      jest.spyOn(component, 'getTasks');
      component.sort(sortEvent);
      expect(component.sorting).toBe(sortEvent.sorts[0]);
      expect(component.getTasks).toHaveBeenCalled();
    });

    test('THEN the api is invoked with sorting', () => {
      fixture.whenStable().then(() => {
        const params: HttpParams = new HttpParams({
          fromObject: {
            page: '0',
            size: '10',
            sort: `${sortEvent.sorts[0].prop},${sortEvent.sorts[0].dir}`,
          },
        });

        jest.spyOn(taskService, 'getTasks');
        component.sort(sortEvent);
        expect(taskService.getTasks).toHaveBeenCalledWith(params);
      });
    });
  });

  describe('GIVEN an exception status has been updated', () => {
    test('THEN fetch and reload exceptions list', () => {
      jest.spyOn(component, 'getTasks');
      taskService.updateTasksEvent$.next(true);
      expect(component.getTasks).toHaveBeenCalledWith();
    });
  });
});
