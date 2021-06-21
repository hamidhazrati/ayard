import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-adder-anchor',
  templateUrl: './adder-anchor.component.html',
  styleUrls: ['./adder-anchor.component.scss'],
})
export class AdderAnchorComponent {
  @Output()
  anchorClick = new EventEmitter<void>();

  constructor() {}

  emitClick() {
    this.anchorClick.emit();
  }
}
