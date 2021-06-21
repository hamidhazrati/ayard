import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { GdsTagModule } from '@greensill/gds-ui/tag';

import { ExceptionSidebarTitleComponent } from './exception-sidebar-title.component';

describe('ExceptionSidebarTitleComponent', () => {
  let component: ExceptionSidebarTitleComponent;
  let fixture: ComponentFixture<ExceptionSidebarTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExceptionSidebarTitleComponent],
      imports: [MatIconModule, GdsTagModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionSidebarTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN the component has been initialised', () => {
    it('THEN it should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('GIVEN the form is valid and then submitted', () => {
    it('THEN the api to update the task statuses is called', () => {
      jest.spyOn(component.closeDialogEvent, 'emit');
      component.emitCloseDialogEvent();
      expect(component.closeDialogEvent.emit).toHaveBeenCalled();
    });
  });
});
