import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent } from './alert.component';
import { MatIconModule } from '@angular/material/icon';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [AlertComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on approve', () => {
    jest.spyOn(component.whenActioned, 'emit');
    component.onApprove();
    expect(component.whenActioned.emit).toHaveBeenCalledWith('approved');
  });

  it('should emit on close', () => {
    jest.spyOn(component.whenClosed, 'emit');
    component.onClose();
    expect(component.whenClosed.emit).toHaveBeenCalled();
  });

  it('should emit on reject', () => {
    jest.spyOn(component.whenActioned, 'emit');
    component.onReject();
    expect(component.whenActioned.emit).toHaveBeenCalledWith('rejected');
  });
});
