import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-entity-dialogue',
  templateUrl: './entity-dialogue.component.html',
  styleUrls: ['./entity-dialogue.component.scss'],
})
export class EntityDialogueComponent implements OnInit {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: any,
    private readonly dialogRef: MatDialogRef<EntityDialogueComponent>,
    private readonly formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    const reason = ['', [Validators.required, Validators.minLength(5)]];
    this.form = this.formBuilder.group({ reason });
  }

  // events go here ----------------------------------------------------------------------------

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' });
  }

  onClose(): void {
    this.dialogRef.close({ action: this.data, data: this.form.value });
  }
}
