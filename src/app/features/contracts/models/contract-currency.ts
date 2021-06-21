export interface Currency {
  referenceRateType: string;
  dayCountConvention: string;
  decimals: number;
  attributes: {
    minFundingAmount: number;
    maxFundingAmount: number;
  };
}
