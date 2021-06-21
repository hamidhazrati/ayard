import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { FacilitySelectorComponent } from './facility-selector.component';
import { SharedModule } from '@app/shared/shared.module';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import Mocked = jest.Mocked;
import { getByTestId, selectFirstOption } from '@app/shared/utils/test';
import { FacilityService } from '@app/features/facilities/services/facility.service';
import { FacilitySearchResult } from '@app/features/facilities/models/facility-search-result.model';
import { Facility } from '@app/features/facilities/models/facility.model';

describe('FacilitySelectorComponent', () => {
  const searchResults: FacilitySearchResult[] = [
    {
      facility: {
        id: 'c1',
        name: 'facility',
      } as Facility,
      facilityTree: {
        id: 'r1',
        name: 'relationship',
      } as Facility,
    },
  ];

  let component: FacilitySelectorComponent;
  let fixture: ComponentFixture<FacilitySelectorComponent>;
  const facilityService: Mocked<FacilityService> = MockService(FacilityService) as Mocked<
    FacilityService
  >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FacilitySelectorComponent],
      imports: [SharedModule, NoopAnimationsModule],
      providers: [{ provide: FacilityService, useValue: facilityService }],
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    facilityService.search.mockReturnValue(of(searchResults));
    fixture = TestBed.createComponent(FacilitySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('GIVEN the component is loaded', () => {
    test('THEN the component is created', () => {
      expect(component).toBeTruthy();
    });

    test('THEN the relationship selector is displayed and the facility selector is not', () => {
      expect(getByTestId(fixture, 'relationship')).toBeTruthy();
      expect(getByTestId(fixture, 'facility')).toBeFalsy();
      expect(facilityService.search).toHaveBeenCalledWith({ type: 'contract' });
    });

    describe('WHEN the category is chosen', () => {
      beforeEach(() => selectFirstOption(fixture, 'relationship'));

      test('THEN the facility selector is displayed', () => {
        expect(getByTestId(fixture, 'facility')).toBeTruthy();
      });

      describe('WHEN the facility is chosen', () => {
        beforeEach(() => selectFirstOption(fixture, 'facility'));

        test('THEN the relationship and facility are populated in the form', () => {
          const formControl = component.form.controls;
          expect(formControl.relationship.value.facilities).toEqual([searchResults[0].facility]);
          expect(formControl.facility.value).toEqual(searchResults[0].facility);
        });
      });
    });
  });
});
