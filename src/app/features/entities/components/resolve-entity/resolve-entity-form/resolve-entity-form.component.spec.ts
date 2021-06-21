import { ResolveEntityFormComponent } from './resolve-entity-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@app/shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ResolveEntityComponent', () => {
  let component: ResolveEntityFormComponent;
  let fixture: ComponentFixture<ResolveEntityFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        MatDividerModule,
        MatIconModule,
        MatProgressSpinnerModule,
        HttpClientTestingModule,
        SharedModule,
        RouterTestingModule,
      ],
      declarations: [ResolveEntityFormComponent],
      providers: [
        { provide: FormBuilder, useValue: new FormBuilder() },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResolveEntityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize', () => {
    expect(component).toBeTruthy();
  });

  it('should trim values for send off', () => {
    const expectedResult = { country: 'US', name: 'Vodafone' };
    component.form.patchValue({ ...expectedResult, address: null });
    expect(component.trimValues()).toEqual(expectedResult);
  });

  it('should not submit invalid form', () => {
    jest.spyOn(component.whenSearch, 'emit');
    component.form.setErrors({ name: { required: true } });
    component.onSubmit();
    expect(component.whenSearch.emit).toHaveBeenCalledTimes(0);
  });

  it('should not submit invalid form', () => {
    jest.spyOn(component.whenSearch, 'emit');
    const expectedResult = { country: 'US', name: 'Vodafone' };
    component.form.patchValue({ ...expectedResult, address: null });
    component.onSubmit();
    expect(component.whenSearch.emit).toHaveBeenCalledWith({
      country: 'US',
      name: 'Vodafone',
    });
  });

  it('should submit form if dunsNumber is valid and has been filled', () => {
    jest.spyOn(component.whenSearch, 'emit');
    component.form.patchValue({ dunsNumber: '123456789' });
    component.onSubmit();
    expect(component.whenSearch.emit).toHaveBeenCalled();
  });
});
