import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDialogueComponent } from './entity-dialogue.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';

describe('EntityDialogueComponent', () => {
  let component: EntityDialogueComponent;
  let fixture: ComponentFixture<EntityDialogueComponent>;
  let dialogRef: MatDialogRef<EntityDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, MatIconModule, ReactiveFormsModule],
      declarations: [EntityDialogueComponent, MatLabel],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (data) => {},
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
      ],
    }).compileComponents();
    dialogRef = TestBed.inject(MatDialogRef);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    jest.spyOn(dialogRef, 'close');
    component.onClose();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog', () => {
    jest.spyOn(dialogRef, 'close');
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
