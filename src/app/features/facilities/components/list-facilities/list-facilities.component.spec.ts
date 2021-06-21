import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacilityRow, ListFacilitiesComponent } from './list-facilities.component';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { MockService } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { listFacilitiesCrumb } from '@app/features/facilities/components/list-facilities/list-facilities.crumb';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExposureService } from '@app/features/facilities/services/exposure.service';
import { FacilityProjection } from '@app/features/facilities/models/facility-projection.model';
import { buildTestFacilityProjection } from '@app/features/facilities/facilities.test-utils';
import { ContractTotalFacility } from '@app/features/facilities/models/facility.model';
import Mocked = jest.Mocked;

describe('ListFacilitiesComponent', () => {
  let component: ListFacilitiesComponent;
  let fixture: ComponentFixture<ListFacilitiesComponent>;

  let crumbService: Mocked<CrumbService>;
  let exposureService: Mocked<ExposureService>;

  const projections: FacilityProjection[] = [
    buildTestFacilityProjection({
      facility: {
        id: '1',
        name: 'Facility 1',
        type: 'contract-total-facility',
        currency: 'USD',
        contracts: [],
        children: [],
        limits: [
          {
            type: 'total-limit',
            limit: 600000000,
            limitType: 'CREDIT',
            defaultLimit: false,
          },
        ],
      } as ContractTotalFacility,
      exposure: {
        type: 'homogenous-exposure-set',
        results: [
          {
            classification: { type: 'homogenous' },
            results: [
              {
                limit: {
                  type: 'total-limit',
                  limit: 600000000,
                  limitType: 'CREDIT',
                  defaultLimit: false,
                },
                balance: {
                  currency: 'USD',
                  provisionalInvestment: 0,
                  earmarkedInvestment: 1111111,
                  investment: 4444444,
                  maturity: 0,
                  earmarkedMaturity: 0,
                  provisionalMaturity: 0,
                  lockedMaturity: 5555555,
                  lockedInvestment: 0,
                },
                total: 600000000,
                used: 100000000,
                available: 500000000,
                currency: 'USD',
              },
            ],
          },
        ],
      },
    }),
    buildTestFacilityProjection({
      facility: {
        id: '2',
        name: 'Facility 2',
        type: 'contract-total-facility',
        currency: 'USD',
        contracts: [],
        children: [],
        limits: [
          {
            type: 'total-limit',
            limit: 400000000,
            limitType: 'CREDIT',
            defaultLimit: false,
          },
        ],
      } as ContractTotalFacility,
      exposure: {
        type: 'homogenous-exposure-set',
        results: [
          {
            classification: { type: 'homogenous' },
            results: [
              {
                limit: {
                  type: 'total-limit',
                  limit: 600000000,
                  limitType: 'CREDIT',
                  defaultLimit: false,
                },
                balance: {
                  currency: 'USD',
                  provisionalInvestment: 0,
                  earmarkedInvestment: 1111111,
                  investment: 4444444,
                  maturity: 0,
                  earmarkedMaturity: 0,
                  provisionalMaturity: 0,
                  lockedMaturity: 5555555,
                  lockedInvestment: 0,
                },
                total: 600000000,
                used: 100000000,
                available: -100000000,
                currency: 'USD',
              },
            ],
          },
        ],
      },
    }),
  ];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ListFacilitiesComponent],
        imports: [
          FormsModule,
          MatInputModule,
          MatTableModule,
          MatCardModule,
          MatIconModule,
          MatFormFieldModule,
          MatButtonModule,
          SharedModule,
          BrowserAnimationsModule,
          MatProgressSpinnerModule,
          RouterTestingModule,
          HttpClientTestingModule,
        ],
        providers: [
          {
            provide: CrumbService,
            useValue: crumbService = MockService(CrumbService) as Mocked<CrumbService>,
          },
          {
            provide: ExposureService,
            useValue: exposureService = MockService(ExposureService) as Mocked<ExposureService>,
          },
          RouterTestingModule,
          HttpClientTestingModule,
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    exposureService.getFacilities.mockReturnValue(of(projections));

    fixture = TestBed.createComponent(ListFacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    exposureService.getFacilities.mockClear();
  });

  describe('GIVEN the component has been initialised', () => {
    test('THEN it should set breadcrumbs', () => {
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(listFacilitiesCrumb());
    });

    test('THEN it should initialise with list of partners', (done) => {
      const expectedRows: FacilityRow[] = [
        {
          id: projections[0].facility.id,
          name: projections[0].facility.name,
          currency: 'USD',
          creditLimit: 600000000,
          creditAvailable: 500000000,
          exposure: 100000000,
        },
        {
          id: projections[1].facility.id,
          name: projections[1].facility.name,
          currency: 'USD',
          creditLimit: 600000000,
          creditAvailable: -100000000,
          exposure: 100000000,
        },
      ];

      component.ngOnInit();

      component.facilities.subscribe((value) => {
        expect(value).toEqual(expectedRows);
        done();
      });
    });
  });

  describe('GIVEN facilities', () => {
    beforeEach(() => {
      exposureService.getFacilities.mockReturnValue(of(projections));
    });

    test('THEN a positive available credit should be highlighted appropriately', () => {
      component.facilities.subscribe((value) => {
        const positiveAvailableCredit = fixture.nativeElement.querySelectorAll(
          '[data-testid="facility-available"]',
        )[0];
        expect(positiveAvailableCredit.classList.contains('negative-number')).toBeFalsy();
      });
    });

    test('THEN a negative available credit should be highlighted appropriately', () => {
      component.facilities.subscribe((value) => {
        const negativeAvailableCredit = fixture.nativeElement.querySelectorAll(
          '[data-testid="facility-available"]',
        )[1];
        expect(negativeAvailableCredit.classList.contains('negative-number')).toBeTruthy();
      });
    });
  });
});
