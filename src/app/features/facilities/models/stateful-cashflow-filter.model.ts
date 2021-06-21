interface BaseStatefulCashflowFilter {
  type: string;
}

export interface AllStatefulCashflowFilter extends BaseStatefulCashflowFilter {
  type: 'all-filter';
}

export type StatefulCashflowFilter = AllStatefulCashflowFilter;

export function isAllStatefulCashflowFilter(
  filter: StatefulCashflowFilter,
): filter is AllStatefulCashflowFilter {
  return filter.type === 'all-filter';
}
