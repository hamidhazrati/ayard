import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProposalTableComponent } from './proposal-table.component';
import { MatTableModule } from '@angular/material/table';
import { PROPOSAL_CASHFLOWS_WITH_FACILITIES } from './proposal-table.component.test-data';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import Mocked = jest.Mocked;

describe('ProposalTableComponentComponent', () => {
  let component: ProposalTableComponent;
  let fixture: ComponentFixture<ProposalTableComponent>;
  let matCheckboxChangeEvent: Mocked<MatCheckboxChange>;
  let matDialog: Mocked<MatDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalTableComponent],
      imports: [MatTableModule, MatCheckboxModule, MatDialogModule, NoopAnimationsModule],
      providers: [
        {
          provide: MatCheckboxChange,
          useValue: matCheckboxChangeEvent = MockService(MatCheckboxChange) as Mocked<
            MatCheckboxChange
          >,
        },

        {
          provide: MatDialog,
          useValue: matDialog = MockService(MatDialog) as Mocked<MatDialog>,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalTableComponent);
    component = fixture.componentInstance;
    component.proposalCashflowsWithFacilities = PROPOSAL_CASHFLOWS_WITH_FACILITIES;
    fixture.detectChanges();
  });

  describe('GIVEN the ProposalTableComponent with input params', () => {
    xtest('THEN it should render correctly', () => {
      // expect(fixture).toMatchSnapshot();
    });

    test('THEN all rows should be selected by default', () => {
      component.proposalCashflowsWithFacilities.forEach((pc) => {
        pc.cashflows.forEach((cf) => {
          expect(component.selection.isSelected(cf)).toEqual(true);
        });
      });
    });
  });

  describe('GIVEN a record is selected', () => {
    describe('WHEN the user chooses OK in the Reject dialogue ', () => {
      test('THEN an unacceptedCashflowsEvent is fired containing the record', () => {
        spyOn(matDialog, 'open').and.returnValue({
          afterClosed: () => of({ isCancelled: false, reason: 'the users reason' }),
        });
        spyOn(component.unacceptedCashflowsEvent, 'emit');

        const cf = PROPOSAL_CASHFLOWS_WITH_FACILITIES[0].cashflows[1];
        matCheckboxChangeEvent.checked = false; // Accept deselected

        component.handleCheckboxChange(matCheckboxChangeEvent, cf);

        expect(matDialog.open).toHaveBeenCalled();
        expect(component.unacceptedCashflowsEvent.emit).toHaveBeenCalledWith([
          {
            id: 'abc-2',
            message: 'the users reason',
          },
        ]);
      });
    });

    describe('WHEN the user chooses Cancel in the dialogue ', () => {
      test('THEN no unacceptedCashflowsEvent is emitted', () => {
        spyOn(matDialog, 'open').and.returnValue({
          afterClosed: () => of({ isCancelled: true, reason: 'the users reason' }),
        });
        spyOn(component.unacceptedCashflowsEvent, 'emit');

        const cf = PROPOSAL_CASHFLOWS_WITH_FACILITIES[0].cashflows[1];
        matCheckboxChangeEvent.checked = false; // Accept deselected

        component.handleCheckboxChange(matCheckboxChangeEvent, cf);

        expect(matDialog.open).toHaveBeenCalled();
        expect(component.unacceptedCashflowsEvent.emit).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a record is deselected', () => {
    test('THEN an unacceptedCashflowsEvent is fired with the record removed', () => {
      spyOn(matDialog, 'open').and.returnValue({
        afterClosed: () => of({ isCancelled: false, reason: 'the users reason' }),
      });
      spyOn(component.unacceptedCashflowsEvent, 'emit');

      const cf = PROPOSAL_CASHFLOWS_WITH_FACILITIES[0].cashflows[1];

      // First, add an unacceptedCashflow record
      matCheckboxChangeEvent.checked = false; // Accept deselected

      component.handleCheckboxChange(matCheckboxChangeEvent, cf);

      expect(component.unacceptedCashflowsEvent.emit).toHaveBeenCalledWith([
        {
          id: 'abc-2',
          message: 'the users reason',
        },
      ]);

      // Then remove it
      matCheckboxChangeEvent.checked = true; // Accept selected

      component.handleCheckboxChange(matCheckboxChangeEvent, cf);

      expect(component.unacceptedCashflowsEvent.emit).toHaveBeenCalledWith([]);
      expect(matDialog.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('GIVEN cashflows with facilities', () => {
    test('THEN a positive availableLimit should be highlighted appropriately', () => {
      const positiveAvailableLimit = fixture.nativeElement.querySelectorAll(
        '[data-testid="cashflow-available-limit"]',
      )[0];
      expect(positiveAvailableLimit.classList.contains('negative-number')).toBeFalsy();
    });

    test('THEN a negative availableLimit should be highlighted appropriately', () => {
      const negativeAvailableLimit = fixture.nativeElement.querySelectorAll(
        '[data-testid="cashflow-available-limit"]',
      )[1];
      expect(negativeAvailableLimit.classList.contains('negative-number')).toBeTruthy();
    });
  });
});
