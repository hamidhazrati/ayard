import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Component } from '@angular/core';
import { CardSectionComponent } from './card-section/card-section.component';

describe('CardComponent', () => {
  let TestCardComponent;
  let fixture: ComponentFixture<CardComponent>;

  describe('GIVEN the card is given a title, content and actions', () => {
    beforeEach(async(() => {
      TestCardComponent = getTestComponent(`<app-card>
      <app-card-title data-testid="title">The title</app-card-title>
      <app-card-content data-testid="content">The content</app-card-content>
      <app-card-actions data-testid="actions">The actions</app-card-actions>
    </app-card>`);

      TestBed.configureTestingModule({
        declarations: [CardComponent, CardSectionComponent, TestCardComponent],
        imports: [MatCardModule, MatDividerModule],
      }).compileComponents();
    }));

    test('THEN it should render them correctly', () => {
      fixture = TestBed.createComponent(TestCardComponent);
      fixture.detectChanges();
      // expect(fixture).toMatchSnapshot();
      expect(fixture).toBeTruthy();
    });
  });

  describe('GIVEN the card is given no children', () => {
    beforeEach(async(() => {
      TestCardComponent = getTestComponent(`<app-card></app-card>`);

      TestBed.configureTestingModule({
        declarations: [CardComponent, CardSectionComponent, TestCardComponent],
        imports: [MatCardModule, MatDividerModule],
      }).compileComponents();
    }));

    test('THEN it should render correctly', () => {
      fixture = TestBed.createComponent(TestCardComponent);
      fixture.detectChanges();
      // expect(fixture).toMatchSnapshot();
      expect(fixture).toBeTruthy();
    });
  });

  function getTestComponent(template: string) {
    @Component({
      template,
    })
    class ComponentFromTemplate {}

    return ComponentFromTemplate;
  }
});
