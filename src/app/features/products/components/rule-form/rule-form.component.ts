import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@ng-stack/forms';
import { Rule } from '@app/features/products/models/rule.model';
import { SubForm } from '@app/shared/form/sub-form';

export interface RuleType {
  code: string;
  description: string;
}

export interface OutComeType {
  code: string;
  description: string;
}

@Component({
  selector: 'app-rule-form',
  templateUrl: './rule-form.component.html',
  styleUrls: ['./rule-form.component.scss'],
})
export class RuleFormComponent implements OnInit, SubForm {
  @Input()
  index = 0;

  @Input()
  value?: Rule;

  @Output()
  remove = new EventEmitter<void>();

  ruleTypes: RuleType[] = [
    { code: 'PRICING', description: 'Pricing' },
    { code: 'CASHFLOW', description: 'Cashflow' },
    { code: 'COUNTERPARTY', description: 'Counterparty' },
  ];

  outcomeTypes: OutComeType[] = [
    { code: 'TERMINAL', description: 'Terminal' },
    { code: 'RESOLVABLE', description: 'Resolvable' },
  ];

  form: FormGroup<Rule>;

  private parent: FormArray;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const {
      name = null,
      resource = null,
      expression = null,
      code = null,
      message = null,
      matchExpression = null,
      outcomeType = null,
      outcomeDescription = null,
    } = this?.value || {};

    this.form = this.formBuilder.group<Rule>({
      name: [name, Validators.compose([Validators.required, Validators.maxLength(50)])],
      resource: [resource, Validators.required],
      expression: [expression, Validators.required],
      code: [code, Validators.compose([Validators.required, Validators.maxLength(50)])],
      message: [message, Validators.required],
      matchExpression: [matchExpression, Validators.required],
      outcomeType: [outcomeType, Validators.required],
      outcomeDescription: [outcomeDescription],
      resolutionType: null,
    });
  }

  register(control: FormArray) {
    this.parent = control;
    const existing = control.at(this.index);

    if (existing === this.form) {
      return;
    }

    control.setControl(this.index, this.form);
  }

  handleRemove() {
    this.parent?.removeAt(this.index);
    this.remove.emit();
  }
}
