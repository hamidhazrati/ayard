interface BaseFacilitySearchQuery {
  type: string;
}

export interface ContractFacilitySearchQuery extends BaseFacilitySearchQuery {
  type: 'contract';
  entityId?: string;
}

export interface ByNameFacilitySearchQuery extends BaseFacilitySearchQuery {
  type: 'by-name-facility-search-query';
  name: string;
}

export type FacilitySearchQuery = ContractFacilitySearchQuery | ByNameFacilitySearchQuery;
