import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddContractFacilityDialogComponent } from './add-contract-facility-dialog.component';
import { NgStackFormsModule } from '@ng-stack/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '@app/shared/shared.module';
import { EntitiesModule } from '@entities/entities.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;

describe('AddContractFacilityDialogComponent', () => {
  let component: AddContractFacilityDialogComponent;
  let fixture: ComponentFixture<AddContractFacilityDialogComponent>;
  let matDialog: Mocked<MatDialog>;
  let dialogRef: Mocked<MatDialogRef<any>>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AddContractFacilityDialogComponent],
        imports: [
          HttpClientTestingModule,
          NgStackFormsModule,
          MatCardModule,
          MatIconModule,
          MatFormFieldModule,
          MatInputModule,
          MatListModule,
          MatDialogModule,
          RouterTestingModule,
          NoopAnimationsModule,
          MatSelectModule,
          MatTabsModule,
          SharedModule,
          EntitiesModule,
        ],
        providers: [
          {
            provide: MatDialog,
            useValue: matDialog = MockService(MatDialog) as Mocked<MatDialog>,
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: { parents: [{ id: 'parent123' }] },
          },

          {
            provide: MatDialogRef,
            useValue: dialogRef = {
              close: jest.fn(),
            } as any,
          },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContractFacilityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
