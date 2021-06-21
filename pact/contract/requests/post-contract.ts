import { CreateUpdateContract } from '@app/features/contracts/models/contract.model';
import { ResolutionType } from '@app/features/products/models/rule.model';

export const createContractBody: CreateUpdateContract = {
  productCategoryId: 'productCategoryId',
  productCategoryName: 'productCategoryName',
  productName: 'productName',
  calculationType: 'STANDARD',
  channelReference: 'foo',
  currencies: {
    GBP: {
      referenceRateType: 'LIBOR',
      dayCountConvention: 'actual/360',
      decimals: 2,
      minCashflowAmount: 100,
      maxCashflowAmount: 100000,
      minPaymentAmount: 100,
      maxPaymentAmount: 100000,
      paymentDate: {
        calendars: ['cal-1'],
        adjustmentType: 'CALENDAR',
      },
      acceptanceDate: {
        calendars: ['cal-1'],
        adjustmentType: 'CALENDAR',
      },
      maturityDate: {
        calendars: ['cal-1'],
        adjustmentType: 'CALENDAR',
        bufferDays: 1,
        setDay: 1,
      },
    },
  },
  bypassTradeAcceptance: true,
  discountMode: 'AUTO',
  documentTypes: [],
  entity: {
    id: 'b593aa97-0d5a-4ad9-b015-d3e9dee9e398',
    name: 'entity1',
  },
  facility: {
    id: 'b593aa97-0d5a-4ad9-b015-d3e9dee9e398',
    name: 'fac1',
  },
  exclusions: ['PAST_DUE'],
  maxTenor: 0,
  minTenor: 0,
  name: 'Contract',
  partnerId: 'earnd',
  pricingOperation: {
    type: 'contract-total-facility',
    interpolated: true,
    spread: 3,
  },
  product: 'product1',
  productId: 'b593aa97-0d5a-4ad9-b015-d3e9dee9e397',
  referenceRateAdjustmentType: 'CALENDAR',
  referenceRateOffset: 0,
  roundingMode: 'UP',
  rules: [
    {
      name: 'rule1',
      resource: 'data',
      expression: 'expr1',
      message: 'failed criteria',
      code: '100',
      matchExpression: 'expr2',
      resolutionType: ResolutionType.EXTERNAL,
      outcomeType: 'RESOLVABLE',
      outcomeDescription: 'outcomeDesc',
    },
  ],
  settlementDays: 0,
  status: 'ACTIVE',
  tradingCutoff: '17:00',
};

export const updateContractBody: CreateUpdateContract = {
  ...createContractBody,
  name: 'Contract2',
};
