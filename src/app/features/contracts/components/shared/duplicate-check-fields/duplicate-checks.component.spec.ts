import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateChecksComponent } from './duplicate-checks.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DuplicateCheckField } from '@app/features/contracts/components/shared/duplicate-check-fields/model/duplicate-check-field';
import {
  verifySelectedOptions,
  verifySelectOptions,
} from '@app/shared/utils/test/verify-mat-select-options';
import { detectChanges } from '@app/shared/utils/test/detect-changes';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { SharedModule } from '@app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { getErrorTextForTestId } from '@app/shared/utils/test/get-by-testid';

const PERFORM_DUPLICATE_CHECK_CB_TESTID = 'perform-duplicate-check-cb';
const DUPLICATE_CHECK_SELECTOR_TESTID = 'duplicate-check-fields-multiple-selector';
const SELECTED_CHECKS_REQUIRED_ERROR_TESTID = 'selected-checks-error';

describe('WHEN DuplicateChecksSelectorComponent', () => {
  let loader: HarnessLoader;
  let component: DuplicateChecksComponent;
  let fixture: ComponentFixture<DuplicateChecksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatCheckboxModule,
        SharedModule,
      ],
      declarations: [DuplicateChecksComponent],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateChecksComponent);
    component = fixture.componentInstance;
    detectChanges(fixture);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('THEN should create', () => {
    expect(component).toBeTruthy();
  });

  describe('THEN it should contain checkbox and selector for "invoice type document" hash expressions', () => {
    let performDuplicateCheckCb: MatCheckboxHarness;
    let duplicateChecksSelector: MatSelectHarness;

    beforeEach(async () => {
      performDuplicateCheckCb = await loader.getHarness<MatCheckboxHarness>(
        MatCheckboxHarness.with({
          selector: `[data-testid="${PERFORM_DUPLICATE_CHECK_CB_TESTID}"]`,
        }),
      );
      expect(performDuplicateCheckCb).toBeTruthy();
      duplicateChecksSelector = await loader.getHarness<MatSelectHarness>(
        MatSelectHarness.with({
          selector: `[data-testid="${DUPLICATE_CHECK_SELECTOR_TESTID}"]`,
        }),
      );
      expect(duplicateChecksSelector).toBeTruthy();
    });

    it('THEN checkbox should be unticked, selector should be disabled, multiple and not open, component.selectedChecksControl.value should be []', async () => {
      expect(await performDuplicateCheckCb.isChecked()).toBeFalsy();
      expect(await duplicateChecksSelector.isDisabled()).toBeTruthy();
      expect(await duplicateChecksSelector.isMultiple()).toBeTruthy();
      expect(await duplicateChecksSelector.isOpen()).toBeFalsy();
      expect(component.selectedChecksControl.value).toEqual([]);
    });

    describe(`WHEN I check the ${PERFORM_DUPLICATE_CHECK_CB_TESTID}`, () => {
      const commonDuplicateCheckLabels = DuplicateChecksComponent.COMMON_DUPLICATE_CHECK_FIELDS.map(
        (duplicateCheckField: DuplicateCheckField) => duplicateCheckField.label,
      );
      beforeEach(async () => {
        await performDuplicateCheckCb.check();
      });

      describe(`AND I open ${DUPLICATE_CHECK_SELECTOR_TESTID}`, () => {
        beforeEach(async () => {
          await duplicateChecksSelector.open();
        });

        test('THEN it opens', async () => {
          const isOpen = await duplicateChecksSelector.isOpen();
          expect(isOpen).toBeTruthy();
        });

        test('THEN it shows all default options', async () => {
          await duplicateChecksSelector.open();
          await verifySelectOptions(duplicateChecksSelector, commonDuplicateCheckLabels);
        });

        describe('AND I immediately close it', () => {
          beforeEach(async () => {
            await duplicateChecksSelector.close();
          });

          test('THEN "Invoice duplicate check parameters" error is displayed', async () => {
            const error: string = getErrorTextForTestId(
              fixture,
              SELECTED_CHECKS_REQUIRED_ERROR_TESTID,
            );
            expect(error).toBeTruthy();
          });

          describe(`WHEN I uncheck the ${PERFORM_DUPLICATE_CHECK_CB_TESTID}`, () => {
            beforeEach(async () => {
              await performDuplicateCheckCb.uncheck();
              detectChanges(fixture);
            });

            test('THEN "Invoice duplicate check parameters" error disappears', async () => {
              const error: string = getErrorTextForTestId(
                fixture,
                SELECTED_CHECKS_REQUIRED_ERROR_TESTID,
              );
              expect(error).toBeFalsy();
            });
          });
        });

        describe(`WHEN I un-check the ${PERFORM_DUPLICATE_CHECK_CB_TESTID} again`, () => {
          beforeEach(async () => {
            await performDuplicateCheckCb.uncheck();
          });

          it('THEN the selector is again disabled', async () => {
            expect(await duplicateChecksSelector.isDisabled()).toBeTruthy();
          });
        });
      });

      describe('AND there are counterpartyRoles passed to the component AND I open the selector', () => {
        let allExpectedOptionsLabels: string[];
        const counterpartyRoles = ['Fire Warden', 'First Aider'];
        beforeEach(async () => {
          component.counterpartyRoles = counterpartyRoles;
          allExpectedOptionsLabels = [
            ...commonDuplicateCheckLabels,
            ...component.counterpartyRoles.map((roleType) => `Counterparty - ${roleType}`),
          ];
          detectChanges(fixture);
          duplicateChecksSelector = await loader.getHarness<MatSelectHarness>(MatSelectHarness);
          await duplicateChecksSelector.open();
        });

        test('THEN it opens', async () => {
          const isOpen = await duplicateChecksSelector.isOpen();
          expect(isOpen).toBeTruthy();
        });

        test('THEN it shows all default options plus an option for each counterparty', async () => {
          await verifySelectOptions(duplicateChecksSelector, allExpectedOptionsLabels);
        });

        describe('AND I attempt to select some fields', () => {
          beforeEach(async () => {
            await duplicateChecksSelector.clickOptions({
              text: DuplicateChecksComponent.COMMON_DUPLICATE_CHECK_FIELDS[0].label,
            });
            await duplicateChecksSelector.clickOptions({
              text: DuplicateChecksComponent.COMMON_DUPLICATE_CHECK_FIELDS[2].label,
            });
            await duplicateChecksSelector.clickOptions({
              text: `Counterparty - ${counterpartyRoles[0]}`,
            });
          });

          test('THEN they do get selected AND component.selectedChecksControl.value gets updated with hash expressions', async () => {
            await verifySelectedOptions(duplicateChecksSelector, [
              DuplicateChecksComponent.COMMON_DUPLICATE_CHECK_FIELDS[0].label,
              DuplicateChecksComponent.COMMON_DUPLICATE_CHECK_FIELDS[2].label,
              `Counterparty - ${counterpartyRoles[0]}`,
            ]);
            expect(component.selectedChecksControl.value).toEqual([
              DuplicateChecksComponent.COMMON_DUPLICATE_CHECK_FIELDS[0].hashExpression,
              DuplicateChecksComponent.COMMON_DUPLICATE_CHECK_FIELDS[2].hashExpression,
              `counterparties.?[role == '${counterpartyRoles[0]}'].size() > 0 ? counterparties.?[role == '${counterpartyRoles[0]}'][0].entityId : ''`,
            ]);
          });

          describe(`WHEN I uncheck ${PERFORM_DUPLICATE_CHECK_CB_TESTID} again`, () => {
            beforeEach(async () => {
              await performDuplicateCheckCb.uncheck();
            });

            test('THEN component.selectedChecksControl.value gets reset', async () => {
              expect(component.selectedChecksControl.value).toBeNull();
            });

            describe(`WHEN I check ${PERFORM_DUPLICATE_CHECK_CB_TESTID} again and select a value again`, () => {
              beforeEach(async () => {
                await performDuplicateCheckCb.check();

                await duplicateChecksSelector.clickOptions({
                  text: DuplicateChecksComponent.COMMON_DUPLICATE_CHECK_FIELDS[1].label,
                });
              });

              test('THEN component.selectedChecksControl.value has again correct data reflecting the selection', async () => {
                expect(component.selectedChecksControl.value).toEqual([
                  DuplicateChecksComponent.COMMON_DUPLICATE_CHECK_FIELDS[1].hashExpression,
                ]);
              });
            });
          });
        });
      });
    });
  });
});
