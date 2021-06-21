import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MockComponent, MockHelper, MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { CreateFacilityComponent } from '@app/features/facilities/components/create-facility/create-facility.component';
import { FacilityService } from '@app/features/facilities/services/facility.service';
import { CreateFacilityFormComponent } from '@app/features/facilities/components/create-facility/create-facility-form/create-facility-form.component';
import { CreateFacilityOperation } from '@app/features/facilities/models/facility-operate.model';
import { createFacilityCrumb } from '@app/features/facilities/components/create-facility/create-facility.crumb';
import { SharedModule } from '@app/shared/shared.module';
import Mocked = jest.Mocked;

describe('WHEN CreateFacilityComponent is created', () => {
  let component: CreateFacilityComponent;
  let fixture: ComponentFixture<CreateFacilityComponent>;

  let router: Mocked<Router>;
  let crumbService: Mocked<CrumbService>;
  let facilityService: Mocked<FacilityService>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          ReactiveFormsModule,
          MatCardModule,
          MatInputModule,
          MatSelectModule,
          HttpClientTestingModule,
          SharedModule,
        ],
        declarations: [CreateFacilityComponent, MockComponent(CreateFacilityFormComponent)],
        providers: [
          { provide: FormBuilder, useValue: new FormBuilder() },
          {
            provide: CrumbService,
            useValue: crumbService = MockService(CrumbService) as Mocked<CrumbService>,
          },
          { provide: Router, useValue: router = MockService(Router) as Mocked<Router> },
          {
            provide: FacilityService,
            useValue: facilityService = MockService(FacilityService) as Mocked<FacilityService>,
          },
          HttpClientTestingModule,
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CreateFacilityComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }),
  );

  it('THEN breadcrumbs should be set', () => {
    expect(crumbService.setCrumbs).toHaveBeenCalledWith(createFacilityCrumb());
  });

  it('THEN should redirect to newly created facility in case of "save" event', () => {
    const operation = {} as CreateFacilityOperation;

    facilityService.operateFacility.mockImplementation((o) => {
      expect(o).toBe(operation);
      return of({ id: '123' });
    });

    const eventEmitter = MockHelper.findOrFail(fixture.debugElement, CreateFacilityFormComponent)
      .componentInstance.save;

    eventEmitter.emit(operation);

    expect(facilityService.operateFacility).toHaveBeenCalledWith(operation);
    expect(router.navigate).toHaveBeenCalledWith(['/facilities', '123']);
  });
});
