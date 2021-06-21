import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormValueComponent } from './form-value.component';
import { Component } from '@angular/core';

describe('FormValueComponent', () => {
  let fixture: ComponentFixture<TestFormValueComponent>;

  @Component({
    template: `<app-form-value data-testid="value">Some read only value</app-form-value>`,
  })
  class TestFormValueComponent {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormValueComponent, TestFormValueComponent],
    }).compileComponents();
  }));

  describe('GIVEN a value', () => {
    it('THEN it should render correctly', () => {
      fixture = TestBed.createComponent(TestFormValueComponent);
      fixture.detectChanges();
      expect(fixture).toBeTruthy();
      // expect(fixture).toMatchSnapshot();
    });
  });
});
