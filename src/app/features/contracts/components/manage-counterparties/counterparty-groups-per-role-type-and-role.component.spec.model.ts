import { Product } from '@app/features/products/models/product.model';
import { Contract } from '@app/features/contracts/models/contract.model';
import { ContractCounterparty } from '@app/features/contracts/models/counterparty.model';
import { ProductCounterpartyRole } from '@app/features/products/models/product-counterparty-role.model';

export const counterpartyRoles: ProductCounterpartyRole[] = [
  {
    name: 'BUYER',
    description: null,
    required: false,
    type: 'PRIMARY',
  },
  {
    name: 'OBLIGOR',
    description: null,
    required: false,
    type: 'PRIMARY',
  },
  {
    name: 'SELLER',
    description: null,
    required: false,
    type: 'RELATED',
  },
];

export const product: Product = {
  id: 'BP_99',
  status: null,
  productCategoryId: null,
  name: null,
  description: null,
  productGuideLink: null,
  counterpartyRoles,
  rules: [],
};
export const contract: Contract = {
  productName: '',
  productCategoryName: '',
  productCategoryId: '',
  name: 'Brian',
  status: 'PENDING_APPROVAL',
  productId: null,
  product: null,
  partnerId: '123',
  created: null,
  channelReference: null,
  rules: [],
  id: null,
  currencies: null,
  bypassTradeAcceptance: false,
  referenceRateOffset: 5,
  referenceRateAdjustmentType: 'BUSINESS',
  roundingMode: 'HALF_UP',
  settlementDays: 4,
  minTenor: 1,
  maxTenor: 9,
  tradingCutoff: 'tradingCutoff',
  calculationType: 'STANDARD',
  pricingOperation: {
    type: 'SPREAD_PLUS_REFERENCE_RATE',
    interpolated: true,
    spread: 500,
  },
  documentTypes: ['INVOICE'],
  exclusions: ['FUTURE_DATED_RECEIVABLES'],
  discountMode: 'AUTO',
  advanceRate: 23,
  automatedPayment: true,
  bauObligorName: 'bauObligorName',
  discountPosting: 'discountPosting',
  leadDays: 2,
  rejectionMode: 'NONE',
};
export const counterparties: ContractCounterparty[] = [
  {
    name: 'CP A',
    role: 'BUYER',
    roleType: 'PRIMARY',
    id: 'id_A',
    entityId: null,
    counterpartyReference: 'CP_A',
    verificationStatus: 'ACTIVE',
  },
  {
    name: 'CP B',
    role: 'BUYER',
    roleType: 'PRIMARY',
    id: 'id_B',
    entityId: null,
    counterpartyReference: 'CP_B',
    verificationStatus: 'INACTIVE',
    exceptions: [
      {
        code: 'LIMIT_REQUIREMENTS_NOT_MET',
        message: 'No Limits',
      },
    ],
  },
  {
    name: 'CP C',
    role: 'SELLER',
    roleType: 'RELATED',
    id: 'id_C',
    entityId: null,
    counterpartyReference: 'CP_C',
    verificationStatus: 'INACTIVE',
    exceptions: [
      {
        code: 'CREDIT_APPROVAL_REQUIRED',
        message: 'No credit approval',
      },
    ],
  },
  {
    name: 'CP D',
    role: 'OBLIGOR',
    roleType: 'PRIMARY',
    id: 'id_D',
    entityId: null,
    counterpartyReference: 'CP_D',
    verificationStatus: 'INACTIVE',
    exceptions: [
      {
        code: 'LIMIT_REQUIREMENTS_NOT_MET',
        message: 'No Limits',
      },
    ],
  },
];
