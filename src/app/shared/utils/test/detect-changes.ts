import { ComponentFixture } from '@angular/core/testing';
import { OnChanges } from '@angular/core';

export function detectChanges(fixture: ComponentFixture<OnChanges>) {
  fixture.detectChanges();
  fixture.componentInstance.ngOnChanges(null);
}
