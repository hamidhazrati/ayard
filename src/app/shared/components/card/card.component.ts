import { Component, ContentChildren, QueryList } from '@angular/core';
import { CardSectionComponent } from './card-section/card-section.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @ContentChildren(CardSectionComponent)
  cardSections: QueryList<CardSectionComponent>;

  constructor() {}

  containsSection(sectionName: string): boolean {
    const tagName = `app-card-${sectionName}`.toUpperCase();

    if (this.cardSections.find((section) => section.elementTagName === tagName)) return true;

    return false;
  }
}
