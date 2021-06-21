import { Component, OnInit } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { MatDialog } from '@angular/material/dialog';
import { MatchEntityDialogComponent } from '@entities/components/match-entity/match-entity-dialog/match-entity-dialog.component';
import { matchEntityCrumb } from '@entities/components/match-entity/match-entity.crumb';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-match-entity',
  templateUrl: './match-entity.component.html',
})
export class MatchEntityComponent implements OnInit {
  form: FormGroup;
  selectedEntityId = '';

  constructor(
    private readonly crumbService: CrumbService,
    private readonly dialog: MatDialog,
    private readonly formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.crumbService.setCrumbs(matchEntityCrumb());
    this.form = this.formBuilder.group({
      id: ['', Validators.required],
    });
  }

  // events go here ------------------------------------------------------------

  onClick(): void {
    const dialogRef = this.dialog.open(MatchEntityDialogComponent, {
      maxHeight: '600px',
      data: this.form.get('id').value,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.noMatchedResults) {
        // show an alert here (Angular material alert)
        return;
      }
      this.selectedEntityId = result;
    });
  }
}
