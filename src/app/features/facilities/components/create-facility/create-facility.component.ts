import { Component, OnInit } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Router } from '@angular/router';
import { FacilityService } from '@app/features/facilities/services/facility.service';
import { Facility } from '@app/features/facilities/models/facility.model';
import { CreateFacilityOperation } from '@app/features/facilities/models/facility-operate.model';
import { createFacilityCrumb } from '@app/features/facilities/components/create-facility/create-facility.crumb';

@Component({
  selector: 'app-create-facility',
  templateUrl: './create-facility.component.html',
  styleUrls: ['./create-facility.component.scss'],
})
export class CreateFacilityComponent implements OnInit {
  facility: Facility;

  constructor(
    private facilityService: FacilityService,
    private crumbService: CrumbService,
    private router: Router,
  ) {
    this.crumbService.setCrumbs(createFacilityCrumb());
  }

  ngOnInit(): void {}

  handleSubmit(operation: CreateFacilityOperation) {
    this.facilityService.operateFacility(operation).subscribe((res: Facility) => {
      this.router.navigate([`/facilities`, res.id]);
    });
  }
}
