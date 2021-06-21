import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RejectCashflowDialogComponent } from './reject-cashflow-dialog.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CashflowDataService } from '../../../services/cashflow-data.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RejectCashflowDialogComponent', () => {
  let component: RejectCashflowDialogComponent;
  let fixture: ComponentFixture<RejectCashflowDialogComponent>;
  let matDialogRef: MatDialogRef<RejectCashflowDialogComponent>;
  let cashflowDataService: CashflowDataService;

  const data = {
    data: {
      cashflowFileId: 'ada2b92f-9e33-48da-ab13-7b00a1efea49',
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RejectCashflowDialogComponent],
      imports: [HttpClientTestingModule, SharedModule, NoopAnimationsModule, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: data,
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
        CashflowDataService,
      ],
    }).compileComponents();

    matDialogRef = TestBed.inject(MatDialogRef);
    cashflowDataService = TestBed.inject(CashflowDataService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectCashflowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reject file', () => {
    const cashflowFile = {
      id: 'b1e400e5-a512-437e-8cf1-422bc083b175',
      clientName: 'Katerra Inc',
      filename: 'A test cashflow file.xlsx',
      uploadDate: '2020-07-08T12:59:08.029821Z',
      uploadedBy: 'Operations Portal',
      cashflowRowCount: null,
      status: 'PENDING_PROCESSING',
      processingFailureMessages: [],
    };
    jest.spyOn(matDialogRef, 'close');
    jest.spyOn(cashflowDataService, 'updateCashflowStatus').mockReturnValue(of(cashflowFile));
    component.rejectFile();
    expect(cashflowDataService.updateCashflowStatus).toHaveBeenCalled();
    expect(matDialogRef.close).toHaveBeenCalled();
  });

  it('should throw an error due to unsuccessful upload', () => {
    jest
      .spyOn(cashflowDataService, 'updateCashflowStatus')
      .mockReturnValue(throwError({ statusText: 'Server error.' }));

    component.rejectFile();
    expect(cashflowDataService.updateCashflowStatus).toHaveBeenCalled();
    expect(component.serverError).toEqual(`Unable to reject cashflow file Server error.`);
  });

  it('should close dialogue upon clicking on "cancel"', () => {
    jest.spyOn(matDialogRef, 'close');
    component.cancel();
    expect(matDialogRef.close).toHaveBeenCalled();
  });
});
