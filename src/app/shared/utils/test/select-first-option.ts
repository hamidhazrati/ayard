import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/*
 * It will select the first option in the dropdown.
 * This function assumes that you have named the data-testid on mat-select
 * and named the class on the mat-option a specific way e.g.
 *        <mat-select data-testid="test-id">
 *         <mat-option data-testid="test-id-option"></mat-option>
 *       </mat-select>
 */
export function selectFirstOption(fixture: ComponentFixture<any>, testId: string): void {
  const trigger = fixture.debugElement
    .query(By.css(`[data-testid="${testId}"]`))
    .query(By.css('.mat-select-trigger')).nativeElement;

  trigger.click();
  fixture.detectChanges();

  fixture.debugElement
    .queryAll(By.css(`[data-testid="${testId}-option"]`))[0]
    .nativeElement.click();
  fixture.detectChanges();
}
