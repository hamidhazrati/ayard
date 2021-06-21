import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateFacilityFormComponent } from './create-facility-form.component';
import { NgStackFormsModule } from '@ng-stack/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '@app/shared/shared.module';
import { CurrencyService } from '@app/services/currency/currency.service';
import { EntityService } from '@entities/services/entity.service';
import { MockService } from 'ng-mocks';
import { EntitiesModule } from '@entities/entities.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import Mocked = jest.Mocked;

describe('CreateFacilityFormComponent', () => {
  let component: CreateFacilityFormComponent;
  let fixture: ComponentFixture<CreateFacilityFormComponent>;

  let currencyService: Mocked<CurrencyService>;
  let entityService: Mocked<EntityService>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CreateFacilityFormComponent],
        imports: [
          HttpClientTestingModule,
          NgStackFormsModule,
          MatCardModule,
          MatIconModule,
          MatFormFieldModule,
          MatInputModule,
          MatListModule,
          MatDialogModule,
          RouterTestingModule,
          NoopAnimationsModule,
          MatSelectModule,
          MatTabsModule,
          SharedModule,
          EntitiesModule,
        ],
        providers: [
          {
            provide: CurrencyService,
            useValue: currencyService = MockService(CurrencyService) as Mocked<CurrencyService>,
          },
          {
            provide: EntityService,
            useValue: entityService = MockService(EntityService) as Mocked<EntityService>,
          },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    currencyService.getCurrencies.mockReturnValue(
      of([
        {
          code: 'USD',
          decimalPlaces: 2,
          dayCountConventionCode: 'actual/actual',
        },
      ]),
    );

    fixture = TestBed.createComponent(CreateFacilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
