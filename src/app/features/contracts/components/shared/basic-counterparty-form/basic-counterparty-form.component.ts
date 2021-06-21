import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Control, Validators } from '@ng-stack/forms';
import { Entity } from '@app/features/entities/models/entity.model';

type CoreCounterpartyDetailsForm = {
  entity: Control<Entity>;
  reference: string;
  references: Control<string[]>;
  name: string;
};

@Component({
  selector: 'app-basic-counterparty-form',
  templateUrl: './basic-counterparty-form.component.html',
})
export class BasicCounterpartyFormComponent implements OnInit {
  form: FormGroup<CoreCounterpartyDetailsForm>;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group<CoreCounterpartyDetailsForm>({
      entity: this.formBuilder.control<Entity>(null, Validators.required),
      reference: this.formBuilder.control<string>(null),
      references: this.formBuilder.control<string[]>(null),
      name: this.formBuilder.control<string>(null, Validators.required),
    });

    this.form.controls.entity.valueChanges.subscribe((entity) => {
      if (entity) {
        this.form.controls.name.setValue(entity.name);
      }
    });
  }
}
