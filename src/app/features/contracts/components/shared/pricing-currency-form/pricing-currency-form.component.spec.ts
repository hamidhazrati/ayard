import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingCurrencyFormComponent } from './pricing-currency-form.component';
import { moduleDeclarations, moduleImports } from '@app/features/contracts/contracts.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PricingCurrencyFormComponent', () => {
  let component: PricingCurrencyFormComponent;
  let fixture: ComponentFixture<PricingCurrencyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: moduleDeclarations,
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
        ...moduleImports,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingCurrencyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
