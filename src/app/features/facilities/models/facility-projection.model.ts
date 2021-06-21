import { Facility } from '@app/features/facilities/models/facility.model';
import { Limit } from '@app/features/facilities/models/limit.model';
import { Entity } from '@entities/models/entity.model';

export interface Balance {
  currency: 'USD';
  provisionalInvestment: number;
  earmarkedInvestment: number;
  investment: number;
  maturity: number;
  earmarkedMaturity: number;
  provisionalMaturity: number;
  lockedMaturity: number;
  lockedInvestment: number;
}

export interface LimitResult<T extends Classifiable> {
  classification: T;
  currency: string;
  total?: number;
  limit?: Limit;
  used: number;
  available?: number;
  balance: Balance;
  breached: boolean;
  ok: boolean;
}

export interface Classifiable {
  type: string;
}

export interface HomogenousObject extends Classifiable {
  type: 'homogenous';
}

export interface Exposure<T extends Classifiable> {
  classification: T;
  results: LimitResult<T>[];
}

interface BaseExposureSet<T extends Classifiable> {
  type: string;
  results: Exposure<T>[];
}

export interface HomogenousExposureSet extends BaseExposureSet<HomogenousObject> {
  type: 'homogenous-exposure-set';
}

export interface EntityExposureSet extends BaseExposureSet<Entity & Classifiable> {
  type: 'entity-exposure-set';
}

export function isHomogenousExposureSet(
  exposureSet: BaseExposureSet<any>,
): exposureSet is HomogenousExposureSet {
  return exposureSet.type === 'homogenous-exposure-set';
}

export function isEntityExposureSet(
  exposureSet: BaseExposureSet<any>,
): exposureSet is EntityExposureSet {
  return exposureSet.type === 'entity-exposure-set';
}

export type ExposureSet = HomogenousExposureSet | EntityExposureSet;

export interface FacilityProjection {
  date: string;
  facility: Facility;
  exposure: ExposureSet;
  children: FacilityProjection[];
}
