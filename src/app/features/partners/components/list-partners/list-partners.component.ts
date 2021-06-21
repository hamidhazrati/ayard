import { Component, OnInit } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { PartnerService } from '@app/features/partners/services/partner.service';
import { Partner } from '@app/features/partners/model/partner.model';
import { listPartnersCrumb } from '@app/features/partners/components/list-partners/list-partners.crumb';
import {
  GdsColumn,
  GdsPaginationEvent,
  GdsPaginationMeta,
  GdsSortEvent,
  SortDirection,
} from '@greensill/gds-ui/data-table';
import { PaginationMeta } from '@app/shared/pagination/model/Pagination';
import { LayoutService } from '@app/core/services/layout.service';
import { Page, PageRequestFactory } from '@app/shared/pagination';
import { take } from 'rxjs/operators';
import { GdsSorting } from '@greensill/gds-ui/data-table/shared/data-table-types';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-list-partners',
  templateUrl: './list-partners.component.html',
  styleUrls: ['./list-partners.component.scss'],
})
export class ListPartnerComponent implements OnInit {
  public paginationMeta: GdsPaginationMeta = PaginationMeta;
  public defaultSorts: GdsSorting[] = [
    {
      prop: 'name',
      dir: SortDirection.asc,
    },
  ];
  public sorting: GdsSorting;
  public rows: any = [];
  public columns: GdsColumn[] = [
    { prop: 'name', name: 'Partners', columnWidth: 3600 },
    { prop: 'id', name: 'Id', columnWidth: 1000 },
  ];
  private pageSize: number;

  constructor(
    private partnerService: PartnerService,
    private crumbService: CrumbService,
    private layoutService: LayoutService,
  ) {}

  ngOnInit(): void {
    this.crumbService.setCrumbs(listPartnersCrumb());
    this.layoutService.showBodyGrid(false);
    this.getPartners();
  }

  public getPartners(event?: GdsPaginationEvent) {
    // GdsPaginationEvent is not fired on a column sort
    // so any changes to pageSize on the ui are lost when sorting
    // cache pageSize so previously set value is not lost
    if (event) {
      this.pageSize = event.pageSize;
    }

    const params: HttpParams = new PageRequestFactory().createHttpParams(
      {
        ...event,
        ...(this.pageSize && { pageSize: this.pageSize }),
      },
      this.sorting || this.defaultSorts[0],
    );

    this.partnerService
      .getPartners(params)
      .pipe(take(1))
      .subscribe((page: Page<Partner>) => {
        this.rows = page.data;
        this.paginationMeta = Object.assign(this.paginationMeta, { ...page.meta.paged });
      });
  }

  public sort(event: GdsSortEvent): void {
    this.sorting = event.sorts[0];
    return this.getPartners();
  }
}
