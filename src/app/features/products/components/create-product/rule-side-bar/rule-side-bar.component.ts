import { Component, OnInit, Inject, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Rule } from '@app/features/products/models/rule.model';
import { ProductService } from '@app/features/products/services/product.service';
import { RuleFormComponent } from '../../rule-form/rule-form.component';

@Component({
  selector: 'app-rule-side-bar',
  templateUrl: './rule-side-bar.component.html',
  styleUrls: ['./rule-side-bar.component.scss'],
})
export class RuleSideBarComponent {
  @ViewChild(RuleFormComponent)
  public ruleSubForm: RuleFormComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public rule: Rule,
    public productService: ProductService,
    public dialogRef: MatDialogRef<RuleSideBarComponent, Rule>,
  ) {}

  handleSave() {
    this.ruleSubForm.form.markAllAsTouched();

    this.productService.validateProductRule(this.ruleSubForm.form.getRawValue()).subscribe(
      (response) => {
        if (this.ruleSubForm.form.valid) {
          this.dialogRef.close(this.ruleSubForm.form.value);
        }
      },
      (err) => {
        err.error.details.forEach((el: any) => {
          const errOBJ = { [el.target]: el.description };
          this.ruleSubForm.form.controls[el.target].setErrors(errOBJ);
        });
      },
    );
  }

  cancel() {
    this.dialogRef.close();
  }
}
