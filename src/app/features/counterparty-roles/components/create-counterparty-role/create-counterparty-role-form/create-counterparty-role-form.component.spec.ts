import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CreateCounterpartyRoleFormComponent,
  NAME_MAX_LENGTH,
  DESC_NAME_MAX_LENGTH,
  ERROR_MESSAGES,
} from './create-counterparty-role-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@app/shared/shared.module';
import { CounterpartyRole } from '@app/features/counterparty-roles/models/counterparty.role';
import { setInputValue, getByTestId, selectFirstOption } from '@app/shared/utils/test';
import Mock = jest.Mock;
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateCounterpartyRoleFormComponent', () => {
  let component: CreateCounterpartyRoleFormComponent;
  let fixture: ComponentFixture<CreateCounterpartyRoleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        SharedModule,
        RouterTestingModule,
      ],
      declarations: [CreateCounterpartyRoleFormComponent],
      providers: [{ provide: FormBuilder, useValue: new FormBuilder() }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCounterpartyRoleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN I create want to an Counterparty role', () => {
    let save: Mock;
    let expectedFields: CounterpartyRole[];

    beforeEach(() => {
      save = jest.fn();
      component.save.subscribe(save);

      expectedFields = [];
    });

    test('THEN it should populate mandatory fields and save OK', () => {
      setInputValue(getByTestId(fixture, 'name'), ' Valid name  ');
      setInputValue(
        getByTestId(fixture, 'description'),
        'A description of the counterparty type role   ',
      );
      fixture.detectChanges();

      getByTestId(fixture, 'save').nativeElement.click();
      fixture.detectChanges();

      expect(save).toHaveBeenCalledWith({
        name: 'Valid name',
        description: 'A description of the counterparty type role',
        required: false,
      });
    });
  });

  describe('GIVEN a form is submitted without data', () => {
    test('THEN the mandatory felids are highlighted and the form is not submitted', () => {
      const save = jest.fn();

      component.save.subscribe(save);

      getByTestId(fixture, 'save').nativeElement.click();
      fixture.detectChanges();

      expect(getByTestId(fixture, 'name-error')).toBeTruthy();
      expect(getByTestId(fixture, 'description-error')).toBeTruthy();
      expect(save).not.toHaveBeenCalled();
    });

    test.each`
      field            | input                                   | errorMessage
      ${'name'}        | ${' \t  '}                              | ${ERROR_MESSAGES['name.required']}
      ${'name'}        | ${''}                                   | ${ERROR_MESSAGES['name.required']}
      ${'name'}        | ${'A'.repeat(NAME_MAX_LENGTH + 1)}      | ${ERROR_MESSAGES['name.maxlength']}
      ${'description'} | ${' \t  '}                              | ${ERROR_MESSAGES['description.required']}
      ${'description'} | ${''}                                   | ${ERROR_MESSAGES['description.required']}
      ${'description'} | ${'A'.repeat(DESC_NAME_MAX_LENGTH + 1)} | ${ERROR_MESSAGES['description.maxlength']}
    `(
      'THEN $field with "$input" should display error message "$errorMessage"',
      ({ field, input, errorMessage }) => {
        const inputEl = getByTestId(fixture, field);

        expect(inputEl).toBeTruthy();
        setInputValue(inputEl, input);
        fixture.detectChanges();

        const errorEl = getByTestId(fixture, `${field}-error`);

        if (errorMessage) {
          expect(errorEl).toBeTruthy();
          expect(errorEl.nativeElement.innerHTML).toEqual(errorMessage);
        } else {
          expect(errorEl).toBeFalsy();
        }
      },
    );
  });
});
