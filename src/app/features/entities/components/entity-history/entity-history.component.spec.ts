import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityHistoryComponent } from './entity-history.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('EntityHistoryComponent', () => {
  let component: EntityHistoryComponent;
  let fixture: ComponentFixture<EntityHistoryComponent>;
  let dialogRef: MatDialogRef<EntityHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, MatIconModule],
      declarations: [EntityHistoryComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
      ],
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    jest.spyOn(dialogRef, 'close');
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
