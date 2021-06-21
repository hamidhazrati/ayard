import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

export function triggerClick(fixture: ComponentFixture<any>, debugElement: DebugElement): void {
  const trigger = debugElement.nativeElement;
  trigger.click();
  fixture.detectChanges();
}
