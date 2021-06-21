import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Control, FormBuilder, FormGroup, Validators } from '@ng-stack/forms';
import { FacilityEntity } from '@app/features/facilities/models/facility.model';
import { TrimFormControl } from '@app/shared/form/trim-form-control';
import { serviceValidator } from '@app/shared/validators/service.validator';
import { FacilityService } from '@app/features/facilities/services/facility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrencyService } from '@app/services/currency/currency.service';
import { CreateFacilityOperation } from '@app/features/facilities/models/facility-operate.model';

const NAME_FIELD_MAX_LENGTH = 60;

@Component({
  selector: 'app-create-facility-form',
  templateUrl: './create-facility-form.component.html',
})
export class CreateFacilityFormComponent implements OnInit {
  @Output()
  save = new EventEmitter<CreateFacilityOperation>();

  form: FormGroup<CreateFacilityOperation>;

  nameCustomErrorMessages = {
    unique: ({}) => 'A limit configuration with this name <b>already exists</b>.',
  };

  currencies$: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private facilityService: FacilityService,
    currencyService: CurrencyService,
  ) {
    // @ts-ignore
    this.form = formBuilder.group({
      type: formBuilder.control('create-root-facility-operation'),
      currency: formBuilder.control<string>(null, [Validators.required]),
      name: new TrimFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(NAME_FIELD_MAX_LENGTH)]),
        serviceValidator('unique', (value) => {
          return this.facilityService.isUnique(value);
        }),
      ),
      entity: formBuilder.control<Control<FacilityEntity>>(null),
      limits: formBuilder.control(),
      children: formBuilder.control(),
    });

    this.currencies$ = currencyService
      .getCurrencies()
      .pipe(map((currencies) => currencies.map((c) => c.code)));
  }

  ngOnInit(): void {}

  handleSave() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.save.emit(this.form.value);
  }
}
