import { Address } from './address.model';
import { PackagesData } from '@entities/models/entity.model';

export interface EntityMatchCandidate {
  id: string;
  entityId: string;
  name: string;
  dunsNumber: string;
  entityIds: string[];
  primaryAddress: Address;
  matchScore: number;
  status: string;
  packagesData?: PackagesData;
}
