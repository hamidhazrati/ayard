export interface Page<T> {
  data: T[];
  meta: PageMeta;
}

interface PageMeta {
  paged: Paged;
}

export interface Paged {
  size: number;
  page: number;
  totalPages: number;
  pageSize: number;
  totalSize: number;
}
