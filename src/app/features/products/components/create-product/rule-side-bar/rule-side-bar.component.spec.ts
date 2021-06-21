import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleSideBarComponent } from './rule-side-bar.component';
import {
  productsModuleDeclarations,
  productsModuleImports,
} from '@app/features/products/products.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

describe('RuleSideBarComponent', () => {
  let component: RuleSideBarComponent;
  let fixture: ComponentFixture<RuleSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [...productsModuleDeclarations],
      imports: [...productsModuleImports, HttpClientModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: undefined,
        },
        {
          provide: MatDialogRef,
          useValue: undefined,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('SAVE should first call validateProductRule', () => {
    const validateProductRule = spyOn(component.productService, 'validateProductRule');
    try {
      component.handleSave();
    } catch {
      // do nothing
    }
    expect(validateProductRule).toHaveBeenCalled();
  });
});
