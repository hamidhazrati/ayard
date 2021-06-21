import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterpartyRoleSideBarComponent } from './counterparty-role-side-bar.component';
import { CounterpartyRoleListComponent } from '@app/features/products/components/create-product/counterparty-role-side-bar/counterparty-role-list/counterparty-role-list.component';
import { CounterpartyRoleConfiguratorComponent } from '@app/features/products/components/create-product/counterparty-role-side-bar/counterparty-role-configurator/counterparty-role-configurator.component';
import { MockComponent } from 'ng-mocks';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CounterpartyRoleSideBarComponent', () => {
  let component: CounterpartyRoleSideBarComponent;
  let fixture: ComponentFixture<CounterpartyRoleSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CounterpartyRoleSideBarComponent,
        MockComponent(CounterpartyRoleListComponent),
        MockComponent(CounterpartyRoleConfiguratorComponent),
      ],
      imports: [MatIconModule, MatStepperModule, MatDialogModule, NoopAnimationsModule],
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
    fixture = TestBed.createComponent(CounterpartyRoleSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN the component is instantiated', () => {
    test('THEN it should instantiate correctly', () => {
      expect(component).toBeTruthy();
    });
  });
});
