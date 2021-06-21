import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@ng-stack/forms';
import { DuplicateCheckField } from '@app/features/contracts/components/shared/duplicate-check-fields/model/duplicate-check-field';
import { SubForm } from '@app/shared/form/sub-form';
import { Validators } from '@angular/forms';

/**
 * This component's purpose is to provide the user with UI elements to select a set of hash expressions for the invoice duplication
 * check. The @Input parameter counterpartyRoles receives the counterparty roles which will in turn generate additional
 * checkboxes that correspond to appropriate hash expressions.
 * This component implements the SubForm interface which is used by the pattern introduced in CreateContractComponent.
 * The register method will set the selected hash expressions as a string[] on the selectedChecksControl and then set the
 * selectedChecksControl on the external form (FormGroup) that is passed as an argument under the key 'hashExpressions'.
 */
@Component({
  selector: 'app-duplicate-check-fields',
  templateUrl: './duplicate-checks.component.html',
})
export class DuplicateChecksComponent implements SubForm, OnChanges {
  static COMMON_DUPLICATE_CHECK_FIELDS: DuplicateCheckField[] = [
    new DuplicateCheckField('Invoice no', 'cashflow.documentReference'),
    new DuplicateCheckField('Original cashflow amount', 'cashflow.originalValue'),
    new DuplicateCheckField('Invoice date', 'cashflow.issueDate'),
    new DuplicateCheckField('Invoice due date', 'cashflow.originalDueDate'),
    new DuplicateCheckField('Currency', 'cashflow.currency'),
  ];

  @Input()
  counterpartyRoles: string[] = [];
  @Input()
  preSelectedHashExpressions: string[] = [];
  @Input()
  duplicateInvoiceCheckEnabled = false;
  @Input()
  readonly = false;

  allDuplicateCheckFieldsData: DuplicateCheckField[] =
    DuplicateChecksComponent.COMMON_DUPLICATE_CHECK_FIELDS;
  selectedChecksControl: FormControl<string[]> = new FormControl<string[]>([], []);

  constructor() {}

  updateAllDuplicateCheckFieldsData() {
    this.allDuplicateCheckFieldsData = [...DuplicateChecksComponent.COMMON_DUPLICATE_CHECK_FIELDS];
    // only forEach counterpartyRoles if defined
    this.counterpartyRoles?.forEach((roleType) => {
      this.allDuplicateCheckFieldsData.push(
        new DuplicateCheckField(
          `Counterparty - ${roleType}`,
          `counterparties.?[role == '${roleType}'].size() > 0 ? counterparties.?[role == '${roleType}'][0].entityId : ''`,
        ),
      );
    });
  }

  register(parentControl: FormGroup) {
    if (
      parentControl.get('hashExpressions') === this.selectedChecksControl &&
      this.selectedChecksControl !== null
    ) {
      return;
    }
    this.selectedChecksControl = new FormControl<string[]>(this.preSelectedHashExpressions, []);
    parentControl.setControl('hashExpressions', this.selectedChecksControl);
    this.updateAllDuplicateCheckFieldsData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateAllDuplicateCheckFieldsData();
  }

  toggleDuplicateCheck() {
    this.duplicateInvoiceCheckEnabled = !this.duplicateInvoiceCheckEnabled;
    if (!this.duplicateInvoiceCheckEnabled) {
      this.clearSelectionState();
      this.selectedChecksControl.setValidators([]);
    } else {
      this.selectedChecksControl.setValidators([Validators.required]);
      this.selectedChecksControl.updateValueAndValidity();
    }
  }

  clearSelectionState() {
    this.selectedChecksControl.setValue(null);
    this.selectedChecksControl.setErrors(null);
    this.selectedChecksControl.markAsPristine();
  }
}
