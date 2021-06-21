import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterpartyGroupsPerRoleComponent } from './counterparty-groups-per-role.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { MockComponent, MockService, ngMocks } from 'ng-mocks';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  contract,
  counterparties,
} from '@app/features/contracts/components/manage-counterparties/counterparty-groups-per-role-type-and-role.component.spec.model';
import Mocked = jest.Mocked;
import { CounterpartyListComponent } from '@app/features/contracts/components/shared/counterparty-list/counterparty-list.component';
import { MatMenuModule } from '@angular/material/menu';
import { getByTestId, triggerClick } from '@app/shared/utils/test';
import { MatMenuHarness, MatMenuItemHarness } from '@angular/material/menu/testing';
import {
  AddCounterpartyDialogComponent,
  AddCounterpartyDialogData,
} from '@app/features/contracts/components/shared/add-counterparty-dialog/add-counterparty-dialog.component';
import { of } from 'rxjs';

describe('GIVEN dependencies are provided for CounterpartyGroupsPerRoleComponent', () => {
  let loader: HarnessLoader;
  let component: CounterpartyGroupsPerRoleComponent;
  let fixture: ComponentFixture<CounterpartyGroupsPerRoleComponent>;
  let matDialog: Mocked<MatDialog>;
  let matDialogRef: Mocked<MatDialogRef<any, any>>;

  beforeEach(() => {
    matDialogRef = MockService(MatDialogRef) as Mocked<MatDialogRef<any, any>>;
    ngMocks.stub(matDialogRef, {
      afterClosed: () => {
        return of(counterparties[0]);
      },
    });
    matDialog = MockService(MatDialog) as Mocked<MatDialog>;
    ngMocks.stub(matDialog, {
      open: jest.fn(
        (
          dialogComponent: AddCounterpartyDialogComponent,
          config: {
            data: AddCounterpartyDialogData;
            width: string;
          },
        ) => {
          return matDialogRef;
        },
      ),
    });

    TestBed.configureTestingModule({
      declarations: [CounterpartyGroupsPerRoleComponent, MockComponent(CounterpartyListComponent)],
      imports: [MatTabsModule, MatMenuModule, MatDialogModule, NoopAnimationsModule, SharedModule],
      providers: [{ provide: MatDialog, useValue: matDialog }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterpartyGroupsPerRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  test('THEN the component should be created (no inputs)', () => {
    expect(component).toBeTruthy();
  });

  describe('GIVEN valid inputs are set', () => {
    beforeEach(async () => {
      component.counterparties = [counterparties[0], counterparties[1], counterparties[3]]; // BUYER, BUYER, OBLIGOR
      component.contract = contract;
      component.roles = ['BUYER', 'OBLIGOR', 'SELLER'];
      component.ngOnInit();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    test('THEN the component should be created', () => {
      expect(component).toBeTruthy();
    });

    describe('GIVEN all app-counterparty-list components for the corresponding component.roles are present', () => {
      let buyerCounterpartyList: CounterpartyListComponent;
      let obligorCounterpartyList: CounterpartyListComponent;

      beforeEach(async () => {
        buyerCounterpartyList = getByTestId(fixture, 'counterparty-list-BUYER')
          .componentInstance as CounterpartyListComponent;
        obligorCounterpartyList = getByTestId(fixture, 'counterparty-list-OBLIGOR')
          .componentInstance as CounterpartyListComponent;
      });

      test('THEN all of them have the correct contract set', () => {
        expect(buyerCounterpartyList.contract).toEqual(contract);
        expect(obligorCounterpartyList.contract).toEqual(contract);
      });

      test('THEN they have the correct counterparties set', () => {
        expect(buyerCounterpartyList.counterparties).toEqual([
          counterparties[0],
          counterparties[1],
        ]);
        expect(obligorCounterpartyList.counterparties).toEqual([counterparties[3]]);
      });
    });

    describe('AND I try to obtain a handle to add-counterparty button', () => {
      let addCounterpartyButton;
      beforeEach(async () => {
        addCounterpartyButton = getByTestId(fixture, 'add-counterparty');
        fixture.detectChanges();
      });

      test('THEN add-counterparty button is found', async () => {
        expect(addCounterpartyButton).toBeTruthy();
      });

      describe('GIVEN I can find the menu in the DOM', () => {
        let addCounterpartyMenu: MatMenuHarness;
        beforeEach(async () => {
          addCounterpartyMenu = await loader.getHarness<MatMenuHarness>(
            MatMenuHarness.with({
              selector: `[data-testid="add-counterparty"]`,
            }),
          );
        });

        test('THEN the menu is closed', async () => {
          expect(await addCounterpartyMenu.isOpen()).toBeFalsy();
        });

        describe('WHEN I click the add-counterparty button', () => {
          beforeEach(() => {
            triggerClick(fixture, addCounterpartyButton);
            fixture.detectChanges();
          });

          test('THEN the menu is open', async () => {
            expect(await addCounterpartyMenu.isOpen()).toBeTruthy();
          });

          describe('GIVEN I extract the menu items', () => {
            let menuItems: MatMenuItemHarness[];
            beforeEach(async () => {
              menuItems = await addCounterpartyMenu.getItems();
            });

            test('THEN there is a menu item for each role in component.roles', async () => {
              expect(menuItems.length).toEqual(3);
              const menuItemsTexts = [
                await menuItems[0].getText(),
                await menuItems[1].getText(),
                await menuItems[2].getText(),
              ];
              expect(menuItemsTexts).toEqual(['BUYER', 'OBLIGOR', 'SELLER']); // even though there are no counterparties with role SELLER the menu item is shown
            });

            describe('GIVEN I click on the "BUYER" item', () => {
              beforeEach(async () => {
                spyOn(component.counterpartiesChangedEventEmitter, 'emit');
                await menuItems[0].click();
                fixture.detectChanges();
              });

              test('THEN dialog.open is called', async () => {
                expect(matDialog.open).toHaveBeenCalled();
              });

              describe('WHEN the dialog gets closed', () => {
                // Because of the mock setup dialog gets closed immediately after it is opened.
                test('THEN component.counterpartiesChangedEventEmitter.emit is called to emit the correct CounterpartiesChangedEvent', async () => {
                  expect(component.counterpartiesChangedEventEmitter.emit).toHaveBeenCalledWith({
                    action: 'addCounterparty',
                    counterparty: counterparties[0],
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
