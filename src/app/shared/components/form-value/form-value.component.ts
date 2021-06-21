import { Component } from '@angular/core';

@Component({
  selector: 'app-form-value',
  template: `<div class="form-value"><ng-content></ng-content></div>`,
  styleUrls: ['./form-value.component.scss'],
})
export class FormValueComponent {
  constructor() {}
}
