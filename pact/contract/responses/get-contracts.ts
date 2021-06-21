import { Contract } from '@app/features/contracts/models/contract.model';
import { Matchers } from '@pact-foundation/pact';
import { term } from '@pact-foundation/pact/dsl/matchers';
import { ResolutionType } from '@app/features/products/models/rule.model';

const { like, eachLike, iso8601DateTimeWithMillis } = Matchers;

type ContractPactType = Omit<Contract, 'channelReference' | 'entity'>;

export const getContractBody: ContractPactType = {
  id: 'b593aa97-0d5a-4ad9-b015-d3e9dee9e396',
  name: 'Contract',
  status: 'ACTIVE',
  partnerId: 'earnd',
  product: 'product1',
  productName: 'productName',
  productCategoryId: 'productCategoryId',
  productCategoryName: 'productCategoryName',
  productId: 'b593aa97-0d5a-4ad9-b015-d3e9dee9e397',
  created: '2020-08-14T12:17:47.720Z',
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
  facility: {
    id: 'b593aa97-0d5a-4ad9-b015-d3e9dee9e398',
    name: 'fac1',
  },
  roles: {
    role1: {
      limitRequirements: {
        requirements: [
          {
            limitType: 'CREDIT',
            validSources: ['DEFAULT'],
          },
        ],
      },
    },
  },
  hashExpressions: ['exp'],
  referenceRateOffset: 1,
  referenceRateAdjustmentType: 'BUSINESS',
  roundingMode: 'HALF_UP',
  settlementDays: 1,
  minTenor: 7,
  maxTenor: 28,
  tradingCutoff: '17:00',
  calculationType: 'STANDARD',
  pricingOperation: {
    interpolated: true,
    spread: 0.5,
    type: 'custom',
  },
  documentTypes: ['CREDIT_NOTE'],
  exclusions: ['PAST_DUE'],
  discountMode: 'AUTO',
  advanceRate: 2,
  automatedPayment: true,
  bauObligorName: 'earnd',
  discountPosting: 'foo',
  leadDays: 2,
  rejectionMode: 'NONE',
};

const likeDateAdjustmentConfig = {
  calendars: eachLike('cal-1'),
  adjustmentType: like('CALENDAR'),
};

const likeMaturityDateAdjustmentConfig = {
  calendars: eachLike('cal-1'),
  adjustmentType: like('CALENDAR'),
  bufferDays: like(1),
  setDay: like(1),
};

export const getContractMatcher = {
  id: like('b593aa97-0d5a-4ad9-b015-d3e9dee9e396'),
  name: like('Contract'),
  status: term({
    matcher: 'PENDING_APPROVAL|ACTIVE|INACTIVE|APPROVED',
    generate: 'ACTIVE',
  }),
  partnerId: like('earnd'),
  product: like('product1'),
  productName: like('productName'),
  productCategoryId: like('productCategoryId'),
  productCategoryName: 'productCategoryName',
  productId: like('b593aa97-0d5a-4ad9-b015-d3e9dee9e397'),
  created: iso8601DateTimeWithMillis('2020-08-14T12:17:47.720Z'),
  rules: eachLike({
    name: like('rule1'),
    resource: like('data'),
    expression: like('expr1'),
    message: like('failed criteria'),
    code: like('100'),
    resolutionType: like(ResolutionType.EXTERNAL),
    matchExpression: like('expr2'),
    outcomeType: term({ matcher: 'RESOLVABLE|TERMINAL', generate: 'RESOLVABLE' }),
    outcomeDescription: like('outcomeDesc'),
  }),
  currencies: {
    GBP: {
      referenceRateType: like('LIBOR'),
      dayCountConvention: like('actual/360'),
      decimals: like(2),
      minCashflowAmount: like(100),
      maxCashflowAmount: like(100000),
      minPaymentAmount: like(100),
      maxPaymentAmount: like(100000),
      paymentDate: { ...likeDateAdjustmentConfig },
      acceptanceDate: { ...likeDateAdjustmentConfig },
      maturityDate: { ...likeMaturityDateAdjustmentConfig },
    },
  },
  bypassTradeAcceptance: like(true),
  facility: {
    id: like('b593aa97-0d5a-4ad9-b015-d3e9dee9e398'),
    name: like('fac1'),
  },
  roles: {
    role1: like({
      limitRequirements: {
        requirements: eachLike({
          limitType: term({ generate: 'CREDIT', matcher: 'CREDIT|INSURANCE|GUARANTOR' }),
          validSources: eachLike(term({ generate: 'DEFAULT', matcher: 'NAMED|DEFAULT' })),
        }),
      },
    }),
  },
  hashExpressions: eachLike('exp'),
  referenceRateOffset: like(1),
  referenceRateAdjustmentType: term({ generate: 'BUSINESS', matcher: 'BUSINESS|CALENDAR' }),
  roundingMode: term({
    generate: 'HALF_UP',
    matcher: 'HALF_UP|UP|DOWN|CEILING|FLOOR|HALF_DOWN|HALF_EVEN|UNNECESSARY',
  }),
  settlementDays: like(1),
  minTenor: like(7),
  maxTenor: like(28),
  tradingCutoff: like('17:00'),
  calculationType: term({ generate: 'STANDARD', matcher: 'STANDARD|DISCOUNT_TO_YIELD' }),
  pricingOperation: {
    interpolated: like(true),
    spread: like(0.5),
    type: like('custom'),
  },
  documentTypes: eachLike(term({ generate: 'CREDIT_NOTE', matcher: 'INVOICE|CREDIT_NOTE' })),
  exclusions: eachLike(
    term({ generate: 'PAST_DUE', matcher: 'PAST_DUE|FUTURE_DATED_RECEIVABLES' }),
  ),
  discountMode: term({ generate: 'AUTO', matcher: 'AUTO|MANUAL' }),
  advanceRate: like(2),
  automatedPayment: like(true),
  bauObligorName: like('earnd'),
  discountPosting: like('foo'),
  leadDays: like(2),
  rejectionMode: term({ generate: 'NONE', matcher: 'NONE|AUTO' }),
};
