export function makeMultipleDropdownSelections(dropdownTestId: string, selectionLabels: string[]) {
  cy.get(`mat-select[data-testid="${dropdownTestId}"]`).click();
  selectionLabels.forEach((label) => cy.get('mat-option').contains(label).click());
  // close dropdown so interactions possible with other components
  cy.get('body').click();
}
