import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@app/auth/auth-service';
import { ContractService } from '@app/features/contracts/services/contract.service';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Page } from '@app/shared/pagination';
import { TitleCaseFormatPipe } from '@app/shared/pipe/titlecase-format.pipe';
import { CashflowFile } from '@cashflows/models';
import { GdsDataTableModule } from '@greensill/gds-ui/data-table';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { CashflowDataService } from '../../services/cashflow-data.service';

import { ListCashflowFilesComponent } from './list-cashflow-files.component';
import { listCashflowFilesCrumb } from './list-cashflow-files.crumb';
import Mocked = jest.Mocked;

describe('ListCashflowFilesComponent', () => {
  let component: ListCashflowFilesComponent;
  let fixture: ComponentFixture<ListCashflowFilesComponent>;
  let crumbService: Mocked<CrumbService>;
  let cashflowDataService: Mocked<CashflowDataService>;
  let contractService: Mocked<ContractService>;
  let matDialog: Mocked<MatDialog>;
  let mockAuthService: Mocked<AuthService>;

  const cashflowfiles: CashflowFile[] = [
    {
      id: 'b1e400e5-a512-437e-8cf1-422bc083b175',
      clientName: 'Katerra Inc',
      filename: 'A test cashflow file.xlsx',
      uploadDate: '2020-07-08T12:59:08.029821Z',
      uploadedBy: 'Operations Portal',
      status: 'Pending Processing',
      cashflowRowCount: 10,
      processingFailureMessages: null,
    },
  ];

  const page: Page<CashflowFile> = {
    data: cashflowfiles,
    meta: {
      paged: {
        size: 1,
        page: 0,
        totalPages: 1,
        pageSize: 10,
        totalSize: 1,
      },
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        GdsDataTableModule,
        HttpClientTestingModule,
        MatPaginatorModule,
        MatTableModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      declarations: [ListCashflowFilesComponent, TitleCaseFormatPipe],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService = MockService(AuthService) as Mocked<AuthService>,
        },
        {
          provide: CrumbService,
          useValue: crumbService = MockService(CrumbService) as Mocked<CrumbService>,
        },
        {
          provide: CashflowDataService,
          useValue: cashflowDataService = MockService(CashflowDataService) as Mocked<
            CashflowDataService
          >,
        },
        {
          provide: ContractService,
          useValue: contractService = MockService(ContractService) as Mocked<ContractService>,
        },
        { provide: MatDialog, useValue: matDialog = MockService(MatDialog) as Mocked<MatDialog> },
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    mockAuthService.isAuthorised.mockReturnValue(new Promise((resolve, reject) => resolve(true)));
  }));

  beforeEach(() => {
    cashflowDataService.getCashflowFiles.mockReturnValue(of());

    fixture = TestBed.createComponent(ListCashflowFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    cashflowDataService.getCashflowFiles.mockClear();
  });

  describe('GIVEN the component has been initialised', () => {
    test('THEN it should set breadcrumbs', () => {
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(listCashflowFilesCrumb());
    });

    test('THEN it should initialise with cashflows', () => {
      cashflowDataService.getCashflowFiles.mockReturnValue(of(page));
      component.ngOnInit();
      expect(component.rows).toEqual(cashflowfiles);
    });

    test('THEN the counter parties should not be fetching', async () => {
      expect(component.isFetchingCounterParties).toBeFalsy();
    });

    test('THEN I can open the dialogue window', async () => {
      contractService.getSellerCounterparties.mockReturnValue(of(['Katerra Inc']));
      const uploadButton = fixture.nativeElement.querySelector('[data-testid="upload-cashflow"]');
      fixture.detectChanges();

      expect(uploadButton.disabled).toEqual(false);
      uploadButton.click();
      expect(matDialog.open).toHaveBeenCalled();
    });
  });
});
