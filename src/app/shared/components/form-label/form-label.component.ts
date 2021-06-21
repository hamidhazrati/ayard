import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-label',
  templateUrl: './form-label.component.html',
  styleUrls: ['./form-label.component.scss'],
})
export class FormLabelComponent implements OnInit {
  @Input()
  for: string;

  @Input()
  required?: boolean;

  requiredHtml: string;

  constructor() {}

  ngOnInit() {
    if (this.required) {
      this.requiredHtml = ' *';
    }
  }
}
