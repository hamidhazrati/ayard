import { HttpParams } from '@angular/common/http';
import { GdsPaginationEvent } from '@greensill/gds-ui/data-table';
import { GdsSorting } from '@greensill/gds-ui/data-table/shared/data-table-types';

export interface PageRequest {
  page: number;
  size: number;
  sort?: string;
}

export class PageRequestFactory {
  public createHttpParams(
    pageEvent?: GdsPaginationEvent,
    sorting?: GdsSorting,
    searchQuery?: string,
  ): HttpParams {
    return new HttpParams({
      fromObject: {
        page: pageEvent?.page ? `${pageEvent.page}` : '0',
        size: pageEvent?.pageSize ? `${pageEvent.pageSize}` : '10',
        ...(sorting?.dir && { sort: `${sorting.prop},${sorting.dir}` }),
        ...(searchQuery && { searchQuery }),
      },
    });
  }
}
