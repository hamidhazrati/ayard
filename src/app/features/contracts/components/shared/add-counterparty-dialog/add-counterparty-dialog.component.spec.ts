import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  AddCounterpartyDialogComponent,
  AddCounterpartyDialogData,
} from './add-counterparty-dialog.component';
import { moduleDeclarations, moduleImports } from '../../../contracts.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { triggerClick, getByTestId } from '../../../../../shared/utils/test';
import { CounterpartyService } from '../../../services/counterparty.service';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;
import { of, throwError } from 'rxjs';

describe('AddCounterpartyDialogComponent', () => {
  let component: AddCounterpartyDialogComponent;
  let fixture: ComponentFixture<AddCounterpartyDialogComponent>;

  const mockCounterpartyService: Mocked<CounterpartyService> = MockService(
    CounterpartyService,
  ) as Mocked<CounterpartyService>;

  const dialogData: AddCounterpartyDialogData = {
    contractId: 'ABC',
    roleName: 'BUYER',
  };

  const VALID_FORM_VALUE = {
    name: 'Amc',
    reference: 'AC_123',
    references: ['REF_ACB'],
    entity: {
      id: 'AA.BB',
      name: 'Acme Corp. Int',
      dunsNumber: '000000000',
      address: null,
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [...moduleDeclarations],
      imports: [HttpClientTestingModule, NoopAnimationsModule, ...moduleImports],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
        { provide: CounterpartyService, useValue: mockCounterpartyService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCounterpartyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN AddCounterpartyDialogComponent is initialised', () => {
    test('THEN it should create component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('GIVEN form is invalid', () => {
    test('THEN it should not create', () => {
      component.counterPartyForm.form.setValue({
        name: '',
        reference: '',
        references: null,
        entity: null,
      });

      triggerClick(fixture, getByTestId(fixture, 'submit-add-counterparty'));
      expect(component.counterPartyForm.form.valid).toBeFalsy();
      expect(mockCounterpartyService.saveCounterparty).not.toHaveBeenCalled();
    });
  });

  describe('GIVEN form is valid', () => {
    test('THEN it should create the counter party', () => {
      mockCounterpartyService.saveCounterparty.mockImplementation(() => {
        return of({
          id: 'string',
          name: 'string',
          contractId: 'string',
          entityId: 'string',
          role: 'string',
          counterpartyReference: 'string',
          countryOfOperation: 'string',
        });
      });

      component.counterPartyForm.form.setValue(VALID_FORM_VALUE);
      triggerClick(fixture, getByTestId(fixture, 'submit-add-counterparty'));
      expect(component.counterPartyForm.form.valid).toBeTruthy();
      expect(mockCounterpartyService.saveCounterparty).toHaveBeenCalled();
    });
  });

  describe('GIVEN the server returns a 409 CONFLICT', () => {
    test('THEN a duplicate message is displayed', () => {
      mockCounterpartyService.saveCounterparty.mockReturnValue(
        throwError({
          status: 409,
          error: { details: [{ target: `{ \"entityId\": \"XYZ\" }` }] },
        }),
      );

      component.counterPartyForm.form.setValue(VALID_FORM_VALUE);
      triggerClick(fixture, getByTestId(fixture, 'submit-add-counterparty'));
      expect(component.counterPartyForm.form.valid).toBeTruthy();
      expect(mockCounterpartyService.saveCounterparty).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.serverError).toEqual('Duplicate Entity');
    });
  });
});
