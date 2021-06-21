import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicCounterpartyFormComponent } from './basic-counterparty-form.component';
import { moduleDeclarations, moduleImports } from '../../../contracts.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BasicCounterpartyFormComponent', () => {
  let component: BasicCounterpartyFormComponent;
  let fixture: ComponentFixture<BasicCounterpartyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [...moduleDeclarations],
      imports: [HttpClientTestingModule, NoopAnimationsModule, ...moduleImports],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicCounterpartyFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  describe('GIVEN BasicCounterpartyFormComponent is initialised', () => {
    test('THEN it should create component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('GIVEN form is empty', () => {
    test('THEN form should not be valid', () => {
      expect(component.form.valid).toBeFalsy();
    });
  });

  describe('GIVEN form complete', () => {
    test('THEN form should be valid', () => {
      component.form.controls.entity.setValue({
        id: 'AA.BB',
        name: 'Acme Corp. Int',
        dunsNumber: '000000000',
        address: null,
      });
      component.form.controls.name.setValue('Acme Corp.');
      component.form.controls.reference.setValue('ACM_001');

      expect(component.form.valid).toBeTruthy();
    });
  });

  describe('GIVEN name is not entered', () => {
    test('THEN it has a required error', () => {
      const name = component.form.controls.name;
      expect(name.valid).toBeFalsy();

      name.setValue('');
      expect(name.hasError('required')).toBeTruthy();
    });
  });

  describe('GIVEN reference is not entered', () => {
    test('THEN it is not required', () => {
      const reference = component.form.controls.reference;

      reference.setValue('');
      expect(reference.valid).toBeTruthy();
    });
  });

  describe('GIVEN references is not entered', () => {
    test('THEN it is not required', () => {
      const references = component.form.controls.references;

      references.setValue(null);
      expect(references.valid).toBeTruthy();
    });
  });

  describe('GIVEN entity is not entered', () => {
    test('THEN it has a required error', () => {
      const entity = component.form.controls.entity;
      expect(entity.valid).toBeFalsy();

      entity.setValue(null);

      expect(entity.hasError('required')).toBeTruthy();
    });
  });
});
