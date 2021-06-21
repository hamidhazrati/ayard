import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLimitDialogComponent, AddLimitDialogData } from './add-limit-dialog.component';

import { moduleDeclarations, moduleImports } from '../../../contracts.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CounterpartyService } from '../../../services/counterparty.service';
import { FacilityService } from '../../../../facilities/services/facility.service';
import { EntityService } from '../../../../entities/services/entity.service';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

const mockCounterpartyService: Mocked<CounterpartyService> = MockService(
  CounterpartyService,
) as Mocked<CounterpartyService>;

const mockFacilityService: Mocked<FacilityService> = MockService(FacilityService) as Mocked<
  FacilityService
>;

const mockEntityService: Mocked<EntityService> = MockService(EntityService) as Mocked<
  EntityService
>;

const dialogData: AddLimitDialogData = {
  contract: {
    facility: {
      id: 'FAC-123',
      name: 'Facility 123',
    },
    productName: '',
    productCategoryName: '',
    productCategoryId: '',
    id: null,
    status: null,
    name: null,
    channelReference: null,
    partnerId: null,
    product: null,
    productId: null,
    created: null,
    rules: null,
    currencies: {
      USD: null,
    },
    bypassTradeAcceptance: false,
  },
  counterparty: {
    id: 'CP-123',
    entityId: 'ENT-123',
    name: 'Acme Ltd.',
    role: 'Account Debtor',
    roleType: 'RELATED',
    counterpartyReference: 'ext-ref-123',
  },
  limitRequirements: {
    requirements: [
      {
        limitType: 'CREDIT',
        validSources: ['NAMED'],
      },
      {
        limitType: 'INSURANCE',
        validSources: ['DEFAULT', 'NAMED'],
      },
    ],
  },
};

describe('GIVEN AddLimitDialogComponent', () => {
  let component: AddLimitDialogComponent;
  let fixture: ComponentFixture<AddLimitDialogComponent>;

  beforeEach(async(() => {
    mockEntityService.getEntityById.mockImplementation(() => {
      return of({
        id: 'ENT-123',
        name: 'Acme Limited',
        dunsNumber: '555-123',
        address: null,
      });
    });

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
        { provide: FacilityService, useValue: mockFacilityService },
        { provide: EntityService, useValue: mockEntityService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLimitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('THEN is should be created', () => {
    expect(component).toBeTruthy();

    const creditValueField = fixture.debugElement.query(
      By.css('[data-testid="CREDIT-limit-type-value"]'),
    );

    expect(creditValueField.nativeElement.disabled).toBeFalsy();

    const insuranceValueField = fixture.debugElement.query(
      By.css('[data-testid="INSURANCE-limit-type-value"]'),
    );

    expect(insuranceValueField.nativeElement.disabled).toBeTruthy();
  });

  describe('WHEN limited submitted', () => {
    test('THEN the named limits are added', () => {
      mockFacilityService.operateFacility.mockImplementation(() => {
        return of({});
      });

      const creditValueField = fixture.debugElement.query(
        By.css('[data-testid="CREDIT-limit-type-value"]'),
      );

      component.form.setValue({
        CREDIT: {
          source: 'NAMED',
          value: 3000,
        },
        INSURANCE: {
          source: 'DEFAULT',
        },
      });

      component.addLimit();

      expect(mockFacilityService.operateFacility).toBeCalledWith({
        counterpartyRoleType: {
          name: 'Account Debtor',
        },
        entityLimits: [
          {
            entity: {
              id: 'ENT-123',
              name: 'Acme Limited',
              dunsNumber: '555-123',
            },
            limits: [
              {
                defaultLimit: false,
                limit: 3000,
                limitType: 'CREDIT',
                type: 'total-limit',
              },
            ],
          },
        ],
        facilityId: 'FAC-123',
        type: 'add-counterparty-limits-operation',
      });
    });
  });
});
