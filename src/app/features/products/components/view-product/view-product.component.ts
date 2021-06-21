import {
  Component,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { ProductService } from '@app/features/products/services/product.service';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { ActivatedRoute } from '@angular/router';
import { TemplatePortal } from '@angular/cdk/portal';
import * as _ from 'lodash';
import { Dictionary } from 'lodash';
import { Rule } from '@app/features/products/models/rule.model';
import { Product } from '@app/features/products/models/product.model';
import { viewProductCrumb } from '@app/features/products/components/view-product/view-product.crumb';
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';
import { ProductCategory } from '@app/features/product-categories/models/product-category.model';
import { GdsColumn, GdsSortEvent, SortDirection } from '@greensill/gds-ui/data-table';
import { GdsSorting } from '@greensill/gds-ui/data-table/shared/data-table-types';
import { SideBarDialogService } from '@app/shared/components/side-bar-dialog/side-bar-dialog.service';
import { ProductParameterSideBarComponent } from '../create-product/productparameter-side-bar/product-parameter-side-bar.component';
import { first } from 'rxjs/operators';
import {
  COUNTERPARTY_ROLE_TYPE_LABELS,
  ProductCounterpartyRole,
} from '@app/features/products/models/product-counterparty-role.model';
import { FormBuilder, FormControl, FormGroup } from '@ng-stack/forms';

class ProductPortal {
  name: string;
  portal: TemplatePortal<any>;
}

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit, AfterViewInit {
  form: FormGroup<{
    defaultValue: FormGroup;
  }>;
  public product: Product;
  productCategory: ProductCategory;
  loading = true;
  groupedRules: Dictionary<Rule[]>;

  public defaultSorts: GdsSorting[] = [
    {
      prop: 'name',
      dir: SortDirection.asc,
    },
  ];
  public sorting: GdsSorting = this.defaultSorts[0];
  public rows: any = [];
  public columns: GdsColumn[] = [
    { prop: 'name', name: 'Counterparty role', columnWidth: 270 },
    { prop: 'description', name: 'Description', columnWidth: 345 },
    { prop: 'required', name: 'Mandatory', columnWidth: 185 },
    { prop: 'type', name: 'Type', columnWidth: 160 },
  ];

  portals: ProductPortal[] = [];
  selectedView: ProductPortal;

  @ViewChild('templatePortalBehaviouralParameters') behaviouralParametersContent: TemplateRef<
    unknown
  >;
  @ViewChild('templatePortalControlParameters') controlParametersContent: TemplateRef<unknown>;
  @ViewChild('templatePortalCounterparties') counterPartiesContent: TemplateRef<unknown>;
  @ViewChild('templatePortalRules') rulesContent: TemplateRef<unknown>;
  controlParameterDefinitions: any;
  behaviouralParameterDefinitions: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private crumbService: CrumbService,
    private viewContainerRef: ViewContainerRef,
    private sideBarDialogService: SideBarDialogService,
    private formBuilder: FormBuilder,
  ) {
    // @ts-ignore
    this.form = formBuilder.group({
      // @ts-ignore
      defaultValue: formBuilder.group([]),
    });
  }

  registerPortal(name: string, template: TemplateRef<unknown>) {
    this.portals.push({
      name,
      portal: new TemplatePortal(template, this.viewContainerRef),
    });
  }

  portalSelected(portal: ProductPortal) {
    this.selectedView = portal;
  }

  productLoaded(product: Product) {
    this.product = product;
    this.loading = false;
    this.groupedRules = _.groupBy<Rule>(product.rules, (r) => r.resource);
    this.rows = this.prettifyRoles(product.counterpartyRoles);
    this.loadProductCategory();
    this.portalSelected(this.portals[0]);
  }

  prettifyRoles(roles: ProductCounterpartyRole[]) {
    const prettyRoles = [];
    roles.forEach((role: ProductCounterpartyRole) => {
      const prettyRole = {
        name: role.name,
        description: role.description,
        type: COUNTERPARTY_ROLE_TYPE_LABELS[role.type],
        required: role.required,
      };
      prettyRoles.push(prettyRole);
    });
    return prettyRoles;
  }

  loadProductCategory() {
    this.productCategoryService
      .getProductCategoryById(this.product.productCategoryId)
      .subscribe(this.productCategoryLoaded.bind(this));
  }

  productCategoryLoaded(productCategory: ProductCategory) {
    this.productCategory = productCategory;
    this.crumbService.setCrumbs(viewProductCrumb(this.product, productCategory));
  }

  loadProduct() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;

    this.productService.getProductById(id).subscribe((resp: Product) => {
      this.productLoaded(resp);
      this.loadControlParameters();
    });
  }
  loadControlParameters() {
    this.productService.getParameterDefinitions().subscribe((resp: any) => {
      if (!this.product.parameters) {
        this.product.parameters = {};
      }
      const controlParameters = {};
      const behaviouralParameters = {};
      Object.keys(resp).forEach((key: any) => {
        if (!this.product.parameters[key]) {
          this.product.parameters[key] = {};
          const formControl = new FormControl(null);
          this.form.controls.defaultValue.addControl(key, formControl);
        } else {
          const par = this.product.parameters[key];
          if (par.type === 'MULTIPLE_CHOICE') {
            const defaultOp = par.choices.find((c) => c.defaultOption).value;
            const formControl = new FormControl(defaultOp);
            this.form.controls.defaultValue.addControl(key, formControl);
          }
        }
        if (resp[key].category === 'CONTROL') {
          controlParameters[key] = resp[key];
        } else if (resp[key].category === 'BEHAVIOURAL') {
          behaviouralParameters[key] = resp[key];
        }
      });
      this.controlParameterDefinitions = controlParameters;
      this.behaviouralParameterDefinitions = behaviouralParameters;
    });
  }

  public sort(event: GdsSortEvent): void {
    this.sorting = event.sorts[0];
    return this.loadProduct();
  }

  ngAfterViewInit(): void {
    this.registerPortal('Behavioural parameters', this.behaviouralParametersContent);
    this.registerPortal('Control parameters', this.controlParametersContent);
    this.registerPortal('Counterparties', this.counterPartiesContent);
    this.registerPortal('Rules', this.rulesContent);
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  configureProductParameter(item: any) {
    this.openProductParameterSidebar(item);
  }

  private openProductParameterSidebar(item: any) {
    this.sideBarDialogService
      .open<ProductParameterSideBarComponent, any, undefined>(ProductParameterSideBarComponent, {
        product: this.product,
        item,
        form: this.form,
      })
      .afterClosed()
      .pipe(first())
      .subscribe();
  }

  public getShowValues(parameterName: string) {
    const parameter = this.product.parameters[parameterName];
    if (parameter?.choices) {
      return parameter.choices.filter((c) => c.show);
    }
  }
}
