import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-card-section, app-card-title, app-card-content, app-card-actions',
  template: '<ng-content></ng-content>',
})
export class CardSectionComponent {
  constructor(private el: ElementRef) {}

  get elementTagName() {
    return this.el.nativeElement.tagName;
  }
}
