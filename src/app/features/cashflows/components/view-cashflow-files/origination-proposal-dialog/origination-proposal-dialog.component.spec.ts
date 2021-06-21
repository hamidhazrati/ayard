import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginationProposalDialogComponent } from './origination-proposal-dialog.component';
import { SharedModule } from '@app/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { CashflowDataService } from '@cashflows/services/cashflow-data.service';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { getByTestId } from '@app/shared/utils/test';
import { of } from 'rxjs';
import { CashflowStatusUpdate } from '@app/features/cashflows/models/cashflow-file';

describe('OriginationProposalDialogComponent', () => {
  let component: OriginationProposalDialogComponent;
  let fixture: ComponentFixture<OriginationProposalDialogComponent>;
  let cashflowDataService: Mocked<CashflowDataService>;
  let matDialogRef: MatDialogRef<OriginationProposalDialogComponent>;

  const data = {
    data: {
      cashflowFile: {
        id: 'b1e400e5-a512-437e-8cf1-422bc083b175',
        clientName: 'Katerra Inc',
        filename: 'A test cashflow file.xlsx',
        uploadDate: '2020-07-08T12:59:08.029821Z',
        uploadedBy: 'Operations Portal',
        status: 'Pending Processing',
        cashflowRowCount: 10,
        processingFailureMessages: [],
        cashflowTotals: [],
        rejectionDetail: null,
      },
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OriginationProposalDialogComponent],
      imports: [
        SharedModule,
        MatDialogModule,
        MatProgressBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        {
          provide: CashflowDataService,
          useValue: cashflowDataService = MockService(CashflowDataService) as Mocked<
            CashflowDataService
          >,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: data.data,
        },
        {
          provide: MatDialogRef,
          useValue: matDialogRef = MockService(MatDialogRef) as Mocked<
            MatDialogRef<OriginationProposalDialogComponent>
          >,
        },
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OriginationProposalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('WHEN I press confirm ', () => {
    test('THEN a request is made to set state to AWAITING_INTERNAL_APPROVAL', () => {
      cashflowDataService.updateCashflowStatus.mockReturnValue(of(data.data.cashflowFile));
      getByTestId(fixture, 'confirm-proposal').nativeElement.click();
      const processingStatus: CashflowStatusUpdate = {
        status: 'AWAITING_INTERNAL_APPROVAL',
      } as CashflowStatusUpdate;
      fixture.detectChanges();
      expect(cashflowDataService.updateCashflowStatus).toHaveBeenCalledWith(
        data.data.cashflowFile.id,
        processingStatus,
      );
      expect(matDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('WHEN I press cancel ', () => {
    test('THEN the window closes', () => {
      getByTestId(fixture, 'cancel-proposal').nativeElement.click();
      fixture.detectChanges();

      expect(matDialogRef.close).toHaveBeenCalled();
    });
  });
});
