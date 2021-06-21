import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { getByTestId } from '@app/shared/utils/test';
import { CashflowService } from '@cashflows/services/cashflow.service';
import { MockService } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';
import { InternalApprovalDialogComponent } from './internal-approval-dialog.component';
import Mocked = jest.Mocked;

describe('InternalApprovalDialogComponent', () => {
  let cashflowService: Mocked<CashflowService>;
  let component: InternalApprovalDialogComponent;
  let fixture: ComponentFixture<InternalApprovalDialogComponent>;
  let matDialogRef: Mocked<MatDialogRef<InternalApprovalDialogComponent>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InternalApprovalDialogComponent],
      providers: [
        {
          provide: CashflowService,
          useValue: cashflowService = MockService(CashflowService) as Mocked<CashflowService>,
        },
        {
          provide: MatDialogRef,
          useValue: matDialogRef = MockService(MatDialogRef) as Mocked<
            MatDialogRef<InternalApprovalDialogComponent>
          >,
        },
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    cashflowService.internalApproval$ = new BehaviorSubject<boolean>(null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('WHEN I press confirm', () => {
    test('THEN internal approval is granted and the dialog closes', () => {
      spyOn(cashflowService.internalApproval$, 'next');
      getByTestId(fixture, 'internal-approval-dialog-confirm').nativeElement.click();
      fixture.detectChanges();

      expect(cashflowService.internalApproval$.next).toHaveBeenCalledWith(true);
      expect(matDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('WHEN I press cancel', () => {
    test('THEN the internal approval dialog closes', () => {
      getByTestId(fixture, 'internal-approval-dialog-cancel').nativeElement.click();
      fixture.detectChanges();
      expect(matDialogRef.close).toHaveBeenCalled();
    });
  });
});
