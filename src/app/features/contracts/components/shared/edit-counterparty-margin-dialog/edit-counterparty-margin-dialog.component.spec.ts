import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCounterpartyMarginDialogComponent } from './edit-counterparty-margin-dialog.component';

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

describe('EditCounterpartyMarginDialogDialogComponent', () => {
  let component: EditCounterpartyMarginDialogComponent;
  let fixture: ComponentFixture<EditCounterpartyMarginDialogComponent>;
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
    marginRate: 123,
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
    fixture = TestBed.createComponent(EditCounterpartyMarginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN EditCounterpartyMarginDialogDialogComponent is initialised', () => {
    test('THEN it should create component', () => {
      expect(true).toBeTruthy();
    });
    test('THEN it should have appPositiveTwoDecimal attribute directive', () => {
      expect(fixture.nativeElement.querySelector('input[appPositiveTwoDecimal]')).toBeTruthy();
    });
  });
});
