import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ContractService } from '@app/features/contracts/services/contract.service';
import { ActivatedRoute } from '@angular/router';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { viewContractCrumb } from './view-contract.crumb';
import { Contract, makeCurrencyEntry, CreateUpdateContract } from '../../models/contract.model';
import { ContractCounterparty } from '../../models/counterparty.model';
import { PricingAttributesFormComponent } from '../shared/pricing-attributes-form/pricing-attributes-form.component';
import { FormGroup, FormBuilder, FormArray } from '@ng-stack/forms';
import { SubForm } from '@app/shared/form/sub-form';
import {
  CurrencyForm,
  PricingCurrencyFormComponent,
} from '../shared/pricing-currency-form/pricing-currency-form.component';
import { setContractFields } from '@app/features/contracts/components/shared/pricing-attributes-form/model/functions';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '@app/features/products/models/product.model';
import { ProductService } from '@app/features/products/services/product.service';
import * as _ from 'lodash';
import { Dictionary } from 'lodash';
import { Rule } from '@app/features/products/models/rule.model';
import { EditContractDialogComponent } from '../shared/edit-countract-dialog/edit-contract-dialog.component';
import { PricingForm } from '@app/features/contracts/components/shared/pricing-attributes-form/model/types';

class ContractPortal {
  name: string;
  portal: TemplatePortal<any>;
}

@Component({
  templateUrl: './view-contract.component.html',
  styleUrls: ['./view-contract.component.scss'],
})
export class ViewContractComponent implements OnInit, AfterViewInit {
  public loading = true;
  public editing = false;
  public contract: Contract;
  // TODO : should this be in the contract?
  public contractProduct: Product;
  public groupedRules: Dictionary<Rule[]>;
  public selectedView: ContractPortal;

  portals: ContractPortal[] = [];
  makeCurrencyEntry = makeCurrencyEntry;

  @ViewChild('templatePortalRules') rulesContent: TemplateRef<unknown>;
  @ViewChild('templatePortalCounterparties') counterpartiesContent: TemplateRef<unknown>;
  @ViewChild('templatePortalParameters') parametersContent: TemplateRef<unknown>;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService,
    private productService: ProductService,
    private crumbService: CrumbService,
    private formBuilder: FormBuilder,
    private viewContainerRef: ViewContainerRef,
    private dialog: MatDialog,
  ) {
    this.form = formBuilder.group({
      pricingForm: this.formBuilder.group<PricingForm>({ pricingFields: null }),
      currenciesForm: this.formBuilder.group<CurrencyForm>({ currencies: null }),
    });
  }

  @ViewChildren(PricingAttributesFormComponent)
  private pricingFieldsForm: QueryList<PricingAttributesFormComponent>;

  @ViewChildren(PricingCurrencyFormComponent)
  private currencyForm: QueryList<PricingCurrencyFormComponent>;

  form: FormGroup<{
    pricingForm: PricingForm;
    currenciesForm: CurrencyForm;
  }>;

  registerPortal(name: string, template: TemplateRef<unknown>) {
    this.portals.push({
      name,
      portal: new TemplatePortal(template, this.viewContainerRef),
    });
  }

  editContract() {
    EditContractDialogComponent.open(this.dialog, this.contract).subscribe();
  }

  canEdit() {
    return !this.editing;
  }

  canSubmitEdit() {
    if (this.contract.status === 'PENDING_APPROVAL') {
      return this.editing;
    } else {
      if (this.form?.valid) {
        return this.editing;
      }
    }
    return false;
  }

  canSubmitUpdate() {
    return this.editing;
  }

  submitUpdate(portalName) {
    this.form.markAllAsTouched();

    this.editing = false;

    const contract: CreateUpdateContract = {
      ...this.contract,
      // @ts-ignore
      ...setContractFields(this.form.value.pricingForm.pricingFields),
      currencies: this.form.value.currenciesForm.currencies,
    };

    this.contractService.updateContract(this.contract.id, contract).subscribe(
      (id) => {
        this.cancelEdit(portalName);
      },
      (err) => {
        this.cancelEdit(portalName);
        console.error('updateContract()', err);
      },
    );
  }

  canApprove() {
    return !this.editing && this.contract.status === 'PENDING_APPROVAL';
  }

  approve() {
    this.contractService.setStatus(this.contract.id, 'APPROVED').subscribe((id) => {
      this.loadContract();
    });
  }

  edit() {
    this.editing = true;
    this.form.markAllAsTouched();
  }

  cancelEdit(portalName: string) {
    this.editing = false;
    this.loadContract();
    setTimeout(() => this.loadContract(portalName), 100);
  }

  portalSelected(portal: ContractPortal) {
    this.editing = false;
    this.selectedView = portal;
  }

  ngAfterViewInit() {
    this.registerPortal('Counterparties', this.counterpartiesContent);
    this.registerPortal('Parameters', this.parametersContent);
    this.registerPortal('Rules', this.rulesContent);

    const registerSubForms = (queryList: QueryList<SubForm>, control: FormGroup | FormArray) => {
      queryList.forEach((subForm) => {
        setTimeout(() => {
          subForm.register(control);
        });
      });
    };

    this.pricingFieldsForm.changes.subscribe((queryList) => {
      registerSubForms(queryList, this.form.controls.pricingForm);
    });

    this.currencyForm.changes.subscribe((queryList: QueryList<SubForm>) => {
      registerSubForms(queryList, this.form);
    });
  }

  contractLoaded(contract: Contract, portalName?: string) {
    this.contract = contract;
    this.loading = false;
    this.crumbService.setCrumbs(viewContractCrumb(contract));
    this.groupedRules = _.groupBy<Rule>(contract.rules, (r) => r.resource);
    this.productService.getProductById(contract.productId).subscribe(this.productLoaded.bind(this));

    const selectedPortal: ContractPortal =
      typeof portalName !== 'undefined'
        ? this.portals.find((portal) => portal.name === portalName)
        : this.portals[0];

    this.portalSelected(selectedPortal);
  }

  productLoaded(product: Product) {
    this.contractProduct = product;
  }

  loadContract(portalName?: string) {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;

    this.contractService
      .getContractById(id)
      .subscribe((contract: Contract) => this.contractLoaded(contract, portalName));
  }

  ngOnInit(): void {
    this.loadContract();
  }
}
