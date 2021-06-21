import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@ng-stack/forms';
import * as PRODUCT_CONSTANTS from '@app/features/product-categories/models/product-category-constants';
import { CreateUpdateProductCategory } from '@app/features/product-categories/models/product-category.model';
import { TrimFormControl } from '@app/shared/form/trim-form-control';
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';
import { serviceValidator } from '@app/shared/validators/service.validator';

const NAME_FIELD_MAX_LENGTH = 60;
const DESCRIPTION_FIELD_MAX_LENGTH = 250;
const GUIDE_LINK_FIELD_MAX_LENGTH = 2000;

@Component({
  selector: 'app-create-product-category-form',
  templateUrl: './create-product-category-form.component.html',
  styleUrls: ['./create-product-category-form.component.scss'],
})
export class CreateProductCategoryFormComponent implements OnInit {
  productConstants = PRODUCT_CONSTANTS;

  @Input()
  serverError?: any;

  @Output()
  save = new EventEmitter<CreateUpdateProductCategory>();

  form: FormGroup<CreateUpdateProductCategory>;

  nameCustomErrorMessages = {
    unique: ({}) => 'A product category with this name <b>already exists</b>.',
  };

  constructor(
    private formBuilder: FormBuilder,
    private productCategoryService: ProductCategoryService,
  ) {
    this.form = formBuilder.group({
      name: new TrimFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(NAME_FIELD_MAX_LENGTH)]),
        serviceValidator('unique', (value) => {
          return this.productCategoryService.isUnique(value);
        }),
      ),
      status: formBuilder.control(null, Validators.required),
      description: new TrimFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(DESCRIPTION_FIELD_MAX_LENGTH),
        ]),
      ),
      productGuideLink: new TrimFormControl('', Validators.maxLength(GUIDE_LINK_FIELD_MAX_LENGTH)),
      productType: formBuilder.control(null, Validators.required),
    });
  }

  ngOnInit() {}

  handleSave() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.save.emit(this.form.value);
  }
}
