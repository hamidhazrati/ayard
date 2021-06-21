import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadCashflowDialogComponent } from './upload-cashflow-dialog.component';
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
import { HttpEvent, HttpHeaderResponse } from '@angular/common/http';
import { UploadCashflowFileResponse } from '../../../services/upload-cashflow-file-response';

describe('UploadCashflowDialogComponent', () => {
  let httpMock: HttpTestingController;
  let component: UploadCashflowDialogComponent;
  let fixture: ComponentFixture<UploadCashflowDialogComponent>;
  let cashflowDataService: Mocked<CashflowDataService>;
  let matDialogRef: MatDialogRef<UploadCashflowDialogComponent>;

  const data = {
    clients: ['Katerra Inc'],
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadCashflowDialogComponent],
      imports: [
        SharedModule,
        MatDialogModule,
        MatProgressBarModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
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
          useValue: data,
        },
        {
          provide: MatDialogRef,
          useValue: matDialogRef = MockService(MatDialogRef) as Mocked<
            MatDialogRef<UploadCashflowDialogComponent>
          >,
        },
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(UploadCashflowDialogComponent);
    component = fixture.componentInstance;
    component.data = data;
    fixture.detectChanges();
  });

  test('THEN it should instantiate correctly', () => {
    expect(component).toBeTruthy();
  });

  /*
   * Most of the tests for this dialogue are in cypress due to difficulties
   * unit testing input[type=file]. Details in commit 49ef86d8c93fd07e587f6b817040c7df98bd8766
   */

  describe('GIVEN I upload a file', () => {
    describe('WHEN the response is 400', () => {
      test('THEN the message will be "The file is not valid"', () => {
        const event: HttpEvent<UploadCashflowFileResponse> = new HttpHeaderResponse({
          status: 400,
        });
        cashflowDataService.uploadCashflowFile.mockReturnValue(of(event));

        component.form.controls.client.setValue('Katerra Inc');
        component.selectedFile = new File([''], 'some-file.csv', { type: 'text/csv' });

        component.upload();

        expect(component.uploadSuccess).toBe(false);
        expect(component.uploadErrorMessage).toBe(
          'There was an error processing the file. Please try again later',
        );
      });
    });

    describe('WHEN the response is 409', () => {
      test('THEN the message will be "The file is a duplicated"', () => {
        const event: HttpEvent<UploadCashflowFileResponse> = new HttpHeaderResponse({
          status: 409,
        });
        cashflowDataService.uploadCashflowFile.mockReturnValue(of(event));

        component.form.controls.client.setValue('Katerra Inc');
        component.selectedFile = new File([''], 'some-file.csv', { type: 'text/csv' });

        component.upload();

        expect(component.uploadSuccess).toBe(false);
        expect(component.uploadErrorMessage).toBe('The file is a duplicate');
      });
    });
    describe('WHEN the response is 5xx', () => {
      test('THEN the message will be "There was an error processing the file. Please try again later"', () => {
        const event: HttpEvent<UploadCashflowFileResponse> = new HttpHeaderResponse({
          status: 500,
        });
        cashflowDataService.uploadCashflowFile.mockReturnValue(of(event));

        component.form.controls.client.setValue('Katerra Inc');
        component.selectedFile = new File([''], 'some-file.csv', { type: 'text/csv' });

        component.upload();

        expect(component.uploadSuccess).toBe(false);
        expect(component.uploadErrorMessage).toBe(
          'There was an error processing the file. Please try again later',
        );
      });
    });

    describe('WHEN the response is OK', () => {
      test('THEN uploadSuccess will be true', () => {
        const event: HttpEvent<UploadCashflowFileResponse> = new HttpHeaderResponse({
          status: 200,
        });
        cashflowDataService.uploadCashflowFile.mockReturnValue(of(event));

        component.form.controls.client.setValue('Katerra Inc');
        component.selectedFile = new File([''], 'some-file.csv', { type: 'text/csv' });

        component.upload();

        expect(component.uploadSuccess).toBe(true);
        expect(component.uploadErrorMessage).toBe('');
      });
    });
  });
  describe('WHEN I press cancel ', () => {
    test('THEN the window closes', () => {
      getByTestId(fixture, 'close').nativeElement.click();
      fixture.detectChanges();

      expect(matDialogRef.close).toHaveBeenCalled();
    });
  });
});
