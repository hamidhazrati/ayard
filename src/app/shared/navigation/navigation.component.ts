import { Component, OnInit, OnDestroy } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Subscription } from 'rxjs';
import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  crumbs: Breadcrumb[];
  private subscription: Subscription;

  constructor(private crumbService: CrumbService) {}

  ngOnInit(): void {
    this.subscription = this.crumbService.crumbs.pipe().subscribe((data) => {
      this.crumbs = [];
      this.crumbs.push(...data);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
