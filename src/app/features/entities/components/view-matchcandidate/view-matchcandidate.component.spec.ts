import { CrumbService } from '@app/services/crumb/crumb.service';
import { EntityService } from '@entities/services/entity.service';
import { ViewMatchCandidateComponent } from '@entities/components/view-matchcandidate/view-matchcandidate.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MockService } from 'ng-mocks';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from '@app/shared/shared.module';
import { viewMatchCandidateCrumb } from './view-matchcandidate.crumb';
import { getByTestId } from '@app/shared/utils/test';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import Mocked = jest.Mocked;

const ID = '123456789';
const sampleMatchCandidate = {
  id: '123',
  entityId: null,
  name: 'Acme Limited',
  dunsNumber: '123456789',
  entityIds: null,
  packagesData: null,
  primaryAddress: {
    line1: '1 Acacia Avenue',
    line2: 'line2',
    city: 'Salford',
    region: 'MN',
    regionName: 'Manchester',
    country: 'GB',
    countryName: 'United Kingdom',
    postalCode: 'AB1 2CD',
    postalCodeExtension: null,
  },
  matchScore: 45,
  status: 'REVIEW_REQUIRED',
};

describe('ViewMatchCandidateComponent', () => {
  let component: ViewMatchCandidateComponent;
  let crumbService;
  let entityService;
  let fixture: ComponentFixture<ViewMatchCandidateComponent>;
  let router: Mocked<Router>;
  let location: Mocked<Location>;

  beforeEach(() => {
    crumbService = new CrumbService();

    TestBed.configureTestingModule({
      declarations: [ViewMatchCandidateComponent],
      imports: [HttpClientTestingModule, MatCardModule, MatListModule, SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: ID }) } },
        },
        { provide: EntityService, useValue: entityService = MockService(EntityService) },
        { provide: CrumbService, useValue: crumbService = MockService(CrumbService) },
        { provide: Router, useValue: router = MockService(Router) as Mocked<Router> },
        { provide: Location, useValue: location = MockService(Location) as Mocked<Location> },
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    });
    router.getCurrentNavigation.mockReturnValue({
      id: null,
      initialUrl: null,
      trigger: null,
      extractedUrl: null,
      previousNavigation: null,
      extras: { state: null },
    });
    fixture = TestBed.createComponent(ViewMatchCandidateComponent);

    component = fixture.componentInstance;
  });

  describe('GIVEN ViewMatchCandidateComponent is initialised', () => {
    test('THEN the crumbservice should be called', () => {
      entityService.search.mockReturnValue(of([sampleMatchCandidate]));
      component.ngOnInit();
      fixture.detectChanges();
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(
        viewMatchCandidateCrumb(sampleMatchCandidate),
      );
    });

    describe('GIVEN a dunsNumber', () => {
      test('THEN the component should be set with matchCandidate for given dunsNumber', () => {
        entityService.search.mockReturnValue(of([sampleMatchCandidate]));
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.entityMatchCandidate).toEqual(sampleMatchCandidate);
      });

      test('THEN it should initialise with the entity', () => {
        entityService.search.mockReturnValue(of([sampleMatchCandidate]));
        component.ngOnInit();
        fixture.detectChanges();

        expectMatch('title', 'Acme Limited');
        expectMatch('duns-number', '123456789');
        expectMatch('address-line-1', '1 Acacia Avenue');
        expectMatch('address-line-2', 'line2');
        expectMatch('city', 'Salford');
        expectMatch('country', 'United Kingdom');
        expectMatch('postcode', 'AB1 2CD');

        const saveButton = getByTestId(fixture, 'save');
        expect(saveButton).toBeTruthy();

        const cancelButton = getByTestId(fixture, 'cancel');
        expect(cancelButton).toBeTruthy();
      });
    });

    describe('GIVEN an matchcandidate details are fetched', () => {
      describe('when user clicks on save button', () => {
        test('THEN it should create new enity and navigate to entity details page', () => {
          entityService.createFromDuns.mockImplementation((duns) => {
            expect(duns).toBe('757551635');
            return of({
              id: '123',
              name: 'ABC',
              dunsNumber: '757551635',
            });
          });

          fixture.componentInstance.createEntity('757551635');

          expect(entityService.createFromDuns).toHaveBeenCalledWith('757551635');
          expect(router.navigate).toHaveBeenCalledWith(['/entities/123'], {
            state: { createdStatus: 'new' },
          });
        });
      });

      describe('when user clicks on Cancel button', () => {
        test('THEN it should navigate back to previous page', () => {
          fixture.componentInstance.cancel();
          expect(location.back).toHaveBeenCalled();
        });
      });
    });
  });

  function expectMatch(selector: string, expectedValue: string) {
    const debugElement = getByTestId(fixture, selector);
    const value = debugElement.nativeElement.textContent.trim();
    expect(value).toEqual(expectedValue);
  }
});
