import { Component, EventEmitter, Input, Output, ElementRef, OnInit } from '@angular/core';

import { CreateUpdateProduct } from '@app/features/products/models/product.model';
import { FormBuilder, FormGroup, Validators, ValidatorsModel } from '@ng-stack/forms';
import { SideBarDialogService } from '@app/shared/components/side-bar-dialog/side-bar-dialog.service';
import { first } from 'rxjs/operators';
import { CounterpartyRoleSideBarComponent } from '@app/features/products/components/create-product/counterparty-role-side-bar/counterparty-role-side-bar.component';
import { ProductCounterpartyRole } from '@app/features/products/models/product-counterparty-role.model';
import { CounterpartyRoleFormBuilder } from '@app/features/products/counterparty-role-form-builder/counterparty-role-form-builder.service';
import * as PRODUCT_CONSTANTS from '@app/features/products/models/product-constants';
import { ProductCategory } from '@app/features/product-categories/models/product-category.model';
import { ProductService } from '@app/features/products/services/product.service';
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';
import { serviceValidator } from '@app/shared/utils';
import { RuleSideBarComponent } from '../rule-side-bar/rule-side-bar.component';
import { Rule } from '@app/features/products/models/rule.model';

const NAME_MAX_LENGTH = 60;
const DESC_MAX_LENGTH = 250;
const PRODUCT_GUIDE_LINK_MAX_LENGTH = 2000;

@Component({
  selector: 'app-create-product-form',
  templateUrl: './create-product-form.component.html',
})
export class CreateProductFormComponent implements OnInit {
  productConstants = {
    productStatuses: PRODUCT_CONSTANTS.PRODUCT_STATUSES,
  };

  errors = {
    unique: ({ label, error }) => `${label} is not unique within product category.`,
  };

  @Input()
  serverError?: any;

  @Input()
  public sideBarContainerRef: ElementRef;

  @Output()
  save = new EventEmitter<CreateUpdateProduct>();

  form: FormGroup<CreateUpdateProduct, ValidatorsModel & { minMaxTenorRange?: true }>;

  categories: ProductCategory[] = [];
  parameterDefinitions: any;

  addNewRule = this.openNewRuleSideBar.bind(this);
  editRule = this.openNewRuleSideBar.bind(this);

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private counterpartyRoleFormBuilder: CounterpartyRoleFormBuilder,
    private sideBarDialogService: SideBarDialogService,
  ) {
    // @ts-ignore
    this.form = formBuilder.group({
      status: formBuilder.control('DRAFT', Validators.required),
      productCategoryId: formBuilder.control('', Validators.required),
      name: formBuilder.control<string, ValidatorsModel & { unique: true }>(
        null,
        Validators.compose([Validators.required, Validators.maxLength(NAME_MAX_LENGTH)]),
        serviceValidator('unique', (value) =>
          this.productService.isProductNameUnique(
            this.form.controls.productCategoryId.value,
            value,
          ),
        ),
      ),
      description: formBuilder.control(
        '',
        Validators.compose([Validators.required, Validators.maxLength(DESC_MAX_LENGTH)]),
      ),
      productGuideLink: formBuilder.control(
        '',
        Validators.maxLength(PRODUCT_GUIDE_LINK_MAX_LENGTH),
      ),
      // @ts-ignore
      counterpartyRoles: formBuilder.array([]),
      // @ts-ignore
      rules: formBuilder.array([]),
      // @ts-ignore
      parameters: {},
      // @ts-ignore
    });

    this.form.controls.productCategoryId.valueChanges.subscribe((value) => {
      this.form.controls.name.updateValueAndValidity({ onlySelf: true });
    });
  }

  ngOnInit() {
    this.productService.getParameterDefinitions().subscribe((resp: any) => {
      this.parameterDefinitions = resp;
    });

    this.productCategoryService
      .getCategories()
      .pipe(first())
      .subscribe((categories) => (this.categories = categories));
  }

  handleSave() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.save.emit(this.form.value);
  }

  deleteRule(index: number) {
    this.form.value.rules.splice(index, 1);
  }

  private openNewRuleSideBar(editRule: Rule) {
    this.sideBarDialogService
      .open<RuleSideBarComponent, Rule, Rule>(RuleSideBarComponent, editRule)
      .afterClosed()
      .pipe(first())
      .subscribe((rule) => {
        if (!rule) {
          return;
        }

        const ruleIndex = this.form.value.rules.findIndex((r) => r.name === rule.name);

        if (ruleIndex > -1) {
          this.form.value.rules[ruleIndex] = rule;
        } else {
          this.form.value.rules.push(rule);
        }
      });
  }

  addNewCounterpartyRole() {
    this.openCounterpartyTypeSidebar(this.form.value.counterpartyRoles);
  }

  editCounterpartyRole(counterpartyRole: ProductCounterpartyRole) {
    this.openCounterpartyTypeSidebar(counterpartyRole);
  }

  private openCounterpartyTypeSidebar(data: ProductCounterpartyRole[] | ProductCounterpartyRole) {
    this.sideBarDialogService
      .open<
        CounterpartyRoleSideBarComponent,
        ProductCounterpartyRole[] | ProductCounterpartyRole,
        ProductCounterpartyRole | undefined
      >(CounterpartyRoleSideBarComponent, data)
      .afterClosed()
      .pipe(first())
      .subscribe((counterpartyRole) => {
        if (!counterpartyRole) {
          return;
        }

        const index = this.form.controls.counterpartyRoles.controls.findIndex(
          (c) => c.value.name === counterpartyRole.name,
        );

        const control = this.counterpartyRoleFormBuilder.buildFormFromProductCounterpartyRole(
          counterpartyRole,
        );

        if (index > -1) {
          this.form.controls.counterpartyRoles.setControl(index, control);
        } else {
          this.form.controls.counterpartyRoles.push(control);
        }
      });
  }
}
