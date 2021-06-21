import { CrumbService } from '@app/services/crumb/crumb.service';
import { EntityService } from '@entities/services/entity.service';
import { ViewEntityComponent } from '@entities/components/view-entity/view-entity.component';
import { ActivatedRoute, convertToParamMap, Navigation } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from '@app/shared/shared.module';
import { DunsFormatPipe } from './duns-format.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { Entity } from '@entities/models/entity.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '@app/auth/auth-service';
import { Location } from '@angular/common';

const ID = '123';
const sampleEntity = {
  id: '123',
  name: 'Acme Ltd',
  dunsNumber: '123456789',
  address: {
    line1: '1 Acacia Avenue',
    line2: 'line2',
    city: 'Salford',
    region: 'Manchester',
    regionName: 'Manchester',
    country: 'GB',
    countryName: 'United Kingdom',
    postalCode: 'AB1 2CD',
    postalCodeExtension: null,
  },
} as Entity;

describe('EntityComponent', () => {
  let component: ViewEntityComponent;

  let crumbService: CrumbService;
  let entityService: EntityService;
  let fixture: ComponentFixture<ViewEntityComponent>;
  let router: Router;
  let dialog: MatDialog;
  let snackBar: MatSnackBar;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEntityComponent, DunsFormatPipe],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        RouterTestingModule,
        SharedModule,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getUserName: () => Promise.resolve('ops-portal-admin'),
            isAuthorised: (scope?: string) => Promise.resolve(true),
          },
        },
        CrumbService,
        EntityService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '5fce5d30d31cb44d7ab4c405' }),
            snapshot: {
              paramMap: convertToParamMap({ id: ID }),
            },
          },
        },
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({
              id: null,
              initialUrl: null,
              trigger: null,
              extractedUrl: null,
              previousNavigation: null,
              extras: { state: null },
            }),
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open: () => ({ afterClosed: () => of(null) }),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(ViewEntityComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    crumbService = TestBed.inject(CrumbService);
    entityService = TestBed.inject(EntityService);
    dialog = TestBed.inject(MatDialog);
    snackBar = TestBed.inject(MatSnackBar);
    location = TestBed.inject(Location);

    // mock the dialog closing action
    jest
      .spyOn(dialog.open(ViewEntityComponent), 'afterClosed')
      .mockReturnValue(of({ action: 'rejected' }));

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load the necessary entity', () => {
    jest.spyOn(entityService, 'getEntityById').mockReturnValue(of(sampleEntity));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.entity).toBe(sampleEntity);
    expect(entityService.getEntityById).toHaveBeenCalled();
    expect(component.loading).toBe(false);
    expect(component.getEntity()).toBe(sampleEntity);
  });

  it('should open dialog upon action click', () => {
    jest.spyOn(dialog, 'open');
    component.onActioned('approved');
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should toggle alert off accordingly', () => {
    component.onClosed();
    expect(component.showAlert).toBe(false);
  });

  it('should display history of entity as expected', () => {
    jest.spyOn(dialog, 'open');
    component.onHistoryView();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should return a region if not regionName exists', () => {
    const entity = {
      ...sampleEntity,
      address: { ...sampleEntity.address, regionName: null },
    };

    jest.spyOn(entityService, 'getEntityById').mockReturnValue(of(entity));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.entity).toBe(entity);
    expect(component.regionNameIfNotRegionCode).toEqual(entity.address.region);
  });

  it('should return a regionName', () => {
    jest.spyOn(entityService, 'getEntityById').mockReturnValue(of(sampleEntity));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.regionNameIfNotRegionCode).toEqual(sampleEntity.address.regionName);
  });

  it('should return a region (in the scenario of registered address having a regionName)', () => {
    const entity = {
      ...sampleEntity,
      registeredAddress: { ...sampleEntity.address, regionName: 'Manchester' },
    };

    jest.spyOn(entityService, 'getEntityById').mockReturnValue(of(entity));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.registeredAddressRegionNameIfNotRegionCode).toEqual(
      entity.registeredAddress.regionName,
    );
  });

  it('should return a region (in the scenario of registered address not having a regionName)', () => {
    const entity = {
      ...sampleEntity,
      registeredAddress: { ...sampleEntity.address, regionName: null },
    };

    jest.spyOn(entityService, 'getEntityById').mockReturnValue(of(entity));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.registeredAddressRegionNameIfNotRegionCode).toEqual(
      entity.registeredAddress.region,
    );
  });
});
