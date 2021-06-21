import { CreateEntityFormComponent, ERROR_MESSAGES } from './create-entity-form.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@app/shared/shared.module';
import { DnbLookupService } from '@app/services/dnb/dnb-lookup.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateEntityComponent', () => {
  let component: CreateEntityFormComponent;
  let fixture: ComponentFixture<CreateEntityFormComponent>;
  let dnbLookupService: DnbLookupService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        MatDividerModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        HttpClientTestingModule,
        SharedModule,
        RouterTestingModule,
      ],
      declarations: [CreateEntityFormComponent],
      providers: [DnbLookupService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEntityFormComponent);
    component = fixture.componentInstance;
    dnbLookupService = TestBed.inject(DnbLookupService);
    fixture.detectChanges();
  });

  it('should initialize', () => {
    expect(component).toBeTruthy();
  });

  it('should emit upwards once save button has been clicked', () => {
    jest.spyOn(component.whenSave, 'emit');
    component.onSave();
    expect(component.whenSave.emit).toHaveBeenCalledWith(component.getValue());
  });

  it('should return the correct value of the form', () => {
    component.form.patchValue({
      name: 'James Brown',
      shortName: 'james.brown',
      yearFounded: '2004',
      line1: 'The Furs, Alconbury Avenue',
      line2: 'Tonbridge',
      city: 'Kent',
      country: 'GB',
      stateProvinceRegion: 'England',
      postcode: 'TN2 6PY',
    });
    fixture.detectChanges();

    expect(component.getValue()).toEqual({
      id: null,
      name: component.form.value.name,
      yearFounded: component.form.value.yearFounded,
      address: {
        line1: 'The Furs, Alconbury Avenue',
        line2: 'Tonbridge',
        city: 'Kent',
        country: 'GB',
        region: 'England',
        regionName: 'England',
        postalCode: 'TN2 6PY',
        countryName: 'United Kingdom',
      },
      tradeStyleNames: [
        {
          name: component.form.value.shortName,
          priority: 1,
        },
      ],
    });
  });

  it('should return the correct validation', () => {
    const line1 =
      'The Furs, St Marys Avenue The Furs, St Marys Avenue The Furs, St Marys Avenue The Furs, St Marys Avenue';

    component.form.patchValue({
      ...component.form.value,
      line1,
    });

    fixture.detectChanges();
    const formLine1 = component.form.get('line1');
    expect(component.getErrorMessage(formLine1)).toEqual(ERROR_MESSAGES['line1.maxlength']);
  });
});
