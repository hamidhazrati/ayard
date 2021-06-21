import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnacceptedCashflowDialogueComponent } from '@cashflows/components/view-origination-proposal/proposal-table/unaccepted-cashflow-dialogue/unaccepted-cashflow-dialogue.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InjectionToken } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UnacceptedCashflow', () => {
  let fixture: ComponentFixture<UnacceptedCashflowDialogueComponent>;
  let component: UnacceptedCashflowDialogueComponent;
  let matDialogRef: MatDialogRef<any>;
  let matDialogData: InjectionToken<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
      ],
      declarations: [UnacceptedCashflowDialogueComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            isCancelled: false,
          },
        },
      ],
    });

    fixture = TestBed.createComponent(UnacceptedCashflowDialogueComponent);
    component = fixture.componentInstance;
    matDialogRef = TestBed.inject(MatDialogRef);
    matDialogData = TestBed.inject(MAT_DIALOG_DATA);
    fixture.detectChanges();
  });

  it('should be initialized.', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialogue with data', () => {
    component.data = { ...component.data, isCancelled: false };
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      jest.spyOn(matDialogRef, 'close');
      component.cancel();
      expect(component.data.isCancelled).toBe(true);
      expect(matDialogRef.close).toHaveBeenCalled();
    });
  });
});
