import { Component, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Entity } from '@entities/models/entity.model';
import { LegalEntityAttribute } from '@entities/models/legal-entity-attribute.model';
import { Address } from '@entities/models/address.model';
import { TrimFormControl } from '@app/shared/form/trim-form-control';
import { DnbLookupService } from '@app/services/dnb/dnb-lookup.service';
import { DnbLookup } from '@app/services/dnb/dnb-lookup.model';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

export const ADDRESS_LINE_MAX_LENGTH = 100;
export const LEGAL_ENTITY_NAME_MAX_LENGTH = 100;
export const SHORT_NAME_MAX_LENGTH = 30;
export const PRIMARY_NAICS_MIN_LENGTH = 5;
export const PRIMARY_NAICS_MAX_LENGTH = 6;
export const CITY_MAX_LENGTH = 100;
export const POSTCODE_MAX_LENGTH = 20;

export const ERROR_MESSAGES = {
  'name.required': 'Legal entity name is required',
  'name.maxlength': `Maximum length ${LEGAL_ENTITY_NAME_MAX_LENGTH} exceeded`,
  'shortName.maxlength': `Maximum length ${SHORT_NAME_MAX_LENGTH} exceeded`,
  'countryIncorporationReference.pattern': 'Invalid reference',
  'primaryNaics.pattern': 'Invalid NAICS Code',
  'primaryNaics.minlength': `Minimum length of ${PRIMARY_NAICS_MIN_LENGTH} required`,
  'primaryNaics.maxlength': `Maximum length of ${PRIMARY_NAICS_MAX_LENGTH} required`,
  'yearFounded.pattern': 'Invalid year (yyyy format)',
  'line1.required': 'Line 1 is required',
  'line1.maxlength': `Maximum length of ${ADDRESS_LINE_MAX_LENGTH} exceeded`,
  'line2.maxlength': `Maximum length of ${ADDRESS_LINE_MAX_LENGTH} exceeded`,
  'city.required': 'City is required',
  'city.maxlength': `Maximum length of ${CITY_MAX_LENGTH} exceeded`,
  'postcode.required': 'Post Code is required',
  'postcode.maxlength': `Maximum length of ${POSTCODE_MAX_LENGTH} exceeded`,
};

interface Country {
  code: string;
  description: string;
}

@Component({
  selector: 'app-create-entity-form',
  templateUrl: './create-entity-form.component.html',
  styleUrls: ['./create-entity-form.component.scss'],
})
export class CreateEntityFormComponent implements OnInit {
  @Output()
  whenSave = new EventEmitter<Entity>();

  // TODO: Move a full list into a service in another story
  countryList: Country[] = [
    { code: 'GB', description: 'United Kingdom' },
    { code: 'US', description: 'USA' },
    { code: 'AU', description: 'Australia' },
  ];
  form: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: new TrimFormControl('', [
        Validators.required,
        Validators.maxLength(LEGAL_ENTITY_NAME_MAX_LENGTH),
      ]),
      shortName: new TrimFormControl('', Validators.maxLength(SHORT_NAME_MAX_LENGTH)),
      line1: new TrimFormControl('', [Validators.maxLength(ADDRESS_LINE_MAX_LENGTH)]),
      line2: new TrimFormControl('', Validators.maxLength(ADDRESS_LINE_MAX_LENGTH)),
      country: ['', Validators.required],
      city: new TrimFormControl('', [Validators.maxLength(CITY_MAX_LENGTH)]),
      stateProvinceRegion: new TrimFormControl('', [Validators.maxLength(CITY_MAX_LENGTH)]),
      postcode: new TrimFormControl('', [Validators.maxLength(POSTCODE_MAX_LENGTH)]),
    });
  }

  getErrorMessage(control: AbstractControl): string {
    const key = Object.keys(this.form.controls).find((input) => control === this.form.get(input));
    const [firstErrorKey] = Object.keys(this.form.get(key).errors);
    const errorKey = `${key}.${firstErrorKey}`;
    return ERROR_MESSAGES[errorKey];
  }

  getValue(): Entity {
    const { line1, line2, city, country, stateProvinceRegion, postcode } = this.form.value;
    const findCountryDescription = this.countryList.find(
      (item) => item.code === this.form.value.country,
    );
    const countryName =
      findCountryDescription && findCountryDescription.description
        ? findCountryDescription.description
        : null;

    return {
      id: null,
      name: this.form.value.name,
      address: {
        line1,
        line2,
        city,
        country,
        countryName,
        regionName: stateProvinceRegion,
        region: stateProvinceRegion,
        postalCode: postcode,
      },
      tradeStyleNames: [
        {
          name: this.form.value.shortName,
          priority: 1,
        },
      ],
    };
  }

  // events go here...

  onSave(): void {
    this.whenSave.emit(this.getValue());
  }
}
