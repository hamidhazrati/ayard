import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  CONTRACT_NAME_MAX_LENGTH,
  ContractFieldsFormComponent,
} from '@app/features/contracts/components/create-contract/contract-fields-form/contract-fields-form.component';
import { SharedModule } from '@app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ContractFields } from '@app/features/contracts/components/create-contract/contract-fields-form/contract-fields.model';
import { FormBuilder, FormGroup } from '@ng-stack/forms';
import { Contract } from '@app/features/contracts/models/contract.model';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { selectFirstOption } from '@app/shared/utils/test';

describe('ContractFieldsFormComponent', () => {
  let component: ContractFieldsFormComponent;
  let fixture: ComponentFixture<ContractFieldsFormComponent>;
  let loader: HarnessLoader;
  const formBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        MatDividerModule,
        MatIconModule,
        MatProgressSpinnerModule,
        HttpClientTestingModule,
        SharedModule,
      ],
      declarations: [ContractFieldsFormComponent],
      providers: [{ provide: FormBuilder, useValue: formBuilder }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractFieldsFormComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  describe('GIVEN the component is loaded', () => {
    test('THEN the component is created', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN the form is validated with no data entered', () => {
      beforeEach(() => {
        component.form.controls.name.markAsTouched();
        component.form.controls.status.markAsTouched();
        fixture.detectChanges();
      });

      test('THEN required errors are shown', () => {
        expect(getErrorTextForTestId('contract-name-error')).toBeTruthy();
      });
    });

    describe('WHEN a name is entered which is too long and validated', () => {
      beforeEach(() => {
        setInputTestElement('contract-name-input', randomString(CONTRACT_NAME_MAX_LENGTH + 1));
        selectFirstOption(fixture, 'contract-status-select');
        component.form.controls.name.markAsTouched();
        component.form.controls.status.markAsTouched();
        fixture.detectChanges();
      });

      test('THEN max length error is shown', () => {
        expect(getErrorTextForTestId('contract-name-error')).toEqual(
          `Name exceeds maximum length of ${CONTRACT_NAME_MAX_LENGTH}.`,
        );
      });
    });

    describe('WHEN the fields are entered and validated', () => {
      beforeEach(() => {
        setInputTestElement('contract-name-input', randomString(CONTRACT_NAME_MAX_LENGTH - 1));
        selectFirstOption(fixture, 'contract-status-select');
      });

      test('THEN no errors are shown', () => {
        expect(getErrorTextForTestId('contract-name-error')).toBeFalsy();
      });
    });

    describe('WHEN the form is registered by a parent form component', () => {
      const formGroup: FormGroup<ContractFieldsForm> = formBuilder.group<ContractFieldsForm>({
        contractFields: null,
      });

      beforeEach(() => {
        component.register(formGroup);
      });

      test('THEN the sub form has been added', () => {
        expect(formGroup.controls.contractFields).toBeTruthy();
      });
    });
  });

  describe('WHEN the component is supplied with a contract and initialised', () => {
    const contract: Contract = {
      productName: '',
      productCategoryName: '',
      productCategoryId: '',
      name: 'Brian',
      status: 'PENDING_APPROVAL',
      productId: null,
      product: null,
      partnerId: null,
      created: null,
      channelReference: null,
      rules: [],
      id: null,
      currencies: null,
      bypassTradeAcceptance: false,
    };

    beforeEach(() => {
      component.contract = contract;
      component.ngOnInit();
      fixture.detectChanges();
    });

    test('THEN the form fields have been pre-populated', async () => {
      expect(getDebugElementByTestId('contract-name-input').nativeElement.value).toEqual('Brian');
      const statusSelect = await loader.getHarness<MatSelectHarness>(
        MatSelectHarness.with({
          selector: '[data-testid="contract-status-select"]',
        }),
      );
      const selectValueText = await statusSelect.getValueText();
      expect(selectValueText).toEqual('Pending Approval');
    });
  });

  function getDebugElementByTestId(testId: string): DebugElement {
    return fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
  }

  function getErrorTextForTestId(testId: string) {
    return getDebugElementByTestId(testId).nativeElement.textContent;
  }

  async function setInputTestElement(id: string, data: string) {
    const inputElement = getDebugElementByTestId(id).nativeElement;
    inputElement.value = data;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function setSelectOption(id: string) {
    const select = getDebugElementByTestId(id);
    select.nativeElement.click();
    fixture.detectChanges();
    const selectOptions = fixture.debugElement.queryAll(By.css(`.${id}-option`));
    selectOptions[0].nativeElement.click();
    fixture.detectChanges();
  }

  function randomString(length: number): string {
    return 'A'.repeat(length);
  }
});

type ContractFieldsForm = {
  contractFields: ContractFields;
};
