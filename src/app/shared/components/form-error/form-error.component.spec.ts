import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormErrorComponent } from './form-error.component';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('FormErrorComponent', () => {
  let component: FormErrorComponent;
  let fixture: ComponentFixture<FormErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormErrorComponent],
      imports: [MatFormFieldModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN the component is initialised', () => {
    test('THEN it should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
