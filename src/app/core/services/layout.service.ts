import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/*
 * Used by app.component and its child components to toggle to
 * body-grid off or on, depending on whether a page should be
 * full-width or not. The default is on. For an example of
 * setting it off; see list-cashflow-files
 */
@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private showBodyGridSource = new Subject<boolean>();

  public bodyGridStatus$ = this.showBodyGridSource.asObservable();

  public showBodyGrid(status: boolean): void {
    setTimeout(() => {
      this.showBodyGridSource.next(status);
    });
  }
}
