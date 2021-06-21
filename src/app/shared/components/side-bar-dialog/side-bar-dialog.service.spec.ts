import { TestBed } from '@angular/core/testing';

import { SideBarDialogService } from './side-bar-dialog.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import Mocked = jest.Mocked;

type TestDataType = { someData: true };

@Component({ template: '<div>Test</div>' })
export class TestComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<TestComponent, TestDataType>,
  ) {
    setTimeout(() => {
      this.dialogRef.close(this.data);
    });
  }
}

describe('SideBarDialogService', () => {
  let service: SideBarDialogService;
  let matDialog: Mocked<MatDialog>;
  let router: Mocked<Router>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialog, useValue: matDialog = MockService(MatDialog) as Mocked<MatDialog> },
        { provide: Router, useValue: router = MockService(Router) as Mocked<Router> },
      ],
    });
    service = TestBed.inject(SideBarDialogService);
  });

  describe('GIVEN the service is initialised', () => {
    test('THEN it should be created', () => {
      expect(service).toBeTruthy();
    });

    describe('WHEN open dialog should return observable', () => {
      test('THEN it should return reference', async () => {
        const expectedData: TestDataType = {
          someData: true,
        };

        matDialog.open.mockImplementation((_, { data }) => {
          return {
            afterClosed: () => of(data),
          } as MatDialogRef<TestComponent, TestDataType>;
        });

        const closed = await service
          .open<TestComponent, TestDataType, TestDataType>(TestComponent, expectedData)
          .afterClosed()
          .toPromise();

        expect(closed).toEqual(expectedData);
      });

      test('THEN it should return reference with undefined data', async () => {
        const expectedData: TestDataType = {
          someData: true,
        };

        matDialog.open.mockImplementation((_, { data }) => {
          return {
            afterClosed: () => of(data),
          } as MatDialogRef<TestComponent, TestDataType>;
        });

        const closed = await service
          .open<TestComponent, TestDataType, TestDataType>(TestComponent)
          .afterClosed()
          .toPromise();

        expect(matDialog.open).toHaveBeenCalledWith(TestComponent, {
          data: undefined,
          position: { right: '0' },
          height: '100%',
          width: '900px',
          hasBackdrop: false,
          panelClass: 'sidebar',
        });
        expect(closed).toEqual(undefined);
      });

      test('THEN it should return reference with given width and undefined data', async () => {
        const expectedData: TestDataType = {
          someData: true,
        };

        matDialog.open.mockImplementation((_, { data }) => {
          return {
            afterClosed: () => of(data),
          } as MatDialogRef<TestComponent, TestDataType>;
        });

        const closed = await service
          .open<TestComponent, TestDataType, TestDataType>(TestComponent, undefined, 200)
          .afterClosed()
          .toPromise();

        expect(matDialog.open).toHaveBeenCalledWith(TestComponent, {
          data: undefined,
          position: { right: '0' },
          height: '100%',
          width: '200px',
          hasBackdrop: false,
          panelClass: 'sidebar',
        });
        expect(closed).toEqual(undefined);
      });

      test('THEN it should return reference with expected data and given width', async () => {
        const expectedData: TestDataType = {
          someData: true,
        };

        matDialog.open.mockImplementation((_, { data }) => {
          return {
            afterClosed: () => of(data),
          } as MatDialogRef<TestComponent, TestDataType>;
        });

        const closed = await service
          .open<TestComponent, TestDataType, TestDataType>(TestComponent, expectedData, 200)
          .afterClosed()
          .toPromise();

        expect(matDialog.open).toHaveBeenCalledWith(TestComponent, {
          data: {
            someData: true,
          },
          position: { right: '0' },
          height: '100%',
          width: '200px',
          hasBackdrop: false,
          panelClass: 'sidebar',
        });
        expect(closed).toEqual(expectedData);
      });
    });
  });
});
