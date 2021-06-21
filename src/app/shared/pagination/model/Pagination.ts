import { GdsPaginationMeta } from '@greensill/gds-ui/data-table';

export const PaginationMeta: GdsPaginationMeta = {
  externalPaging: true,
  externalSorting: true,
  pageLimitOptions: [{ value: 10 }, { value: 25 }, { value: 50 }, { value: 100 }],
  showItemsPerPageDropdown: true,
  showPageDropdown: true,
};

export class Pagination {
  pageSizeOptions: number[];
  pageIndex: number;
  pageSize: number;
  length: number;

  constructor(pageSizeOptions: number[]) {
    this.pageSizeOptions = pageSizeOptions;
    this.pageIndex = 0;
    this.pageSize = 10;
    this.length = 0;
  }
}
