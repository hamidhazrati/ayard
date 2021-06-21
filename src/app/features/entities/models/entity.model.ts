import { LegalEntityAttribute } from './legal-entity-attribute.model';
import { Address } from './address.model';
import { OmitId, PickId } from '@app/shared/model/model-helpers';

interface TradeStyleName {
  name: string;
  priority: number;
}

interface RegistrationNumber {
  typeDescription: string;
  registrationNumber: string;
}

interface IndustryCode {
  typeDescription: string;
  code: string;
  description: string;
}

interface FamilyTreeRole {
  description: string;
}

interface CMPCVFData {
  registrationnumbers?: RegistrationNumber[];
  incorporateddate?: string;
  industrycodes?: IndustryCode[];
  businessentitytype_description?: string;
  dunscontrolstatus_operatingstatus_description?: string;
  primaryaddress_isregisteredaddress?: boolean;
  controlownershiptype_description?: string;
  corporatelinkage_familytreerolesplayed?: FamilyTreeRole[];
  corporatelinkage_globalultimate_primaryname?: string;
  corporatelinkage_globalultimate_duns?: string;
  corporatelinkage_domesticultimate_primaryname?: string;
  corporatelinkage_domesticultimate_duns?: string;
  corporatelinkage_parent_primaryname?: string;
  corporatelinkage_parent_duns?: string;
  legalform_description?: string;
}

interface CleanseMatchData {
  tradeStyleNames?: TradeStyleName[];
  registrationNumbers?: RegistrationNumber[];
  corporateLinkage?: { familytreeRolesPlayed?: FamilyTreeRole[] };
}

export interface PackagesData {
  CMPCVF?: CMPCVFData;
  CLEANSE_MATCH?: CleanseMatchData;
}

export interface Entity {
  id: string;
  name: string;
  dunsNumber?: string;
  address: Address;
  packagesData?: PackagesData;
  registeredAddress?: Address;
  shortName?: string;
  status?: string;
  tradeStyleNames?: TradeStyleName[];
  createdAt?: string;
  createdBy?: string;
}

export type CreatedEntity = PickId<Entity>;
export type CreateUpdateEntity = OmitId<Entity>;
