import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-full-screen-modal',
  templateUrl: './full-screen-modal.component.html',
  styleUrls: ['./full-screen-modal.component.scss'],
})
export class FullScreenModalComponent {
  isShown = false;

  constructor() {}

  open(): void {
    this.isShown = true;
  }

  close(): void {
    this.isShown = false;
  }
}
