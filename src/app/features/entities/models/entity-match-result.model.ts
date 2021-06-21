import { Address } from './address.model';
import { EntityMatchCandidate } from './entity-match-candidate.model';

export interface EntityMatchResult {
  id: string;
  name: string;
  dunsNumber: string;
  address: Address;
  status: string;
  matchCandidates: EntityMatchCandidate[];
}
