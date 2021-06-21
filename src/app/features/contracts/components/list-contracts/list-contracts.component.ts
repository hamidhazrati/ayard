import { Component, OnInit } from '@angular/core';
import { ContractService } from '@app/features/contracts/services/contract.service';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { listContractsCrumb } from '@app/features/contracts/components/list-contracts/list-contracts.crumb';
import { Router } from '@angular/router';
import { Contract, ContractStatus } from '@app/features/contracts/models/contract.model';
import { LayoutService } from '@app/core/services/layout.service';
import {
  GdsColumn,
  GdsColumnType,
  GdsPaginationEvent,
  GdsPaginationMeta,
  GdsSortEvent,
  SortDirection,
} from '@greensill/gds-ui/data-table';
import { GdsSorting } from '@greensill/gds-ui/data-table/shared/data-table-types';
import { PaginationMeta } from '@app/shared/pagination/model/Pagination';
import { Page, PageRequestFactory } from '@app/shared/pagination';
import { take } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-list-contracts',
  templateUrl: './list-contracts.component.html',
  styleUrls: ['./list-contracts.component.scss'],
})
export class ListContractsComponent implements OnInit {
  private pageSize: number;
  private searchValue = '';
  public paginationMeta: GdsPaginationMeta = PaginationMeta;
  public sorting: GdsSorting;
  public defaultSorts: GdsSorting[] = [
    {
      prop: 'created',
      dir: SortDirection.desc,
    },
  ];
  public rows: any = [];
  public columns: GdsColumn[] = [
    { prop: 'name', name: 'Name', columnWidth: 350 },
    { prop: 'product', name: 'Product', type: GdsColumnType.TitleCase, columnWidth: 450 },
    { prop: 'status', type: GdsColumnType.InnerHTML, columnWidth: 160 },
    { prop: 'createdBy', name: 'Created By', type: GdsColumnType.InnerHTML, columnWidth: 150 },
    { prop: 'created', name: 'Created At', type: GdsColumnType.Date, columnWidth: 120 },
  ];
  constructor(
    private contractService: ContractService,
    private crumbService: CrumbService,
    private router: Router,
    private layoutService: LayoutService,
  ) {}

  ngOnInit(): void {
    this.crumbService.setCrumbs(listContractsCrumb());
    this.layoutService.showBodyGrid(false);
    this.getContracts();
  }

  public getContracts(event?: GdsPaginationEvent) {
    // GdsPaginationEvent is not fired on a column sort
    // so any changes to pageSize on the ui are lost when sorting
    // cache pageSize so previously set value is not lost
    if (event) {
      this.pageSize = event.pageSize;
    }

    const params: HttpParams = new PageRequestFactory()
      .createHttpParams(
        {
          ...event,
          ...(this.pageSize && { pageSize: this.pageSize }),
        },
        this.sorting || this.defaultSorts[0],
      )
      .set('name_contains', this.searchValue);

    const statusTransform = {
      PENDING_APPROVAL: 'Pending Approval',
      APPROVED: 'Approved',
      ACTIVE: 'Active',
      INACTIVE: 'Inactive',
    };

    this.contractService
      .getContracts(params)
      .pipe(take(1))
      .subscribe((page: Page<Contract>) => {
        page.data.forEach((contract: Contract) => {
          contract.status = statusTransform[contract.status] as ContractStatus;
        });
        this.rows = page.data;
        this.paginationMeta = Object.assign(this.paginationMeta, { ...page.meta.paged });
      });
  }

  public sort(event: GdsSortEvent): void {
    this.sorting = event.sorts[0];
    return this.getContracts();
  }

  viewContract(contract: Contract) {
    this.router.navigate(['/contracts', contract.id]);
  }

  performSearch(searchValue: string): void {
    this.searchValue = searchValue;
    this.getContracts();
  }
}
