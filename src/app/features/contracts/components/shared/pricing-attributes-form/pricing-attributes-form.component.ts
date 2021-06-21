import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@ng-stack/forms';
import {
  DocumentTypes,
  CalculationType,
  CashflowExclusions,
  AdjustmentCalendarType,
  Contract,
} from '@app/features/contracts/models/contract.model';
import { SubForm } from '@app/shared/form/sub-form';
import { RangeValue, RangeValidator } from '@app/shared/validators/range.validator';
import { ProductCounterpartyRole } from '@app/features/products/models/product-counterparty-role.model';
import { MatOptionSelectionChange } from '@angular/material/core';
import { DuplicateChecksComponent } from '@app/features/contracts/components/shared/duplicate-check-fields/duplicate-checks.component';
import { FormArray } from '@angular/forms';
import * as PRICING_CONSTANTS from '@app/features/contracts/components/shared/pricing-attributes-form/model/constants';
import { PricingFields } from '@app/features/contracts/components/shared/pricing-attributes-form/model/types';
import {
  BuildHours,
  getPricingFields,
} from '@app/features/contracts/components/shared/pricing-attributes-form/model/functions';
import { SharedModule } from '@app/shared/shared.module';
import { FormErrorComponent } from '@app/shared/components/form-error/form-error.component';

@Component({
  selector: 'app-pricing-attributes-form',
  templateUrl: './pricing-attributes-form.component.html',
  styleUrls: ['./pricing-attributes-form.component.scss'],
})
export class PricingAttributesFormComponent implements OnInit, OnChanges, SubForm, AfterViewInit {
  @Input()
  readonly = false;
  @Input()
  contract: Contract;
  @Input()
  counterpartyRoles: ProductCounterpartyRole[] = [];
  @Input()
  duplicateCheckEnabled = false;

  @ViewChildren(DuplicateChecksComponent)
  private duplicateCheckFieldsForm: QueryList<DuplicateChecksComponent>;

  isRequired = false;
  form: FormGroup<PricingFields>;
  hoursOfDay = BuildHours();

  pricintConstants = PRICING_CONSTANTS;

  defaultAdvanceRate = 100;
  advanceRateMax = 100;
  advanceRateMin = 0.1;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loadForm();
  }

  loadForm() {
    this.isRequired = this.contract?.status === 'APPROVED' || this.contract?.status === 'ACTIVE';
    const required = this.isRequired ? Validators.required : Validators.nullValidator;

    this.form = this.formBuilder.group<PricingFields>({
      discountMode: this.formBuilder.control(null, required),
      roundingMode: this.formBuilder.control(PRICING_CONSTANTS.roundingModes[0].value, required),

      tenorRange: this.formBuilder.group<RangeValue>(
        {
          min: this.formBuilder.control<number>(
            { value: null, disabled: false },
            Validators.compose([required, Validators.min(1)]),
          ),
          max: this.formBuilder.control<number>(
            { value: null, disabled: false },
            Validators.compose([required]),
          ),
        },
        {
          validator: Validators.compose([RangeValidator]),
          asyncValidator: Validators.composeAsync([]),
        },
      ),

      settlementDays: this.formBuilder.control<number>(
        { value: null, disabled: false },
        Validators.compose([required, Validators.min(0), Validators.max(4)]),
      ),
      spread: this.formBuilder.control<number>(null, required),
      tradingCutoff: this.formBuilder.control<string>(null, required),
      referenceRateAdjustmentType: this.formBuilder.control<AdjustmentCalendarType>({
        value: PRICING_CONSTANTS.adjustmentCalendarTypes[0].value,
        disabled: false,
      }),
      referenceRateOffset: this.formBuilder.control<number>(
        { value: PRICING_CONSTANTS.referenceRateOffsetValues[0].value, disabled: false },
        Validators.compose([required, Validators.max(-1)]),
      ),
      pricingOperation: this.formBuilder.control<string>({
        value: PRICING_CONSTANTS.pricingOperations[0].value,
        disabled: false,
      }),
      calculationType: this.formBuilder.control<CalculationType>({
        value: PRICING_CONSTANTS.calculationTypes[0].value,
        disabled: false,
      }),
      exclusions: this.formBuilder.control<CashflowExclusions[]>([
        ...PRICING_CONSTANTS.exclusions.map((v) => v.value),
      ]),
      documentTypes: this.formBuilder.control<DocumentTypes[]>([
        PRICING_CONSTANTS.documentTypes[0].value,
      ]),
      advanceRate: this.formBuilder.control<number>(
        this.defaultAdvanceRate,
        Validators.compose([
          required,
          Validators.min(this.advanceRateMin),
          Validators.max(this.advanceRateMax),
        ]),
      ),
      automatedPayment: this.formBuilder.control<boolean>(false),
      bauObligorName: this.formBuilder.control<string>(null, required),
      discountPosting: this.formBuilder.control<string>(null, required),
      leadDays: this.formBuilder.control<number>(null, required),
      rejectionMode: this.formBuilder.control(PRICING_CONSTANTS.rejectionModes[0].value),
      hashExpressions: this.formBuilder.control<string[]>(null),
    });

    if (this.readonly === true) {
      this.form.disable();
    }

    if (this.contract) {
      this.form.setValue(getPricingFields(this.contract));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.readonly?.currentValue === false) {
      this.form?.enable();
    }
  }

  ngAfterViewInit() {
    this.duplicateCheckFieldsForm?.forEach((subForm) => {
      setTimeout(() => {
        subForm.register(this.form);
      });
    });

    const registerSubForms = (queryList: QueryList<SubForm>, control: FormGroup | FormArray) => {
      queryList.forEach((subForm) => {
        setTimeout(() => {
          subForm.register(control);
        });
      });
    };
    this.duplicateCheckFieldsForm.changes.subscribe((queryList: QueryList<SubForm>) => {
      registerSubForms(queryList, this.form);
    });
  }

  register(control: FormGroup) {
    control.setControl('pricingFields', this.form);
  }

  documentTypesChangeListener(event: MatOptionSelectionChange) {
    if (event.isUserInput && event.source.value === 'INVOICE' && !event.source.selected) {
      this.duplicateCheckFieldsForm.toArray()[0].clearSelectionState();
    }
  }
}
