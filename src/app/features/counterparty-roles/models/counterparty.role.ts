import { OmitId, PickId } from '../../../shared/model/model-helpers';

export interface CounterpartyRole {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

export type CreatedCounterpartyRole = PickId<CounterpartyRole>;
export type CreateUpdateCounterpartyRole = OmitId<CounterpartyRole>;
