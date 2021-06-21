import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityMatchResult } from '@app/features/entities/models/entity-match-result.model';
import { MatchRequestService } from '@app/features/entities/services/match-request.service';
import { MatTableDataSource } from '@angular/material/table';
import { EntityMatchCandidate } from '@app/features/entities/models/entity-match-candidate.model';

@Component({
  selector: 'app-match-entity-dialog',
  templateUrl: './match-entity-dialog.component.html',
  styleUrls: ['./match-entity-dialog.component.scss'],
})
export class MatchEntityDialogComponent implements OnInit {
  displayedColumns: string[] = ['entityName', 'entityIds', 'address', 'confidenceScore', 'status'];
  public entityMatchResult: EntityMatchResult;
  dataSource: MatTableDataSource<EntityMatchCandidate>;

  constructor(
    private matchRequestService: MatchRequestService,
    public dialogRef: MatDialogRef<MatchEntityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {}

  ngOnInit(): void {
    this.matchRequestService.getMatchingCandidates(this.data).subscribe(
      (res: EntityMatchResult) => {
        if (!res) {
          this.dialogRef.close({ noMatchedResults: true });
        }

        this.entityMatchResult = res;

        if (this.entityMatchResult && this.entityMatchResult.matchCandidates) {
          this.dataSource = new MatTableDataSource(this.entityMatchResult.matchCandidates);
        }
      },
      (error) => {
        console.error(error);
        this.dialogRef.close();
      },
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isValuePresent(value) {
    return value && value !== '';
  }

  useExistingEntity(entityId) {
    this.dialogRef.close(entityId);
  }

  resolveEntityToUse(matchCandidateId) {
    this.matchRequestService.resolve(this.data, matchCandidateId).subscribe(
      (res: EntityMatchResult) => {
        this.dialogRef.close(res.matchCandidates[0].entityId);
      },
      (error) => {
        console.error(error);
        this.dialogRef.close();
      },
    );
  }
}
