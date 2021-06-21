import { Address } from './address.model';

export interface EntitySearchResult {
  id: string;
  entityId: string;
  name: string;
  dunsNumber: string;
  entityIds: string[];
  primaryAddress: Address;
  matchScore: number;
  status: string;
  matchCandidates?: any[];
}
