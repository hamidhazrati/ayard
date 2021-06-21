import { CreateEntityComponent } from './create-entity.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Entity } from '@entities/models/entity.model';
import { of } from 'rxjs';
import { EntityService } from '@entities/services/entity.service';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { CreateEntityFormComponent } from './create-entity-form/create-entity-form.component';
import { MockComponent } from 'ng-mocks';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateEntityComponent', () => {
  let component: CreateEntityComponent;
  let fixture: ComponentFixture<CreateEntityComponent>;
  let entityService: EntityService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        MatDividerModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        SharedModule,
        HttpClientTestingModule,
      ],
      declarations: [CreateEntityComponent, MockComponent(CreateEntityFormComponent)],
      providers: [
        EntityService,
        {
          provide: Router,
          useValue: {
            navigate(url?: string) {
              return new Promise((resolve) => resolve({}));
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEntityComponent);
    component = fixture.componentInstance;
    entityService = TestBed.inject(EntityService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should initialize.', () => {
    expect(component).toBeTruthy();
  });

  it('should handle submission from create-entity-form gracefully.', () => {
    jest.spyOn(entityService, 'saveEntity').mockReturnValue(of({ id: '098403984' }));
    jest.spyOn(router, 'navigate');

    const entity: Entity = {
      id: null,
      name: 'James Bond',
      shortName: 'james.bond',
      address: {
        line1: 'The Furs, Alconbury Avenue',
        line2: 'Tonbridge',
        city: 'Kent',
        country: 'GB',
        region: 'England',
        postalCode: 'TN2 6PY',
      },
    };

    component.handleSubmit(entity);
    expect(entityService.saveEntity).toHaveBeenCalledWith(entity);
    expect(router.navigate).toHaveBeenCalledWith(['/entities']);
  });
});
