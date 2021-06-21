import { Observable } from 'rxjs';
import { MatDialogState } from '@angular/material/dialog';

export interface SideBarDialogRef<T, R> {
  close(result?: R): void;
  afterOpened(): Observable<void>;
  afterClosed(): Observable<R | undefined>;
  beforeClosed(): Observable<R | undefined>;
  getState(): MatDialogState;
}
