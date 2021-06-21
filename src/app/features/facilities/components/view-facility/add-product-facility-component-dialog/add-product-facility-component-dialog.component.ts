import { Component, Inject, OnInit } from '@angular/core';
import { Control, FormBuilder, FormGroup, Validators } from '@ng-stack/forms';
import { CreateProductTotalFacility } from '@app/features/facilities/models/facility.model';
import {
  CreateGuarantorLimit,
  CreateTotalLimit,
} from '@app/features/facilities/models/limit.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryAndProduct } from '@app/features/contracts/components/create-contract/product-selector/product-selector.component';

const NAME_FIELD_MAX_LENGTH = 60;

export interface AddProductFacilityComponentDialogData {
  parent: { id: string; currency: string };
}

@Component({
  selector: 'app-add-product-facility-component-dialog',
  templateUrl: './add-product-facility-component-dialog.component.html',
  styleUrls: ['./add-product-facility-component-dialog.component.scss'],
})
export class AddProductFacilityComponentDialogComponent implements OnInit {
  form: FormGroup<{
    parentId: string;
    currency: string;
    categoryAndProduct: Control<CategoryAndProduct>;
    creditLimit?: number;
  }>;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddProductFacilityComponentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddProductFacilityComponentDialogData,
  ) {
    this.form = formBuilder.group({
      parentId: formBuilder.control<string>(data.parent.id, Validators.required),
      currency: formBuilder.control<string>(data.parent.currency, Validators.required),
      categoryAndProduct: this.formBuilder.control<Control<CategoryAndProduct>>(
        null,
        Validators.required,
      ),
      creditLimit: formBuilder.control<number>(null),
    });
  }

  ngOnInit(): void {}

  handleCancel() {
    this.dialogRef.close();
  }

  handleSave() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const { parentId, currency, categoryAndProduct, creditLimit } = this.form.value;

    const limits: (CreateTotalLimit | CreateGuarantorLimit)[] = [];

    if (creditLimit != null) {
      limits.push({
        type: 'total-limit',
        limitType: 'CREDIT',
        limit: creditLimit,
      });
    }

    const facility: CreateProductTotalFacility = {
      type: 'product-total-facility',
      currency,
      name: `${categoryAndProduct.category.name} - ${categoryAndProduct.product.name}`,
      products: [categoryAndProduct.product.name],
      children: [],
      limits,
    };

    this.dialogRef.close({
      type: 'add-child-facility-operation',
      facilityId: parentId,
      facility,
    });
  }
}
