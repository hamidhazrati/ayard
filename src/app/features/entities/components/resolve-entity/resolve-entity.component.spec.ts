import { ResolveEntityComponent } from './resolve-entity.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Observable, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { EntityService } from '@entities/services/entity.service';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ResolveEntityFormComponent } from './resolve-entity-form/resolve-entity-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@app/shared/shared.module';
import { EntitySearch } from '../../models/entity-search.model';
import { AuthService } from '@app/auth/auth-service';

describe('ResolveEntityComponent', () => {
  let fixture: ComponentFixture<ResolveEntityComponent>;
  let component: ResolveEntityComponent;
  let authService: AuthService;
  let crumbService: CrumbService;
  let entityService: EntityService;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatTableModule,
        MatSelectModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        SharedModule,
        HttpClientTestingModule,
      ],
      declarations: [ResolveEntityComponent, ResolveEntityFormComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            isAuthorised(permission: string) {
              return new Promise((resolve) => resolve(true));
            },
          },
        },
        CrumbService,
        EntityService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              name: 'Vodafone',
              dunsNumber: '123456789',
              country: 'GB',
            }),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate(url: Array<string>): Promise<boolean> {
              return new Promise((resolve) => resolve(true));
            },
          },
        },
        HttpClientTestingModule,
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolveEntityComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);
    crumbService = TestBed.inject(CrumbService);
    entityService = TestBed.inject(EntityService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should be created.', () => {
    expect(component).toBeTruthy();
  });

  it('should create the crumbs', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      jest.spyOn(component, 'search');
      jest.spyOn(crumbService, 'setCrumbs');

      const searchParameters = {
        name: 'Vodafone',
        dunsNumber: '123456789',
        country: 'GB',
      } as EntitySearch;

      expect(crumbService.setCrumbs).toHaveBeenCalledWith([
        { link: '/', title: 'Home' },
        { link: '/entities/resolve', title: 'Resolve Entities' },
      ]);
      expect(component.search).toHaveBeenCalledWith(searchParameters);
    });
  });

  it('should return the matching Entity list.', () => {
    jest.spyOn(router, 'navigate');
    jest.spyOn(entityService, 'search').mockReturnValue(
      of([
        {
          id: '123',
          entityId: '123-abc-123',
          name: 'ABC',
          dunsNumber: '757551635',
          entityIds: null,
          primaryAddress: {
            line1: 'Line 1',
            line2: 'Line 2',
            city: 'city',
            region: 'region',
            regionName: 'region',
            country: 'GB',
            countryName: 'United Kingdom',
            postalCode: '2000',
            postalCodeExtension: '2000',
          },
          matchScore: 95.0,
          status: 'ACTIVE',
        },
      ]),
    );

    const searchParameters = {
      name: 'Vodafone',
      dunsNumber: '123456789',
      country: 'GB',
    } as EntitySearch;

    component.search(searchParameters);
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should successfully catch errors from search call.', () => {
    jest.spyOn(entityService, 'search').mockReturnValue(throwError({ status: 400 }));
    const searchParameters = {
      name: 'Vodafone',
      dunsNumber: '123456789',
      country: 'GB',
    } as EntitySearch;

    component.search(searchParameters);
    expect(component.entitySearchResults.length).toBe(0);
    expect(component.loading).toBe(false);
    expect(component.showError).toBe(true);
    expect(component.errorMessage).toEqual(
      'Incorrect search parameters. Please correct and try again.',
    );
  });

  it('should successfully catch errors from search call (#2).', () => {
    jest.spyOn(entityService, 'search').mockReturnValue(throwError({ status: 403 }));
    const searchParameters = {
      name: 'Vodafone',
      dunsNumber: '123456789',
      country: 'GB',
    } as EntitySearch;

    component.search(searchParameters);
    expect(component.entitySearchResults.length).toBe(0);
    expect(component.loading).toBe(false);
    expect(component.showError).toBe(true);
    expect(component.errorMessage).toEqual(
      'An error has occurred while performing the search operation. Please try again later.',
    );
  });

  it('should redirect to another route.', () => {
    jest.spyOn(router, 'navigate');
    const dunsNumber = '7890123456';
    component.navigateToViewMatchCandidate(dunsNumber);
    expect(router.navigate).toHaveBeenCalledWith([`/entities/matchcandidates/${dunsNumber}`]);
  });

  it('should redirect to another route.', () => {
    jest.spyOn(router, 'navigate');
    const entityId = '7890123456';
    component.navigateToEntityDetails(entityId);
    expect(router.navigate).toHaveBeenCalledWith([`/entities/${entityId}`]);
  });

  it('should redirect to another route.', () => {
    jest.spyOn(router, 'navigate');
    const value = 'value';
    component.isValuePresent(value);
    expect(component.isValuePresent(value)).toBe(true);
  });
});
