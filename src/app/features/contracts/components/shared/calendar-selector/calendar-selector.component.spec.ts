import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSelectorComponent } from './calendar-selector.component';
import { moduleDeclarations, moduleImports } from '@app/features/contracts/contracts.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CalendarSelectorComponent', () => {
  let component: CalendarSelectorComponent;
  let fixture: ComponentFixture<CalendarSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: moduleDeclarations,
      imports: [NoopAnimationsModule, HttpClientTestingModule, ...moduleImports],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
