import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@app/shared/shared.module';
import { EntityService } from '@entities/services/entity.service';
import { MockService } from 'ng-mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CounterpartyFormComponent } from './counterparty-form.component';
import { ProductCounterpartyRole } from '../../../../products/models/product-counterparty-role.model';
import { EntitySelectorComponent } from '@entities/components/entity-selector/entity-selector.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormArray } from '@ng-stack/forms';
import { Entity } from '@entities/models/entity.model';
import { By } from '@angular/platform-browser';

const pcrt: ProductCounterpartyRole = {
  name: 'SELLER',
  description: 'Seller',
  required: true,
  type: 'PRIMARY',
};

const dummyEntity: Entity = {
  id: '1234',
  name: 'Bobs Emporium',
  dunsNumber: '123456789',
  address: null,
};

describe('CounterpartyFormComponent', () => {
  let component: CounterpartyFormComponent;
  let entityService: EntityService;
  let fixture: ComponentFixture<CounterpartyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CounterpartyFormComponent, EntitySelectorComponent],
      imports: [SharedModule, NoopAnimationsModule, RouterTestingModule],
      providers: [{ provide: EntityService, useValue: entityService = MockService(EntityService) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterpartyFormComponent);
    component = fixture.componentInstance;
    component.productCounterpartyRole = pcrt;
    fixture.detectChanges();
  });

  describe('GIVEN the component is initialised', () => {
    test('THEN it should create', () => {
      expect(component).toBeTruthy();
    });
    test('THEN it should have a single entity for the role', () => {
      expect(component.form.controls.length).toBe(1);
      expect((component as any).subscriptions.length).toBe(2);
    });
    test('THEN labels should be correct', () => {
      let element = fixture.debugElement.query(By.css('[data-testid="role-name"]'));
      expect(element.nativeElement.textContent).toContain(pcrt.name);
      element = fixture.debugElement.query(By.css('[data-testid="role-description"]'));
      expect(element.nativeElement.textContent).toContain(pcrt.description);
    });
    describe('WHEN we register it with a parent component FormArray', () => {
      test('THEN it should set itself', () => {
        const dummyFormArray: FormArray = new FormArray([]);
        component.register(dummyFormArray);
        expect(dummyFormArray.controls.length).toBe(1);
        expect(dummyFormArray.controls[0]).toBe(component.form);
      });
    });
    describe('WHEN we add an extra entity', () => {
      beforeEach(() => {
        component.onAddEntity();
      });
      test('THEN the new entity is added properly', () => {
        expect(component.form.controls.length).toBe(2);
        expect((component as any).subscriptions.length).toBe(4);
      });
      describe('WHEN we delete the first entity', () => {
        test('THEN entity is removed', () => {
          const controlToRemove = component.form.controls[0];
          component.onRemoveEntity(0);
          expect(component.form.controls.length).toBe(1);
          expect(component.form.controls[0]).not.toBe(controlToRemove);
        });
        test('THEN the form to be marked as touched', () => {
          component.onRemoveEntity(0);
          expect(component.form.touched).toBeTruthy();
        });
      });
      describe('WHEN we have no entitys set', () => {
        describe('WHEN we run the duplicate validator', () => {
          test('THEN validation passes', () => {
            const result = component.duplicateEntityValidator();
            expect(result).toBe(null);
          });
        });
        describe('WHEN we run the at least one validator', () => {
          test('THEN validation fails', () => {
            const result = component.requiredAtLeastOneValueValidator();
            expect(result).toEqual({ requiredAtLeastOne: true });
          });
        });
      });
      describe('WHEN we have duplicate entities set', () => {
        beforeEach(() => {
          component.form.controls.forEach((formGroup) => {
            formGroup.controls.entity.setValue(dummyEntity);
          });
          component.form.updateValueAndValidity();
        });
        describe('WHEN we run the duplicate validator', () => {
          test('THEN validation fails', () => {
            const result = component.duplicateEntityValidator();
            expect(result).toEqual({ cannotContainDuplicates: true });
          });
        });
        describe('WHEN we run the at least one validator', () => {
          test('THEN validation passes', () => {
            const result = component.requiredAtLeastOneValueValidator();
            expect(result).toBe(null);
          });
        });
      });
    });
    describe('WHEN we destroy the component', () => {
      test('THEN its subscriptions should be removed', () => {
        const subscription = spyOn((component as any).subscriptions[0], 'unsubscribe');
        component.ngOnDestroy();
        expect(subscription).toHaveBeenCalled();
      });
    });
  });
});
