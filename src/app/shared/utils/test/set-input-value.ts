import { DebugElement } from '@angular/core';
import { tick } from '@angular/core/testing';

export function setInputValueWithDebounce(
  input: DebugElement,
  value: string,
  debounceTime: number,
): void {
  setInputValue(input, value);
  tick(debounceTime);
}

export function setInputValue(input: DebugElement, value: string): void {
  input.nativeElement.value = value;
  input.nativeElement.dispatchEvent(new Event('input'));
  input.nativeElement.dispatchEvent(new Event('blur'));
}
