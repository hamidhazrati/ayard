import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-entity-history',
  templateUrl: './entity-history.component.html',
  styleUrls: ['./entity-history.component.scss'],
})
export class EntityHistoryComponent {
  constructor(private readonly dialogRef: MatDialogRef<EntityHistoryComponent>) {}

  // events go here

  onCancel(): void {
    this.dialogRef.close();
  }
}
