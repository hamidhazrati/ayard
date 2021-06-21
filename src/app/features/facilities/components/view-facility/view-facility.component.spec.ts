import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EntityService } from '@entities/services/entity.service';
import { of } from 'rxjs';
import { MockService } from 'ng-mocks';
import { SharedModule } from '@app/shared/shared.module';
import { getByTestId } from '@app/shared/utils/test';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ViewFacilityComponent } from '@app/features/facilities/components/view-facility/view-facility.component';
import { viewFacilityCrumb } from '@app/features/facilities/components/view-facility/view-facility.crumb';
import {
  FacilityProjection,
  HomogenousExposureSet,
} from '@app/features/facilities/models/facility-projection.model';
import {
  Facility,
  RelationshipFacility,
  FacilityEntity,
} from '@app/features/facilities/models/facility.model';
import { ExposureService } from '@app/features/facilities/services/exposure.service';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { CounterpartiesTableComponent } from '@app/features/facilities/components/counterparties-table/counterparties-table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import Mocked = jest.Mocked;
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

const ID = '123';

describe('ViewFacilityComponent', () => {
  let component: ViewFacilityComponent;
  let fixture: ComponentFixture<ViewFacilityComponent>;

  let exposureService: Mocked<ExposureService>;
  let crumbService: Mocked<CrumbService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounterpartiesTableComponent, ViewFacilityComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        SharedModule,
        MatTabsModule,
        RouterTestingModule,
        MatDialogModule,
        MatMenuModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: ID }) },
        },
        EntityService,
        {
          provide: ExposureService,
          useValue: exposureService = MockService(ExposureService) as Mocked<ExposureService>,
        },
        {
          provide: CrumbService,
          useValue: crumbService = MockService(CrumbService) as Mocked<CrumbService>,
        },
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    });
  });

  describe('GIVEN FacilityComponent is initialised', () => {
    const projection = createProjection();
    beforeEach(() => {
      exposureService.getFacility.mockReturnValue(of(projection));
      fixture = TestBed.createComponent(ViewFacilityComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    test('THEN the crumb service should be called', () => {
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(viewFacilityCrumb(projection));
    });

    test('THEN it should initialise with the relationship facility', () => {
      expectMatch('facility-name', projection.facility.name);
      expectMatch('facility-currency', projection.facility.currency);
      expectMatch('facility-limit', '4,000,000');
      expectMatch('facility-exposure', '23,007.51');
      expectMatch('facility-available', '3,976,992.49');
    });

    test('THEN the contract facility should be displayed', () => {
      expectMatch(
        'contract-facility-title-0',
        `Facility 1 | ${projection.children[0].facility.name} | ${projection.children[0].exposure.results[0].results[0].balance.currency} 2,000,000`,
      );
      expectMatch('contract-facility-exposure-0', '23,007.51');
    });

    test('THEN the guarantor limits should be displayed', () => {
      expectMatTabMatch('guarantor-row-0', 'guarantor-entity', 'An entity');
      expectMatTabMatch('guarantor-row-0', 'guarantor-limit', '650,000');
      expectMatTabMatch('guarantor-row-0', 'guarantor-exposure', '23,007.51');
      expectMatTabMatch('guarantor-row-0', 'guarantor-level', 'Relationship');

      expectMatTabMatch('guarantor-row-2', 'guarantor-entity', 'An entity1');
      expectMatTabMatch('guarantor-row-2', 'guarantor-limit', '350,000');
      expectMatTabMatch('guarantor-row-2', 'guarantor-exposure', '23,007.51');
      expectMatTabMatch('guarantor-row-2', 'guarantor-level', 'Facility');
    });

    test('THEN a positive available credit should be highlighted appropriately', () => {
      const positiveAvailableCredit = fixture.nativeElement.querySelectorAll(
        '[data-testid="facility-available"]',
      )[0];
      expect(positiveAvailableCredit.classList.contains('negative-number')).toBeFalsy();
    });
  });

  describe('GIVEN a Facility with a negative facility availability', () => {
    const projection = createProjection();

    beforeEach(() => {
      projection.exposure.results[0].results[0].available = -3976992.49;

      exposureService.getFacility.mockReturnValue(of(projection));
      fixture = TestBed.createComponent(ViewFacilityComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    test('THEN a negative available credit should be highlighted appropriately', () => {
      const negativeAvailableCredit = fixture.nativeElement.querySelectorAll(
        '[data-testid="facility-available"]',
      )[0];
      expect(negativeAvailableCredit.classList.contains('negative-number')).toBeTruthy();
    });
  });

  function expectMatTabMatch(rowSelector: string, selector: string, expectedValue: string) {
    const element = fixture.nativeElement.querySelector(
      `[data-testid="${rowSelector}"] > [data-testid="${selector}"]`,
    );
    const value = element.textContent.trim();
    expect(value).toEqual(expectedValue);
  }

  function expectMatch(selector: string, expectedValue: string) {
    const debugElement = getByTestId(fixture, selector);
    const value = debugElement.nativeElement.textContent.trim();
    expect(value).toEqual(expectedValue);
  }

  function createProjection(): FacilityProjection {
    return {
      date: '2020-09-29',
      facility: {
        type: 'relationship-facility',
        id: '87afaece-46b6-42bc-bbf9-280b95b64ee3',
        name: 'Test relationship facility2',
        entity: {
          id: 'abc',
          name: 'relationship name',
        },
        currency: 'USD',
        children: null,
        limits: [
          {
            type: 'total-limit',
            limit: 4000000,
            limitType: 'CREDIT',
            defaultLimit: false,
          },
          {
            type: 'guarantor-limit',
            entity: {
              id: 'eid',
              name: 'An entity',
              dunsNumber: '117191376',
            } as FacilityEntity,
            limit: 650000,
            limitType: 'GUARANTOR',
            defaultLimit: false,
          },
          {
            type: 'guarantor-limit',
            entity: {
              id: 'eid',
              name: 'An entity2',
              dunsNumber: '117191379',
            } as FacilityEntity,
            limit: 550000,
            limitType: 'GUARANTOR',
            defaultLimit: false,
          },
        ],
      } as RelationshipFacility,
      exposure: {
        type: 'homogenous-exposure-set',
        results: [
          {
            classification: {
              type: 'homogenous',
            },
            results: [
              {
                currency: 'USD',
                total: 4000000,
                used: 23007.51,
                available: 3976992.49,
                balance: {
                  currency: 'USD',
                  provisionalInvestment: 0,
                  earmarkedInvestment: 23007.51,
                  investment: 0,
                  maturity: 0,
                  earmarkedMaturity: 0,
                  provisionalMaturity: 0,
                  lockedMaturity: 0,
                  lockedInvestment: 23007.51,
                },
                limit: {
                  type: 'total-limit',
                  limit: 4000000,
                  limitType: 'CREDIT',
                  defaultLimit: false,
                  exceptionCode: 'CREDIT',
                },
                breached: false,
                ok: true,
              },
              {
                currency: 'USD',
                total: 650000,
                used: 23007.51,
                available: 626992.49,
                balance: {
                  currency: 'USD',
                  provisionalInvestment: 0,
                  earmarkedInvestment: 23007.51,
                  investment: 0,
                  maturity: 0,
                  earmarkedMaturity: 0,
                  provisionalMaturity: 0,
                  lockedMaturity: 0,
                  lockedInvestment: 23007.51,
                },
                limit: {
                  type: 'guarantor-limit',
                  limit: 650000,
                  limitType: 'GUARANTOR',
                  entity: {
                    id: 'eid',
                    name: 'An entity',
                    dunsNumber: '117191376',
                  },
                  defaultLimit: false,
                  exceptionCode: 'CREDIT',
                },
                breached: false,
                ok: true,
              },
              {
                currency: 'USD',
                total: 550000,
                used: 23007.51,
                available: 526992.49,
                balance: {
                  currency: 'USD',
                  provisionalInvestment: 0,
                  earmarkedInvestment: 23007.51,
                  investment: 0,
                  maturity: 0,
                  earmarkedMaturity: 0,
                  provisionalMaturity: 0,
                  lockedMaturity: 0,
                  lockedInvestment: 23007.51,
                },
                limit: {
                  type: 'guarantor-limit',
                  limit: 550000,
                  limitType: 'GUARANTOR',
                  entity: {
                    id: 'eid',
                    name: 'An entity2',
                    dunsNumber: '117191379',
                  },
                  defaultLimit: false,
                  exceptionCode: 'CREDIT',
                },
                breached: false,
                ok: true,
              },
            ],
          },
        ],
      } as HomogenousExposureSet,
      children: [
        {
          date: '2020-09-29',
          facility: {
            type: 'contract-total-facility',
            id: '87afaece-46b6-42bc-bbf9-280b95b64ee3_5475147e-f16f-421f-a286-e15da9af916d',
            name: 'Seller centric facility',
            currency: 'USD',
            canHaveChildren: true,
            limits: [
              {
                type: 'total-limit',
                limit: 4000000,
                limitType: 'CREDIT',
                defaultLimit: false,
              },
              {
                type: 'guarantor-limit',
                entity: {
                  id: 'eid',
                  name: 'An entity1',
                  dunsNumber: '117191376',
                } as FacilityEntity,
                limit: 350000,
                limitType: 'GUARANTOR',
                defaultLimit: false,
              },
              {
                type: 'guarantor-limit',
                entity: {
                  id: 'eid',
                  name: 'An entity3',
                  dunsNumber: '117191370',
                },
                limit: 450000,
                limitType: 'GUARANTOR',
                defaultLimit: false,
              },
            ],
            contracts: [
              {
                id: '0a0ef77e-b33c-4755-a096-4ca80d7716f7',
                name: 'a contract',
              },
            ],
          },
          exposure: {
            type: 'homogenous-exposure-set',
            results: [
              {
                classification: {
                  type: 'homogenous',
                },
                results: [
                  {
                    currency: 'USD',
                    total: 2000000,
                    used: 23007.51,
                    available: 1976992.49,
                    balance: {
                      currency: 'USD',
                      provisionalInvestment: 0,
                      earmarkedInvestment: 23007.51,
                      investment: 0,
                      maturity: 0,
                      earmarkedMaturity: 0,
                      provisionalMaturity: 0,
                      lockedMaturity: 0,
                      lockedInvestment: 23007.51,
                    },
                    limit: {
                      type: 'total-limit',
                      limit: 4000000,
                      limitType: 'CREDIT',
                      defaultLimit: false,
                      exceptionCode: 'CREDIT',
                    },
                    breached: false,
                    ok: true,
                  },
                  {
                    currency: 'USD',
                    total: 350000,
                    used: 23007.51,
                    available: 326992.49,
                    balance: {
                      currency: 'USD',
                      provisionalInvestment: 0,
                      earmarkedInvestment: 23007.51,
                      investment: 0,
                      maturity: 0,
                      earmarkedMaturity: 0,
                      provisionalMaturity: 0,
                      lockedMaturity: 0,
                      lockedInvestment: 23007.51,
                    },
                    limit: {
                      type: 'guarantor-limit',
                      limit: 350000,
                      limitType: 'GUARANTOR',
                      entity: {
                        id: 'eid',
                        name: 'An entity1',
                        dunsNumber: '117191376',
                      },
                      defaultLimit: false,
                      exceptionCode: 'CREDIT',
                    },
                    breached: false,
                    ok: true,
                  },
                  {
                    currency: 'USD',
                    total: 450000,
                    used: 23007.51,
                    available: 426992.49,
                    balance: {
                      currency: 'USD',
                      provisionalInvestment: 0,
                      earmarkedInvestment: 23007.51,
                      investment: 0,
                      maturity: 0,
                      earmarkedMaturity: 0,
                      provisionalMaturity: 0,
                      lockedMaturity: 0,
                      lockedInvestment: 23007.51,
                    },
                    limit: {
                      type: 'guarantor-limit',
                      limit: 450000,
                      limitType: 'GUARANTOR',
                      entity: {
                        id: 'eid',
                        name: 'An entity2',
                        dunsNumber: '117191379',
                      },
                      defaultLimit: false,
                      exceptionCode: 'CREDIT',
                    },
                    breached: false,
                    ok: true,
                  },
                ],
              },
            ],
          } as HomogenousExposureSet,
          children: [],
        } as FacilityProjection,
      ],
    };
  }
});
