import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Partner } from '@app/features/partners/model/partner.model';
import { PartnerService } from '@app/features/partners/services/partner.service';
import { viewPartnerCrumb } from '@app/features/partners/components/view-partner/view-partner.crumb';

@Component({
  templateUrl: './view-partner.component.html',
  styleUrls: ['./view-partner.component.scss'],
})
export class ViewPartnerComponent implements OnInit {
  public loading = false;
  public partner: Partner;

  constructor(
    private route: ActivatedRoute,
    private partnerService: PartnerService,
    private crumbService: CrumbService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.partnerService.getPartnerById(id).subscribe((data: Partner) => {
      this.partner = data;
      this.loading = false;
      this.crumbService.setCrumbs(viewPartnerCrumb(data));
    });
  }
}
