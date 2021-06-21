import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@app/shared/shared.module';
import { EntityService } from '@entities/services/entity.service';
import { MockService } from 'ng-mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Entity } from '@entities/models/entity.model';
import { CreatePartnerComponent } from '@app/features/partners/components/create-partners/create-partner.component';
import { PartnerService } from '@app/features/partners/services/partner.service';
import { EntitiesModule } from '@entities/entities.module';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import Mocked = jest.Mocked;

const dummyEntity: Entity = {
  id: '1234',
  name: 'Bobs Emporium',
  dunsNumber: '123456789',
  address: null,
};

describe('Create Partner Component', () => {
  let component: CreatePartnerComponent;
  let partnerService: Mocked<PartnerService>;
  let entityService: EntityService;
  let fixture: ComponentFixture<CreatePartnerComponent>;
  let router: Mocked<Router>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePartnerComponent],
      imports: [SharedModule, NoopAnimationsModule, RouterTestingModule, EntitiesModule],
      providers: [
        { provide: EntityService, useValue: entityService = MockService(EntityService) },
        {
          provide: PartnerService,
          useValue: partnerService = MockService(PartnerService) as Mocked<PartnerService>,
        },
        { provide: Router, useValue: router = MockService(Router) as Mocked<Router> },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN the Create Partner Component is initialised', () => {
    test('THEN it should create component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('GIVEN an valid entity is selected and Create Partner button is clicked', () => {
    beforeEach(() => {
      component.form.controls.name.clearAsyncValidators();
      component.form.controls.entity.setValue(dummyEntity);
      component.form.controls.name.setValue('name');
      component.form.controls.partnerId.setValue('Some Partner Id');
    });

    test('THEN it should create a partner', () => {
      partnerService.createPartner.mockImplementation((request) => {
        expect(request).toEqual({
          entityId: dummyEntity.id,
          name: 'name',
          id: 'Some Partner Id',
        });
        return of({ id: '123' });
      });
      component.createPartner();

      expect(router.navigate).toHaveBeenCalledWith(['/partners']);
    });
  });

  describe('GIVEN an invalid entity is selected and Create Partner button is clicked', () => {
    beforeEach(() => {
      component.form.controls.entity.setValue(null);
    });

    test('THEN it should not create a partner', () => {
      component.createPartner();
      expect(component.form.valid).toBe(false);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    });

    test('THEN it should show Valid Entity is Required', () => {
      expect(component.form.controls.entity.touched).toBeFalsy();
      expect(component.form.valid).toBe(false);
      component.createPartner();
      expect(component.form.controls.entity.touched).toBeTruthy();
      expect(component.form.valid).toBe(false);
    });
  });

  describe('GIVEN a Invalid Values', () => {
    beforeEach(() => {
      component.form.controls.name.clearAsyncValidators();
      component.form.controls.entity.setValue(dummyEntity);
      component.form.controls.name.setValue('name');
      component.form.controls.partnerId.setValue('Some Partner Id');
    });

    test('THEN it should return set correct duplicate error message for Partner Id', () => {
      partnerService.createPartner.mockReturnValue(
        throwError({
          status: 409,
          error: {
            status: 409,
            title: 'Duplicate',
            code: 'DUPLICATE',
            details: [
              {
                target: 'id:id-123',
                description: 'Duplicate key: id:id-123',
              },
            ],
          },
        }),
      );

      component.createPartner();

      expect(component.serverError).toEqual('Partner Id already exists');
    });

    test('THEN it should return set correct duplicate error message for Partner Name', () => {
      partnerService.createPartner.mockReturnValue(
        throwError({
          status: 409,
          error: {
            status: 409,
            title: 'Duplicate',
            code: 'DUPLICATE',
            details: [
              {
                target: '{"name": "Some Partner 1" }',
                description: 'Duplicate key: {"name": "Some Partner 1" }',
              },
            ],
          },
        }),
      );

      component.createPartner();

      expect(component.serverError).toEqual('Partner name already exists');
    });

    test('THEN it should return set correct duplicate error message for Entity', () => {
      partnerService.createPartner.mockReturnValue(
        throwError({
          status: 409,
          error: {
            status: 409,
            title: 'Duplicate',
            code: 'DUPLICATE',
            details: [
              {
                target: '{"entityId": "entity-1" }',
                description: 'Duplicate key: {"entityId": "entity-1" }',
              },
            ],
          },
        }),
      );

      component.createPartner();

      expect(component.serverError).toEqual('Partner already exists for Entity');
    });

    test('THEN it should return set correct validation error message', () => {
      partnerService.createPartner.mockReturnValue(
        throwError({
          status: 400,
          error: {
            status: 400,
            title: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: [
              {
                target: 'id',
                code: 'INVALID',
                description:
                  'Partner Id must contains A-Z,a-z,0-9,-,_ and length must be between 5 and 25',
              },
            ],
          },
        }),
      );

      component.createPartner();

      expect(component.serverError).toEqual(
        'Partner Id must contains A-Z,a-z,0-9,-,_ and length must be between 5 and 25',
      );
    });

    test('THEN it should return set correct error message for unhandled error', () => {
      partnerService.createPartner.mockReturnValue(
        throwError({
          status: 500,
          error: {
            status: 500,
          },
        }),
      );

      component.createPartner();

      expect(component.serverError).toEqual('Error from server');
    });
  });
});
