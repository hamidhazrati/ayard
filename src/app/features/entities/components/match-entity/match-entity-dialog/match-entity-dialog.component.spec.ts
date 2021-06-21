import { MatchEntityDialogComponent } from './match-entity-dialog.component';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getByTestId } from '@app/shared/utils/test';
import { of } from 'rxjs';
import Mocked = jest.Mocked;
import { SharedModule } from '@app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { EntityMatchResult } from '@app/features/entities/models/entity-match-result.model';
import { MatchRequestService } from '@app/features/entities/services/match-request.service';
import { MockService } from '@app/shared/utils/test/mock';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

describe('MatchEntityDialogComponent', () => {
  let component: MatchEntityDialogComponent;
  let fixture: ComponentFixture<MatchEntityDialogComponent>;
  let dialogRef: Mocked<MatDialogRef<any>>;
  let matchRequestService: Mocked<MatchRequestService>;

  const entityresolveResult: EntityMatchResult = {
    id: 'f04a88b5-5847-4282-8727-26b247f86308',
    name: 'MCNAMEE',
    dunsNumber: null,
    address: {
      line1: null,
      line2: null,
      city: null,
      region: null,
      country: 'AU',
      regionName: 'Asia',
      postalCodeExtension: '2000',
      countryName: 'Australia',
      postalCode: null,
    },
    status: 'RESOLVED',
    matchCandidates: [
      {
        entityId: 'c10d265a-29b8-45bd-87a1-2071e66d6264',
        id: 'c10d265a-29b8-45bd-87a1-2071e66d6264',
        name: 'The Trustee for THE MCNAMEE FAMILY TRUST',
        dunsNumber: '742115303',
        entityIds: null,
        primaryAddress: {
          line1: '175A SWANN RD',
          line2: null,
          city: 'TARINGA',
          region: null,
          country: 'AU',
          regionName: 'Asia',
          postalCodeExtension: '2000',
          countryName: 'Australia',
          postalCode: '4068',
        },
        matchScore: 95.0,
        status: 'ACTIVE',
      },
    ],
  };

  const entityMatchResult: EntityMatchResult = {
    id: 'f04a88b5-5847-4282-8727-26b247f86308',
    name: 'MCNAMEE',
    dunsNumber: null,
    address: {
      line1: null,
      line2: null,
      city: null,
      region: null,
      regionName: 'Asia',
      postalCodeExtension: '2000',
      countryName: 'Australia',
      country: 'AU',
      postalCode: null,
    },
    status: 'REVIEW_REQUIRED',
    matchCandidates: [
      {
        entityId: null,
        id: 'c10d265a-29b8-45bd-87a1-2071e66d6264',
        name: 'The Trustee for THE MCNAMEE FAMILY TRUST',
        dunsNumber: '742115303',
        entityIds: null,
        primaryAddress: {
          line1: '175A SWANN RD',
          line2: null,
          city: 'TARINGA',
          region: null,
          country: 'AU',
          regionName: 'Asia',
          postalCodeExtension: '2000',
          countryName: 'Australia',
          postalCode: '4068',
        },
        matchScore: 95.0,
        status: 'ACTIVE',
      },
      {
        entityId: 'd3e54bc9-7198-4f0a-9535-b3d49c610968',
        id: 'b10d265a-29b8-45bd-87a1-2071e66d6266',
        name: 'MCNAMEE PTY LTD',
        dunsNumber: '750878824',
        entityIds: null,
        primaryAddress: {
          line1: '353 Indooroopilly Rd',
          line2: '',
          city: 'Indooroopilly',
          region: 'Asia Pacific',
          regionName: 'Asia',
          postalCodeExtension: '2000',
          countryName: 'Australia',
          country: 'AU',
          postalCode: '4068',
        },
        matchScore: 95.0,
        status: 'ACTIVE',
      },
    ],
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatTableModule, SharedModule, RouterTestingModule],
      declarations: [MatchEntityDialogComponent],
      providers: [
        {
          provide: MatchRequestService,
          useValue: matchRequestService = MockService(MatchRequestService),
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            data: '1234-abcd-1234',
          },
        },
        {
          provide: MatDialogRef,
          useValue: dialogRef = {
            close: jest.fn(),
          } as any,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    matchRequestService.getMatchingCandidates.mockReturnValue(of(entityMatchResult));
    matchRequestService.resolve.mockReturnValue(of(entityresolveResult));
    fixture = TestBed.createComponent(MatchEntityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('GIVEN MatchEntityDialogComponent has been initialised', () => {
    test('THEN the summary section is shown', () => {
      const noOfMatchingRecords = getByTestId(fixture, 'number-of-matching-records');
      expect(noOfMatchingRecords).toBeTruthy();

      const matchRequestEntityName = getByTestId(fixture, 'match-request-entity-name');
      expect(matchRequestEntityName).toBeTruthy();

      const secondRowEntityName = fixture.nativeElement
        .querySelector(
          '[data-testid="attribute-row-0"] > [data-testid="entity-name-and-action-buttons"] > [data-testid="entity-name"]',
        )
        .textContent.trim();

      expect(secondRowEntityName).toEqual('The Trustee for THE MCNAMEE FAMILY TRUST');

      const cancelButton = getByTestId(fixture, 'cancel');
      expect(cancelButton).toBeTruthy();
    });
  });

  describe('GIVEN matching entities are shown', () => {
    test('THEN I click Use this record button', () => {
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="attribute-row-1"] > [data-testid="entity-name-and-action-buttons"] > [data-testid="action-buttons"] > [data-testid="use-existing-entity"]',
      );
      trigger.click();
      fixture.detectChanges();

      expect(dialogRef.close).toHaveBeenCalledWith('c10d265a-29b8-45bd-87a1-2071e66d6264');
    });
  });
});
