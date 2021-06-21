import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { CounterpartyRoleConfiguratorComponent } from '@app/features/products/components/create-product/counterparty-role-side-bar/counterparty-role-configurator/counterparty-role-configurator.component';
import { CounterpartyRoleFormBuilder } from '@app/features/products/counterparty-role-form-builder/counterparty-role-form-builder.service';
import { CounterpartyRoleService } from '@app/features/counterparty-roles/services/counterparty-role.service';
import { MockService } from '@app/shared/utils/test/mock';
import {
  productsModuleDeclarations,
  productsModuleImports,
} from '@app/features/products/products.module';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getByTestId, selectFirstOption, triggerClick } from '@app/shared/utils/test';
import { By } from '@angular/platform-browser';

describe('CounterpartyRoleConfiguratorComponent', () => {
  let component: CounterpartyRoleConfiguratorComponent;
  let fixture: ComponentFixture<CounterpartyRoleConfiguratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [productsModuleDeclarations],
      imports: [productsModuleImports, HttpClientModule, NoopAnimationsModule],
      providers: [
        {
          provide: CounterpartyRoleService,
          useValue: MockService(CounterpartyRoleService),
        },
        CounterpartyRoleFormBuilder,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterpartyRoleConfiguratorComponent);
    component = fixture.componentInstance;
    component.productCounterpartyRole = {
      id: '12345',
      name: 'SELLER',
      description: 'Seller',
      required: true,
    };
    fixture.detectChanges();
  });

  describe('GIVEN the component is instantiated', () => {
    test('THEN it should instantiate correctly', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('should emit form when populated with valid values', () => {
    beforeEach(() => {
      selectFirstOption(fixture, 'role-type-select');
    });

    describe('WHEN the user clicks the save button', () => {
      beforeEach(fakeAsync(() => {
        spyOn(component.save, 'emit');
        givenSaveIsClicked();
      }));

      test('THEN save event is emitted', () => {
        expect(component.save.emit).toHaveBeenCalledWith({
          name: 'SELLER',
          description: 'Seller',
          required: true,
          type: 'PRIMARY',
        });
      });
    });
  });

  describe('should show form validation errors when populated with invalid values', () => {
    beforeEach(() => {
      component.form.controls.type.markAsTouched();
      givenSaveIsClicked();
      fixture.detectChanges();
    });

    test('THEN required errors are shown', () => {
      thenErrorIs('role-type-error', 'Counterparty type is required.');
    });
  });

  function givenSaveIsClicked() {
    const saveButton = fixture.debugElement.query(By.css('[data-testid="save"]'));
    triggerClick(fixture, saveButton);
  }

  function thenErrorIs(id: string, error: string) {
    const errorEl = getByTestId(fixture, id);
    expect(errorEl.nativeElement.textContent).toEqual(error);
  }
});
