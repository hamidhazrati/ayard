import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutService } from './core/services/layout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  useBodyGrid: boolean;

  private layoutSubscription$: Subscription;

  constructor(private layoutService: LayoutService) {
    this.useBodyGrid = true;
  }

  ngOnInit(): void {
    this.layoutSubscription$ = this.layoutService.bodyGridStatus$.subscribe((status) => {
      this.useBodyGrid = status;
    });
  }

  ngOnDestroy(): void {
    this.layoutSubscription$.unsubscribe();
  }
}
