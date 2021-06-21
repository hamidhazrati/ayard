import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

export function getByTestId(
  fixture: ComponentFixture<any>,
  testId: string,
  failOnNotFound: boolean = false,
): DebugElement {
  const debugElement = fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));

  if (failOnNotFound && !debugElement) {
    fail(`Could not find "'${testId}"`);
  }

  return debugElement;
}

export function getComponentByTestId<C>(
  fixture: ComponentFixture<any>,
  testId: string,
  failOnNotFound: boolean = false,
): C {
  return getByTestId(fixture, testId, failOnNotFound).componentInstance as C;
}

export function getErrorTextForTestId(fixture: ComponentFixture<any>, testId: string) {
  return getByTestId(fixture, testId).nativeElement.textContent;
}
