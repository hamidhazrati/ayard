import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPositiveTwoDecimal]',
})
export class PositiveTwoDecimalDirective {
  constructor() {}

  @HostListener('keypress', ['$event']) onPress(evt) {
    // @ts-ignore
    const o = evt.target.value;
    const x = o.split('.');
    if (x.length > 1) {
      if (x[1].length > 1) {
        return false;
      }
    }
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
