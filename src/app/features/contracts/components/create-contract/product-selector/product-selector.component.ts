import {
  AfterViewInit,
  Component,
  DoCheck,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Control, FormBuilder, FormControl, FormGroup, Validators } from '@ng-stack/forms';
import { Product } from '@app/features/products/models/product.model';
import { first } from 'rxjs/operators';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';
import { ProductCategory } from '@app/features/product-categories/models/product-category.model';

const DEFAULT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProductSelectorComponent),
  multi: true,
};

const DEFAULT_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => ProductSelectorComponent),
  multi: true,
};

export interface CategoryAndProduct {
  category: ProductCategory;
  product: Product;
}

export type OnChange = (entity: CategoryAndProduct) => void;
type SimpleProductCategoryView = Pick<ProductCategory, 'name' | 'products'>;

@Component({
  selector: 'app-product-selector',
  templateUrl: './product-selector.component.html',
  styleUrls: ['./product-selector.component.scss'],
  providers: [DEFAULT_VALUE_ACCESSOR, DEFAULT_VALIDATOR],
})
export class ProductSelectorComponent
  implements ControlValueAccessor, Validator, OnInit, OnDestroy, AfterViewInit, DoCheck {
  @Input()
  disabled = false;

  @Input()
  inputId = '';

  form: FormGroup<{
    category: Control<ProductCategory>;
    product: Control<Product>;
  }>;

  categories: SimpleProductCategoryView[] = [];

  private control: FormControl;
  private value: CategoryAndProduct;
  private subscriptions: Subscription[] = [];

  private onTouched: () => void = () => {};
  private onChange: OnChange = () => {};
  private onValidatorChange = () => {};

  constructor(
    private injector: Injector,
    private formBuilder: FormBuilder,
    private productCategoryService: ProductCategoryService,
  ) {
    this.form = formBuilder.group({
      category: formBuilder.control(null, Validators.required),
      product: formBuilder.control(null, Validators.required),
    });
  }

  ngOnInit() {
    this.productCategoryService
      .getCategories(true)
      .pipe(first())
      .subscribe((categories) => (this.categories = categories.filter((c) => c.products.length)));

    this.subscriptions.push(
      this.form.controls.category.valueChanges.subscribe(() => {
        if (this.form.controls.product.dirty || this.form.controls.product.touched) {
          this.form.controls.product.reset();
        }
      }),
      this.form.controls.product.valueChanges.subscribe((v) => {
        const categoryAndProduct: CategoryAndProduct = {
          category: this.form.controls.category.value,
          product: v,
        };
        this.writeValue(categoryAndProduct);
      }),
    );
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);

    if (ngControl) {
      this.control = ngControl.control as FormControl;
      setTimeout(() => this.control.setErrors(this.validate(this.control)));
    }
  }

  ngDoCheck(): void {
    if (!this.control) {
      return;
    }

    if (this.control.touched) {
      if (!this.form.controls.category.touched) {
        this.form.controls.category.markAsTouched();
      }

      if (this.form.value.category && !this.form.controls.product.touched) {
        this.form.controls.product.markAsTouched();
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions?.forEach((s) => s.unsubscribe());
  }

  registerOnChange(onChange: OnChange): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: CategoryAndProduct): void {
    this.value = value;
    this.onChange(this.value);
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.controls.category.valid && this.form.controls.product.valid
      ? null
      : { product: true };
  }
}
