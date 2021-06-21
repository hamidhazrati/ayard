import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';
import { UtilService } from '@app/shared/util/util.service';

interface IColumn {
  id: string;
  label: string;
  format?: string;
  formatOption?: string;
  orderBy?: string;
  filter?: boolean;
}

interface ICounterPartyData {
  columns: string[];
  data: any[];
  source: any[];
  pagination: ICounterPartyPagination;
}

interface ICounterPartyPagination {
  end: number;
  itemsCount: number;
  pages: number;
  pageSize: number;
  pageSizeOptions: number[];
  start: number;
}

@Component({
  selector: 'gs-counterparties-table',
  templateUrl: './counterparties-table.component.html',
  styleUrls: ['./counterparties-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterpartiesTableComponent implements OnInit {
  @Input() searchable: boolean;
  @Input() source: any[];
  readonly dataSource: BehaviorSubject<ICounterPartyData> = new BehaviorSubject<ICounterPartyData>({
    columns: [],
    data: [], // visible rows
    source: [], // copy of original
    pagination: {
      end: 10,
      itemsCount: 0,
      pages: 0,
      pageSize: 10,
      pageSizeOptions: [5, 10, 25, 100],
      start: 0,
    },
  });

  ob$: Observable<ICounterPartyData> = this.dataSource.asObservable();
  columns$: Observable<any[]> = this.ob$.pipe(pluck('columns'), distinctUntilChanged());
  data$: Observable<any[]> = this.ob$.pipe(pluck('data'), distinctUntilChanged());
  pagination$: Observable<ICounterPartyPagination> = this.ob$.pipe(
    pluck('pagination'),
    distinctUntilChanged(),
  );
  showHelpers$: Observable<boolean> = this.ob$.pipe(
    map((item) => this.source.length > item.pagination.pageSize),
    distinctUntilChanged(),
  );

  columnList: IColumn[] = [
    { id: 'name', label: 'Entity', filter: true, orderBy: 'desc' },
    { id: 'duns', label: 'DUNS' },
    { id: 'currency', label: 'CCY' },
    { id: 'facilityExposure', label: 'Exposure', format: 'number', formatOption: '0.2' },
    { id: 'creditLimit', label: 'Credit Limit', format: 'number' },
    {
      id: 'creditAvailable',
      label: 'Credit Available',
      filter: true,
      format: 'number',
      formatOption: '0.2',
      orderBy: 'asc',
    },
    { id: 'insuranceLimit', label: 'Insurance Limit', format: 'number' },
    {
      id: 'insuranceAvailable',
      label: 'Insurance Available',
      format: 'number',
      formatOption: '0.2',
    },
    { id: 'insuranceLimitType', label: 'Insurance Limit Type' },
  ];

  order = ['asc', 'desc'];
  search = '';

  constructor(private readonly utilService: UtilService) {}

  ngOnInit(): void {
    const columns = this.columnList.map(({ id }) => id);
    const pagination = {
      ...this.dataSource.value.pagination,
      itemsCount: this.source?.length,
      pages: this.source.length
        ? Math.ceil(this.source.length / this.dataSource.value.pagination.pageSize)
        : 1,
    };
    const creditAvailable = this.columnList.find(
      (columnItem) => columnItem.id === 'creditAvailable',
    );
    const source = [...this.source]
      .map((data) => this.mapData(data))
      .sort((a, b) => this.orderData({ a, b }, creditAvailable));

    this.dataSource.next({ ...this.dataSource.value, pagination, source, columns });
    this.initializeData();
  }

  first(list: any): any {
    return Array.isArray(list) && list.length ? list[0] : null;
  }

  initializeData(): void {
    const { end, start } = this.dataSource.value.pagination;
    const data = [...this.dataSource.value.source.slice(start, end)].filter((item) =>
      this.searchFilter(item),
    );

    this.dataSource.next({ ...this.dataSource.value, data });
  }

  isNegative(num: number): boolean {
    return this.utilService.isNegative(num);
  }

  mapData(result: any) {
    const insuranceLimitType = result.insuranceResult
      ? result.insuranceResult.limit.defaultLimit
        ? 'DCL'
        : 'NAMED'
      : '';

    return {
      duns: result.classification.dunsNumber,
      creditAvailable: +result.creditResult?.available,
      creditLimit: +result.creditResult?.limit.limit,
      currency: this.first(result.results)?.currency,
      facilityExposure: +result.used,
      insuranceAvailable: +result.insuranceResult?.available,
      insuranceLimit: +result.insuranceResult?.limit.limit,
      insuranceLimitType,
      name: result.classification.name,
      rawValue: result,
    };
  }

  orderData(items, column) {
    const asc = items.a[column.id] > items.b[column.id];
    const desc = items.a[column.id] < items.b[column.id];

    if (column.orderBy === 'asc') {
      if (desc) {
        return -1;
      }
      if (asc) {
        return 1;
      }
    }

    if (column.orderBy === 'desc') {
      if (asc) {
        return -1;
      }
      if (desc) {
        return 1;
      }
    }

    return 0;
  }

  searchFilter(item) {
    return this.search.length
      ? item.name.toLowerCase().includes(this.search.toLowerCase()) ||
          item.duns.toLowerCase().includes(this.search.toLowerCase())
      : item;
  }

  // events go here --------------------------------------------------

  onFilterClick(column: IColumn): void {
    if (column.filter) {
      const find = this.order.findIndex((order) => order === column.orderBy);
      if (find > -1) {
        column.orderBy = this.order[find + 1] ? this.order[find + 1] : 'asc';
      }
      this.columnList = [...this.columnList].map((item) => (item.id === column.id ? column : item));

      const source = [...this.dataSource.value.source]
        .sort((a, b) => this.orderData({ a, b }, column))
        .filter((item) => this.searchFilter(item));
      const data = source.slice(0, this.dataSource.value.pagination.pageSize);
      const pagination = {
        ...this.dataSource.value.pagination,
        end: this.dataSource.value.pagination.pageSize,
        start: 0,
      };

      this.dataSource.next({ ...this.dataSource.value, data, pagination, source });
    }
  }

  onPageToggle({ pageIndex, pageSize }): void {
    const pagination = {
      ...this.dataSource.value.pagination,
      pageSize,
      end: pageSize * pageIndex + pageSize,
      start: pageSize * pageIndex,
    };

    if (this.search.length) {
      const data = [...this.dataSource.value.source]
        .filter((item) => this.searchFilter(item))
        .slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

      this.dataSource.next({ ...this.dataSource.value, data });
      return;
    }

    this.dataSource.next({ ...this.dataSource.value, pagination });
    this.initializeData();
  }

  onRowClick(row): void {
    // @TODO: Responsible for handling a row click event
  }

  onValueChange(ev: string): void {
    const source = [...this.dataSource.value.source].filter((item) => this.searchFilter(item));
    const pages = Math.ceil(source.length / this.dataSource.value.pagination.pageSize);
    const data = source.slice(0, this.dataSource.value.pagination.pageSize);
    const pagination = {
      ...this.dataSource.value.pagination,
      itemsCount: source.length,
      start: 0,
      pages,
      pageSize: this.dataSource.value.pagination.pageSize,
    };

    this.dataSource.next({ ...this.dataSource.value, data, pagination });
  }
}
