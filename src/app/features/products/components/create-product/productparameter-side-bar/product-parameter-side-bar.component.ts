import { Component, OnInit, Inject } from '@angular/core';
import {
  Control,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@ng-stack/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '@app/features/products/models/product.model';
import { ProductService } from '@app/features/products/services/product.service';
import { NumberProductParameter } from '@app/features/products/components/create-product/number-product-parameter/number-product-parameter.component';
import { OptionParameter } from '@app/features/products/components/create-product/product-parameter-option/product-parameter-option.component';

@Component({
  selector: 'app-productparameter-side-bar',
  templateUrl: './product-parameter-side-bar.component.html',
  styleUrls: ['./product-parameter-side-bar.component.scss'],
})
export class ProductParameterSideBarComponent implements OnInit {
  multipleChoiceCustomErrorMessages = {
    atleastOneCashflowTypeRequired: ({}) => 'At least one Cashflow Type must be selected',
    defaultOptionMustBeShown: ({}) => 'The default option must be shown',
  };
  item: any; // e.g. minTenor maxTenor Objects
  product: Product;
  parentForm: FormGroup;
  form: FormGroup<{
    numberParameter: Control<NumberProductParameter>;
    multipleChoiceParameter: FormArray<OptionParameter>;
    requiredField: boolean;
    contractConfigurable: boolean;
    helpText: string;
  }>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public productService: ProductService,
    public dialogRef: MatDialogRef<ProductParameterSideBarComponent, any>,
    public formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.product = this.data.product;
    this.item = this.data.item;
    this.parentForm = this.data.form;
    let itemValue = this.product.parameters[this.item.key];

    // console.log('this.item',this.item)
    // console.log('itemValue',itemValue)
    // console.log('itemValue',itemValue)

    if (itemValue.defaultValue === undefined && itemValue.choices === undefined) {
      const defailts = this.item.value;
      // console.log('defailts',defailts)
      itemValue = {};
      itemValue.requiredField = false;
      itemValue.contractConfigurable = false;
      itemValue.helpText = '';
      itemValue.defaultValue = defailts.initialDefaultValue.value;
      itemValue.minimumValue = defailts.initialMinimumValue.value;
      itemValue.maximumValue = defailts.initialMaximumValue.value;
    }

    // use definition from product if already defined. otherwise build from definition
    let options = [];
    if (itemValue && itemValue.type === 'MULTIPLE_CHOICE') {
      if (itemValue.choices) {
        options = itemValue.choices?.map((option) => {
          return {
            defaultOption: option.defaultOption,
            label: option.label,
            show: option.show,
            value: option.value,
          };
        });
      } else {
        options = itemValue.options?.map((option) => {
          return {
            defaultOption: false,
            label: option.label,
            show: false,
            value: option.value,
          };
        });
      }
    } else if (this.data?.item?.value?.type === 'MULTIPLE_CHOICE') {
      options = this.data.item.value.options?.map((option) => {
        return {
          defaultOption: this.data.item.value.initialValue === option.value,
          label: option.label,
          show: option.show,
          value: option.value,
        };
      });
    }
    // @ts-ignore
    this.form = this.formBuilder.group({
      // @ts-ignore
      numberParameter: new FormControl({
        defaultValue: itemValue.defaultValue,
        minimumValue: itemValue.minimumValue,
        maximumValue: itemValue.maximumValue,
      }),
      // @ts-ignore
      multipleChoiceParameter: new FormControl(options),
      requiredField: new FormControl(itemValue.requiredField, Validators.nullValidator),
      contractConfigurable: new FormControl(
        itemValue.contractConfigurable,
        Validators.nullValidator,
      ),
      helpText: new FormControl(itemValue.helpText, Validators.required),
    });
    this.form.markAllAsTouched();
  }

  handleSave() {
    const parameterToUpdate = this.data?.item?.value?.type;
    switch (parameterToUpdate) {
      case 'INTEGER':
        this.handleSaveIntegerParameter(parameterToUpdate);
        break;
      case 'MULTIPLE_CHOICE':
        this.handleSaveMultipleChoiceParameter(parameterToUpdate);
    }
  }

  handleSaveIntegerParameter(type: any) {
    let formValue = {};
    formValue = {
      type,
      ...this.form.value.numberParameter,
      requiredField: this.form.value.requiredField,
      contractConfigurable: this.form.value.contractConfigurable,
      helpText: this.form.value.helpText,
    };
    this.product.parameters[this.item.key] = formValue;
    this.productService
      .updateParameter(this.product.id, this.item.key, formValue)
      .subscribe((err: any) => {
        console.error(err);
      });
    this.dialogRef.close();
  }

  handleSaveMultipleChoiceParameter(type: any) {
    const multipleChoiceParameter: any = this.form.value.multipleChoiceParameter;
    const defaultValue = multipleChoiceParameter.find((v) => v.defaultOption).value;
    this.parentForm.controls.defaultValue.get(this.item.key).setValue(defaultValue);
    let formValue = {};
    formValue = {
      type,
      choices: multipleChoiceParameter,
      requiredField: this.form.value.requiredField,
      contractConfigurable: this.form.value.contractConfigurable,
      helpText: this.form.value.helpText,
    };
    this.product.parameters[this.item.key] = formValue;
    this.productService
      .updateParameter(this.product.id, this.item.key, formValue)
      .subscribe((err: any) => {
        console.error(err);
      });
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

  helpTextBlur() {
    console.log(this.form);
    this.form.controls.helpText.setValue(this.form.controls.helpText.value.trim());
    this.form.markAllAsTouched();
  }
}
