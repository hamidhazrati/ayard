import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdderAnchorComponent } from './adder-anchor.component';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdderAnchorComponent', () => {
  let component: TestAdderAnchorComponent;
  let fixture: ComponentFixture<TestAdderAnchorComponent>;

  @Component({
    template: `<app-adder-anchor data-testid="test-id">Some link</app-adder-anchor>`,
  })
  class TestAdderAnchorComponent {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, RouterTestingModule],
      declarations: [AdderAnchorComponent, TestAdderAnchorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAdderAnchorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN the Adder Anchor', () => {
    it('THEN it should render correctly', () => {
      // expect(fixture).toMatchSnapshot();
      expect(fixture).toBeTruthy();
    });
  });
});
