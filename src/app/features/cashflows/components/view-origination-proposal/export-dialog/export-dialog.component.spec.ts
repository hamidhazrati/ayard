import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportDialogComponent } from './export-dialog.component';
import { SharedModule } from '@app/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getByTestId } from '@app/shared/utils/test';
import { MockService } from 'ng-mocks';
import { CashflowDataService } from '@cashflows/services/cashflow-data.service';
import { BehaviorSubject, of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Mocked = jest.Mocked;

describe('ExportDialogComponent', () => {
  let httpMock: HttpTestingController;
  let component: ExportDialogComponent;
  let fixture: ComponentFixture<ExportDialogComponent>;
  let cashflowDataService: Mocked<CashflowDataService>;
  let matDialogRef: Mocked<MatDialogRef<ExportDialogComponent>>;

  const data = {
    cashflowFileId: 'fileId',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportDialogComponent],
      imports: [
        SharedModule,
        MatDialogModule,
        MatProgressSpinnerModule,
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
            MatDialogRef<ExportDialogComponent>
          >,
        },
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(matDialogRef, 'afterOpened').and.returnValue(of(true));
    spyOn(cashflowDataService, 'downloadCashflowFileExport').and.returnValue(of({}));
    cashflowDataService.isCashflowFileExported = new BehaviorSubject<boolean>(null);

    fixture = TestBed.createComponent(ExportDialogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  test('THEN it should instantiate correctly', () => {
    expect(component).toBeTruthy();
  });

  describe('WHEN I press close', () => {
    test('THEN the export dialog closes', () => {
      getByTestId(fixture, 'close').nativeElement.click();
      fixture.detectChanges();

      expect(matDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('WHEN I press download', () => {
    test('THEN the file exports and the dialog closes', () => {
      spyOn(component, 'saveFile');
      spyOn(component, 'close');
      spyOn(cashflowDataService.isCashflowFileExported, 'next');

      getByTestId(fixture, 'download').nativeElement.click();
      fixture.detectChanges();

      expect(component.isDownloading).toBeTruthy();
      expect(cashflowDataService.downloadCashflowFileExport).lastCalledWith(data.cashflowFileId);

      expect(cashflowDataService.isCashflowFileExported.next).toHaveBeenCalledWith(true);
      expect(component.saveFile).toHaveBeenCalled();
      expect(component.close).toHaveBeenCalled();
    });
  });
});
