import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Router } from '@angular/router';
import {
  ContractCounterPartiesService,
  CreateContractRequest,
} from '@app/features/contracts/services/contract-counterparties.service';
import { createContractCrumb } from '@app/features/contracts/components/create-contract/create-contract.crumb';
import { Control, FormBuilder, FormGroup } from '@ng-stack/forms';
import { Entity } from '@entities/models/entity.model';
import { ProductCounterpartyRole } from '@app/features/products/models/product-counterparty-role.model';
import { Rule } from '@app/features/products/models/rule.model';
import { SubForm } from '@app/shared/form/sub-form';
import { ContractFields } from '@app/features/contracts/components/create-contract/contract-fields-form/contract-fields.model';
import { ContractFieldsFormComponent } from '@app/features/contracts/components/create-contract/contract-fields-form/contract-fields-form.component';
import { PricingAttributesFormComponent } from '../shared/pricing-attributes-form/pricing-attributes-form.component';
import { FormArray } from '@angular/forms';
import { CounterpartyFormComponent } from './counterparty-form/counterparty-form.component';
import { CategoryAndProduct } from '@app/features/contracts/components/create-contract/product-selector/product-selector.component';
import {
  CurrencyForm,
  PricingCurrencyFormComponent,
} from '../shared/pricing-currency-form/pricing-currency-form.component';
import { PartnerService } from '@app/features/partners/services/partner.service';
import { Partner } from '@app/features/partners/model/partner.model';
import { Observable } from 'rxjs';
import { Product } from '@app/features/products/models/product.model';
import { Contract } from '@app/features/contracts/models/contract.model';
import { PricingForm } from '@app/features/contracts/components/shared/pricing-attributes-form/model/types';
import { setContractFields } from '@app/features/contracts/components/shared/pricing-attributes-form/model/functions';

export const CHANNEL_REFERENCE = 'Verdi UI';

type CounterpartyEntityControl = {
  productCounterpartyRole: Control<ProductCounterpartyRole>;
  entity: Control<Entity>;
};

type ContractFieldsForm = {
  contractFields: ContractFields;
};

@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
})
export class CreateContractComponent implements OnInit, AfterViewInit {
  serverError: string;

  @ViewChildren(ContractFieldsFormComponent)
  private contractFieldsForm: QueryList<ContractFieldsFormComponent>;

  @ViewChildren(CounterpartyFormComponent)
  private counterpartySubFormComponent: QueryList<CounterpartyFormComponent>;

  @ViewChildren(PricingAttributesFormComponent)
  private pricingFieldsForm: QueryList<PricingAttributesFormComponent>;

  @ViewChildren(PricingCurrencyFormComponent)
  private currencyForm: QueryList<PricingCurrencyFormComponent>;

  contractProductRules: Rule[] = [];
  productId: string;

  form: FormGroup<{
    categoryAndProduct: Control<CategoryAndProduct>;
    contractForm: ContractFieldsForm;
    pricingForm: PricingForm;
    counterparties: Array<Array<CounterpartyEntityControl>>;
    currenciesForm: CurrencyForm;
    partnership: string;
    bypassTradeAcceptance: boolean;
    entity: Control<Contract['entity']>;
    facility: Control<Contract['facility']>;
  }>;

  partnerships: Observable<Partner[]>;
  facilities: Observable<Contract['facility'][]>;

  constructor(
    private formBuilder: FormBuilder,
    private crumbService: CrumbService,
    private router: Router,
    private contractCounterPartiesService: ContractCounterPartiesService,
    private partnerService: PartnerService,
  ) {}

  ngOnInit(): void {
    // @ts-ignore
    this.form = this.formBuilder.group({
      categoryAndProduct: this.formBuilder.control<Control<CategoryAndProduct>>(null),
      contractForm: this.formBuilder.group<ContractFieldsForm>({ contractFields: null }),
      pricingForm: this.formBuilder.group<PricingForm>({ pricingFields: null }),
      // @ts-ignore
      counterparties: this.formBuilder.array([]),
      currenciesForm: this.formBuilder.group<CurrencyForm>({ currencies: null }),
      partnership: this.formBuilder.control<string>(null),
      bypassTradeAcceptance: this.formBuilder.control(false),
      facility: this.formBuilder.control<Control<Contract['facility']>>(null),
    });

    this.crumbService.setCrumbs(createContractCrumb());
    this.form.controls.categoryAndProduct.valueChanges.subscribe(
      (categoryAndProduct: CategoryAndProduct) => {
        this.handleProductUpdate(categoryAndProduct.product);
      },
    );
    this.partnerships = this.partnerService.getAllPartners();
  }

  ngAfterViewInit() {
    const registerSubForms = (queryList: QueryList<SubForm>, control: FormGroup | FormArray) => {
      queryList.forEach((subForm) => {
        setTimeout(() => {
          subForm.register(control);
        });
      });
    };

    this.contractFieldsForm.changes.subscribe((queryList) => {
      registerSubForms(queryList, this.form.controls.contractForm);
    });

    this.pricingFieldsForm.changes.subscribe((queryList) => {
      registerSubForms(queryList, this.form.controls.pricingForm);
    });

    this.counterpartySubFormComponent.changes.subscribe((queryList: QueryList<SubForm>) => {
      registerSubForms(queryList, this.form.controls.counterparties);
    });

    this.currencyForm.changes.subscribe((queryList: QueryList<SubForm>) => {
      registerSubForms(queryList, this.form);
    });
  }

  private handleProductUpdate(product: Product) {
    this.form.setControl('counterparties', this.formBuilder.array([]));

    this.contractProductRules = product.rules || [];
    this.productId = product.id;
  }

  saveContract() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const {
      categoryAndProduct,
      contractForm,
      counterparties,
      pricingForm,
      currenciesForm,
      partnership,
      bypassTradeAcceptance,
      facility,
    } = this.form.value;

    const contract: CreateContractRequest = {
      partnerId: partnership,
      channelReference: CHANNEL_REFERENCE,
      name: contractForm.contractFields.name,
      status: contractForm.contractFields.status,
      productId: categoryAndProduct.product.id,
      productName: categoryAndProduct.product.name,
      productCategoryId: categoryAndProduct.category.id,
      productCategoryName: categoryAndProduct.category.productType,
      product: `${categoryAndProduct.category.name} ${categoryAndProduct.product.name}`,
      counterparties: [].concat(...counterparties).filter((cpEntry) => cpEntry.entity),
      rules: this.contractProductRules,
      currencies: currenciesForm.currencies,
      bypassTradeAcceptance,
      ...(facility && { facility }),
      // @ts-ignore
      ...setContractFields(pricingForm.pricingFields),
    };

    this.contractCounterPartiesService.save(contract).subscribe(
      (id) => {
        this.router.navigate([`/contracts/${id}`]);
      },
      (error) => {
        console.error(error);
        if (error.status >= 409) {
          const description = JSON.parse(error.error.details[0].target);
          this.serverError = `Duplicate Contract name ${description.name} is not allowed.`;
        } else {
          this.serverError = `Error received from back end: ${error.error?.title}`;
        }
      },
    );
  }
}
