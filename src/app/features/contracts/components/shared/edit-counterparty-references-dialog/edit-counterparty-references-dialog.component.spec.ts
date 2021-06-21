import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCounterpartyReferencesDialogComponent } from './edit-counterparty-references-dialog.component';

import { moduleDeclarations, moduleImports } from '../../../contracts.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { triggerClick, getByTestId } from '../../../../../shared/utils/test';
import { CounterpartyService } from '../../../services/counterparty.service';
import { ContractCounterparty } from '../../../models/counterparty.model';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;
import { of, throwError } from 'rxjs';

describe('EditCounterpartyReferencesDialogComponent', () => {
  let component: EditCounterpartyReferencesDialogComponent;
  let fixture: ComponentFixture<EditCounterpartyReferencesDialogComponent>;
  const mockCounterpartyService: Mocked<CounterpartyService> = MockService(
    CounterpartyService,
  ) as Mocked<CounterpartyService>;

  const counterparty: ContractCounterparty = {
    name: 'Acme Ltd.',
    role: 'Supplier',
    roleType: 'PRIMARY',
    id: 'FFF-AAA',
    counterpartyReference: 'string',
    references: ['123', 'ABC'],
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [...moduleDeclarations],
      imports: [HttpClientTestingModule, NoopAnimationsModule, ...moduleImports],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: counterparty },
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
    fixture = TestBed.createComponent(EditCounterpartyReferencesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN EditCounterpartyReferencesDialogComponent is initialised', () => {
    test('THEN it should create component', () => {
      expect(component).toBeTruthy();
      expect(component.form.value).toEqual({
        references: ['123', 'ABC'],
      });
    });
  });

  describe('GIVEN form is valid', () => {
    test('THEN it should create the counter party', () => {
      mockCounterpartyService.updateReferences.mockImplementation(() => {
        return of();
      });

      component.form.setValue({ references: ['AAAAAAAA'] });
      triggerClick(fixture, getByTestId(fixture, 'update-counterparty'));
      expect(component.form.valid).toBeTruthy();
      expect(mockCounterpartyService.updateReferences).toHaveBeenCalledWith('FFF-AAA', [
        'AAAAAAAA',
      ]);
    });
  });

  describe('GIVEN the server returns a 409 CONFLICT', () => {
    test('THEN a duplicate message is displayed', () => {
      mockCounterpartyService.updateReferences.mockReturnValue(
        throwError({
          status: 409,
          error: { details: [{ target: `{ \"entityId\": \"XYZ\" }` }] },
        }),
      );

      component.form.setValue({ references: [] });
      triggerClick(fixture, getByTestId(fixture, 'update-counterparty'));

      expect(mockCounterpartyService.updateReferences).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.serverError).toEqual('Duplicate References');
    });
  });
});
