import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterpartyGroupsPerRoleTypeAndRoleComponent } from './counterparty-groups-per-role-type-and-role.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ContractService } from '@app/features/contracts/services/contract.service';
import { MockComponent, MockService } from 'ng-mocks';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTabGroupHarness, MatTabHarness } from '@angular/material/tabs/testing';
import Mocked = jest.Mocked;
import { of, Observable } from 'rxjs';
import {
  contract,
  counterparties,
} from '@app/features/contracts/components/manage-counterparties/counterparty-groups-per-role-type-and-role.component.spec.model';
import { CounterpartyGroupsPerRoleComponent } from '@app/features/contracts/components/manage-counterparties/counterparty-groups-per-role/counterparty-groups-per-role.component';
import { getByTestId, getComponentByTestId } from '@app/shared/utils/test/get-by-testid';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '@app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { COUNTERPARTY_ROLE_TYPE_LABELS } from '@app/features/products/models/product-counterparty-role.model';

describe('CounterpartyGroupsPerRoleTypeAndRoleComponent', () => {
  let loader: HarnessLoader;
  let component: CounterpartyGroupsPerRoleTypeAndRoleComponent;
  let fixture: ComponentFixture<CounterpartyGroupsPerRoleTypeAndRoleComponent>;
  let contractService: Mocked<ContractService>;

  beforeEach(() => {
    contractService = MockService(ContractService) as Mocked<ContractService>;

    TestBed.configureTestingModule({
      declarations: [
        CounterpartyGroupsPerRoleTypeAndRoleComponent,
        MockComponent(CounterpartyGroupsPerRoleComponent),
      ],
      imports: [MatTabsModule, MatDialogModule, NoopAnimationsModule, SharedModule],
      providers: [{ provide: ContractService, useValue: contractService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterpartyGroupsPerRoleTypeAndRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  test('should create (no inputs)', () => {
    expect(component).toBeTruthy();
  });

  describe('GIVEN contractService.getContractCounterpartiesById throws error', () => {
    beforeEach(async () => {
      contractService.getContractCounterpartiesById.mockReturnValue(
        new Observable((observer) => {
          observer.error(new Error());
        }),
      );
      component.contract = contract;
      component.ngOnInit();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    test('THEN errorMessage is displayed', async () => {
      const errorMessage = getByTestId(fixture, 'counterpartiesGroupsMessage');
      expect(errorMessage.nativeElement.textContent.trim()).toEqual(
        'Failed to load counterparties, please refresh to see whether the problem persists.',
      );
    });
  });

  describe('GIVEN contractService.getContractCounterpartiesById never completes', () => {
    beforeEach(async () => {
      contractService.getContractCounterpartiesById.mockReturnValue(
        new Observable((observer) => {
          observer.next(counterparties);
        }),
      );
      component.contract = contract;
      component.ngOnInit();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    test('THEN "Loading" message is displayed', async () => {
      const errorMessage = getByTestId(fixture, 'counterpartiesGroupsMessage');
      expect(errorMessage.nativeElement.textContent.trim()).toEqual('Loading');
    });
  });

  describe('GIVEN correct inputs are set', () => {
    beforeEach(async () => {
      contractService.getContractCounterpartiesById.mockReturnValue(of(counterparties));
      component.contract = contract;
      component.ngOnInit();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    describe('AND mat-tab-group and mat-tab components get created', () => {
      let tabGroup: MatTabGroupHarness;
      let tabs: MatTabHarness[];
      let selectedTab: MatTabHarness;
      beforeEach(async () => {
        tabGroup = await loader.getHarness<MatTabGroupHarness>(
          MatTabGroupHarness.with({
            selector: `[data-testid="mat-tab-group"]`,
          }),
        );
        tabs = await tabGroup.getTabs();
        selectedTab = await tabGroup.getSelectedTab();
      });

      test('THEN a tab is displayed for each role type', async () => {
        expect(tabGroup).toBeTruthy();
        expect(tabs.length).toEqual(2);
        expect(await tabs[0].getLabel()).toEqual(COUNTERPARTY_ROLE_TYPE_LABELS.PRIMARY);
        expect(await tabs[1].getLabel()).toEqual(COUNTERPARTY_ROLE_TYPE_LABELS.RELATED);
      });

      test(`THEN the first tab, which is labeled "${COUNTERPARTY_ROLE_TYPE_LABELS.PRIMARY}", is selected`, async () => {
        expect(await selectedTab.getLabel()).toEqual(COUNTERPARTY_ROLE_TYPE_LABELS.PRIMARY);
      });

      describe('GIVEN the child of type CounterpartyGroupsPerRoleComponent gets created', () => {
        let counterpartyGroupsPerRoleChild: CounterpartyGroupsPerRoleComponent;
        beforeEach(async () => {
          counterpartyGroupsPerRoleChild = getComponentByTestId<CounterpartyGroupsPerRoleComponent>(
            fixture,
            'counterparty-groups-per-role-PRIMARY',
          );
        });

        test('THEN the counterpartyGroupsPerRoleChild.roles get initialized correctly', async () => {
          expect(counterpartyGroupsPerRoleChild.roles).toEqual(['BUYER', 'OBLIGOR']);
        });

        test('THEN the counterpartyGroupsPerRoleChild.counterparties get initialized correctly', async () => {
          expect(counterpartyGroupsPerRoleChild.counterparties).toEqual([
            counterparties[0], // BUYER
            counterparties[1], // BUYER
            counterparties[3], // OBLIGOR
          ]);
        });
      });

      describe(`GIVEN the "${COUNTERPARTY_ROLE_TYPE_LABELS.RELATED}" tab gets selected`, () => {
        beforeEach(async () => {
          await tabGroup.selectTab({
            label: COUNTERPARTY_ROLE_TYPE_LABELS.RELATED,
          });
          selectedTab = await tabGroup.getSelectedTab();
        });

        test(`THEN the tab which is labeled "${COUNTERPARTY_ROLE_TYPE_LABELS.RELATED}" is selected`, async () => {
          expect(await selectedTab.getLabel()).toEqual(COUNTERPARTY_ROLE_TYPE_LABELS.RELATED);
        });

        describe('GIVEN the child of type CounterpartyGroupsPerRoleComponent gets created', () => {
          let counterpartyGroupsPerRoleChild: CounterpartyGroupsPerRoleComponent;
          beforeEach(async () => {
            counterpartyGroupsPerRoleChild = getComponentByTestId<
              CounterpartyGroupsPerRoleComponent
            >(fixture, 'counterparty-groups-per-role-RELATED');
          });

          test('THEN the counterpartyGroupsPerRoleChild.roles get initialized correctly', async () => {
            expect(counterpartyGroupsPerRoleChild.roles).toEqual(['SELLER']);
          });

          test('THEN the counterpartyGroupsPerRoleChild.counterparties get initialized correctly', async () => {
            expect(counterpartyGroupsPerRoleChild.counterparties).toEqual([counterparties[2]]);
          });
        });
      });
    });
  });
});
