import { MatSelectHarness } from '@angular/material/select/testing';
import { MatOptionHarness } from '@angular/material/core/testing';

export async function verifySelectOptions(
  selectHarness: MatSelectHarness,
  expectedOptionsLabels: string[],
) {
  const selectorOptions: MatOptionHarness[] = await selectHarness.getOptions();
  expect(selectorOptions.length).toEqual(expectedOptionsLabels.length);
  const allOptionTextPromises: Promise<string>[] = selectorOptions.map((option) => {
    return option.getText();
  });
  const allOptionTexts: string[] = await Promise.all(allOptionTextPromises);
  expect([...allOptionTexts].sort()).toEqual([...expectedOptionsLabels].sort());
}

export async function verifySelectedOptions(
  selectHarness: MatSelectHarness,
  expectedSelectedOptionsLabels: string[],
) {
  await selectHarness.open();
  const options: MatOptionHarness[] = await selectHarness.getOptions({
    isSelected: true,
  });
  const optionTextPromises: Promise<string>[] = options.map((option) => option.getText());
  const optionsTexts = await Promise.all(optionTextPromises);
  expect([...optionsTexts].sort()).toEqual([...expectedSelectedOptionsLabels].sort());
}
