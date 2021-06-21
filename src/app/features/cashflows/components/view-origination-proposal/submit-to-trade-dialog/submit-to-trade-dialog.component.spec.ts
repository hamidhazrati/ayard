import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@app/shared/shared.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getByTestId } from '@app/shared/utils/test';
import { MockService } from 'ng-mocks';
import { CashflowDataService } from '@cashflows/services/cashflow-data.service';
import Mocked = jest.Mocked;
import { of } from 'rxjs';
import { HttpEvent, HttpHeaderResponse, HttpResponse } from '@angular/common/http';
import { CashflowFile } from '@app/features/cashflows/models';
import { SubmitToTradeDialogComponent } from '@app/features/cashflows/components/view-origination-proposal/submit-to-trade-dialog/submit-to-trade-dialog.component';

describe('SubmitToTradeDialogComponent', () => {
  let httpMock: HttpTestingController;
  let component: SubmitToTradeDialogComponent;
  let fixture: ComponentFixture<SubmitToTradeDialogComponent>;
  const cashflowDataService: Mocked<CashflowDataService> = MockService(
    CashflowDataService,
  ) as Mocked<CashflowDataService>;
  let matDialogRef: MatDialogRef<SubmitToTradeDialogComponent>;

  const originalCashflowFile: CashflowFile = {
    id: '123',
    clientName: 'clientName',
    filename: 'cashflow-file-csv',
    uploadDate: '2020-01-01',
    uploadedBy: 'AUser',
    status: 'AWAITING_CLIENT_APPROVAL',
    cashflowRowCount: 12,
    processingFailureMessages: [],
  };

  const data = { cashflowFile: originalCashflowFile };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitToTradeDialogComponent],
      imports: [
        SharedModule,
        MatDialogModule,
        MatProgressBarModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: CashflowDataService, useValue: cashflowDataService },
        { provide: MAT_DIALOG_DATA, useValue: data },
        {
          provide: MatDialogRef,
          useValue: matDialogRef = MockService(MatDialogRef) as Mocked<
            MatDialogRef<SubmitToTradeDialogComponent>
          >,
        },
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(SubmitToTradeDialogComponent);
    component = fixture.componentInstance;

    component.selectedClientRequestLetter = new File([''], 'client-request-letter.pdf', {
      type: 'application/pdf',
    });
    component.selectedProposalFile = new File([''], 'proposal.csv', {
      type: 'text/csv',
    });

    fixture.detectChanges();
  });

  test('THEN it should instantiate correctly', () => {
    expect(component).toBeTruthy();
  });

  describe('GIVEN there are files to upload', () => {
    describe('WHEN the files are uploaded', () => {
      describe('WHEN the response is 409', () => {
        test('THEN the correct error message is displayed', () => {
          const event: HttpEvent<CashflowFile> = new HttpHeaderResponse({
            status: 409,
          });
          cashflowDataService.submitToTrade.mockReturnValue(of(event));

          component.upload();

          expect(component.uploadSuccess).toBe(false);
          expect(component.uploadErrorMessage).toBe(
            'File does not match original file sent to client. Please upload original file.',
          );
        });
      });

      describe('WHEN the response is 404', () => {
        test('THEN the correct error message is displayed', () => {
          const event: HttpEvent<CashflowFile> = new HttpHeaderResponse({
            status: 404,
          });
          cashflowDataService.submitToTrade.mockReturnValue(of(event));

          component.upload();

          expect(component.uploadSuccess).toBe(false);
          expect(component.uploadErrorMessage).toBe(
            'There is a problem finding the details of the download proposal file from the cashflow file',
          );
        });
      });

      describe('WHEN the response is 5xx', () => {
        test('THEN the message will be "There was an error processing the files. Please try again later"', () => {
          const event: HttpEvent<CashflowFile> = new HttpHeaderResponse({
            status: 500,
          });
          cashflowDataService.submitToTrade.mockReturnValue(of(event));

          component.upload();

          expect(component.uploadSuccess).toBe(false);
          expect(component.uploadErrorMessage).toBe(
            'There was an error processing the files. Please try again later',
          );
        });
      });

      describe('WHEN the response is OK', () => {
        test('THEN uploadSuccess will be true', () => {
          const headerEvent: HttpEvent<CashflowFile> = new HttpHeaderResponse({
            status: 200,
          });

          cashflowDataService.submitToTrade.mockReturnValue(of(headerEvent));

          component.upload();

          expect(component.uploadSuccess).toBe(true);
          expect(component.uploadErrorMessage).toBe('');
        });
      });

      test('THEN the updated cashflowfile will be returned', () => {
        const headerEvent: HttpEvent<CashflowFile> = new HttpHeaderResponse({
          status: 200,
        });

        const updatedCashflowFile: CashflowFile = {
          id: '123',
          clientName: 'clientName',
          filename: 'cashflow-file-csv',
          uploadDate: '2020-01-01',
          uploadedBy: 'AUser',
          status: 'FINANCE_ACCEPTED',
          cashflowRowCount: 12,
          processingFailureMessages: [],
        };

        const responseEvent: HttpEvent<CashflowFile> = new HttpResponse({
          body: updatedCashflowFile,
        });

        cashflowDataService.submitToTrade.mockReturnValue(of(headerEvent, responseEvent));

        component.upload();

        expect(component.uploadSuccess).toBe(true);
        expect(component.uploadErrorMessage).toBe('');

        expect(component.dialogRef.close).toBeCalledWith(updatedCashflowFile);
      });
    });
  });

  describe('WHEN cancel button is clicked', () => {
    test('THEN the window closes', () => {
      getByTestId(fixture, 'close').nativeElement.click();
      fixture.detectChanges();

      expect(matDialogRef.close).toHaveBeenCalled();
    });
  });
});
