import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListEntitiesComponent } from './list-entities.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { RouterTestingModule } from '@angular/router/testing';
import { listEntitiesCrumb } from './list-entities.crumb';
import { EntityService } from '../../services/entity.service';
import { of } from 'rxjs';
import { SharedModule } from '@app/shared/shared.module';
import { Entity } from '@entities/models/entity.model';
import { AuthService } from '@app/auth/auth-service';
import { KeycloakAngularModule } from 'keycloak-angular';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

describe('ListEntitiesComponent', () => {
  let component: ListEntitiesComponent;
  let fixture: ComponentFixture<ListEntitiesComponent>;

  let crumbService: CrumbService;
  let entityService: EntityService;

  const entities: Entity[] = [
    {
      id: '1',
      name: 'coupa',
      dunsNumber: 'string',
      address: {
        line1: '',
        line2: '',
        city: '',
        region: '',
        regionName: '',
        country: '',
        countryName: '',
        postalCode: '',
        postalCodeExtension: '',
      },
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListEntitiesComponent],
      imports: [
        FormsModule,
        KeycloakAngularModule,
        MatInputModule,
        MatTableModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatButtonModule,
        SharedModule,
        BrowserAnimationsModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            isAuthorised(scope: string) {
              return new Promise((resolve) => resolve(true));
            },
          },
        },
        CrumbService,
        EntityService,
      ],
    });

    fixture = TestBed.createComponent(ListEntitiesComponent);
    component = fixture.componentInstance;
    crumbService = TestBed.inject(CrumbService);
    entityService = TestBed.inject(EntityService);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should add to the subscription list and set entities', () => {
    jest.spyOn(component.subscriptions, 'add');
    jest.spyOn(crumbService, 'setCrumbs');
    jest.spyOn(component, 'getEntities');
    jest.spyOn(component.source, 'next');

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.subscriptions.add).toHaveBeenCalled();
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(listEntitiesCrumb());
      expect(component.getEntities).toHaveBeenCalled();
      expect(component.source.next).toHaveBeenCalled();
    });
  });

  it('should change the model', () => {
    const query = 'Virgin Active';
    jest.spyOn(component.searchValueChanged, 'next');
    component.onModelChange(query);
    expect(component.searchValueChanged.next).toHaveBeenCalledWith(query);
    expect(component.query).toEqual(query);
  });

  it('should send requests based on parameters', () => {
    const query = { pageIndex: 1, pageSize: 5 };
    const response = [];
    jest.spyOn(component, 'getEntities').mockReturnValue(of(response));
    jest.spyOn(component.source, 'next');
    jest.spyOn(component.subscriptions, 'add');

    component.query = 'Buyer';
    component.onPage(query);
    fixture.detectChanges();
    expect(component.getEntities).toHaveBeenCalledWith(component.query, {
      page: query.pageIndex,
      size: query.pageSize,
    });
    expect(component.source.next).toHaveBeenCalledWith(response);
    expect(component.subscriptions.add).toHaveBeenCalled();
  });
});
