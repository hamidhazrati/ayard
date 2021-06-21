import { Component, OnInit } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { dashboardCrumb } from '@app/features/dashboard/dashboard.crumb';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private crumbService: CrumbService) {}

  ngOnInit(): void {
    this.crumbService.setCrumbs(dashboardCrumb());
  }
}
