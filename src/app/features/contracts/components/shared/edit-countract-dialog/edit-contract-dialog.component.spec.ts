import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContractDialogComponent } from './edit-contract-dialog.component';

import { moduleDeclarations, moduleImports } from '../../../contracts.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { triggerClick, getByTestId } from '../../../../../shared/utils/test';
import { ContractService } from '../../../services/contract.service';
import { Contract } from '../../../models/contract.model';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;
import { of, throwError } from 'rxjs';

describe('EditContractDialogComponent', () => {
  let component: EditContractDialogComponent;
  let fixture: ComponentFixture<EditContractDialogComponent>;
  const mockContractService: Mocked<ContractService> = MockService(ContractService) as Mocked<
    ContractService
  >;

  const contracts: Contract = {
    facility: { id: 'id', name: 'name' },
    productName: '',
    productCategoryName: '',
    productCategoryId: '',
    id: 'abc123',
    name: 'Sample Contract',
    status: 'PENDING_APPROVAL',
    channelReference: 'Channel Six',
    partnerId: 'Partners ID',
    productId: 'BP_99',
    product: 'Base Product',
    created: '2020-06-18',
    rules: [
      {
        name: 'Rule 1',
        resolutionType: null,
        resource: 'PRICING',
        expression: 'expr1',
        code: 'CDE1',
        message: 'MSG1',
        matchExpression: null,
        outcomeType: 'RESOLVABLE',
        outcomeDescription: null,
      },
      {
        name: 'Rule 2',
        resolutionType: null,
        resource: 'PRICING',
        expression: 'expr2',
        code: 'CDE2',
        message: 'MSG2',
        matchExpression: null,
        outcomeType: 'TERMINAL',
        outcomeDescription: 'description of terminal',
      },
    ],
    currencies: null,
    bypassTradeAcceptance: false,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [...moduleDeclarations],
      imports: [HttpClientTestingModule, NoopAnimationsModule, ...moduleImports],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: contracts },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
        { provide: ContractService, useValue: mockContractService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContractDialogComponent);
    component = fixture.componentInstance;
    mockContractService.updateContract.mockImplementation(() => {
      return of(contracts);
    });
    fixture.detectChanges();
  });

  describe('GIVEN EditContractDialogComponent is initialised', () => {
    test('THEN it should create component', () => {
      expect(component).toBeTruthy();
      expect(component.form.value).toEqual({
        facility: null,
      });
    });
  });

  describe('GIVEN form is valid', () => {
    test('THEN it should create the contract', () => {
      expect(component.form.valid).toBeTruthy();
    });
    test('THEN updateContract is available', () => {
      expect(component.updateContract).toBeDefined();
      component.updateContract();
      expect(mockContractService.updateContract).toHaveBeenCalled();
    });
  });
});
