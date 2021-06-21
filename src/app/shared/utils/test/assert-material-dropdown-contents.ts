import { ComponentFixture } from '@angular/core/testing';
import { triggerClick } from './trigger-click';
import { DebugElement, Predicate } from '@angular/core';
import { By } from '@angular/platform-browser';

export async function assertMaterialDropdownContents(
  fixture: ComponentFixture<any>,
  predicate: Predicate<DebugElement>,
  dropdownContents: string[],
) {
  const dropdownDebugElement = fixture.debugElement.query(predicate);
  triggerClick(fixture, dropdownDebugElement);
  await fixture.whenStable().then(() => {
    const options: DebugElement[] = dropdownDebugElement.queryAll(By.css('mat-option'));
    expect(dropdownContents.length).toEqual(options.length);
    options.forEach((categoryOptionDebugElement: DebugElement) => {
      expect(
        dropdownContents.includes(categoryOptionDebugElement.nativeElement.textContent),
      ).toBeTruthy();
    });
  });
}
